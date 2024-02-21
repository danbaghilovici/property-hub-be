
import {
    catchError,
    concatMap,
    defer,
    EMPTY,
    firstValueFrom,
    mergeMap,
    Observable,
    of,
    OperatorFunction,
    switchMap,
    tap
} from "rxjs";
import {NestApplicationContextOptions} from "@nestjs/common/interfaces/nest-application-context-options.interface";
import {INestApplication, INestApplicationContext, Logger, ValidationPipe} from "@nestjs/common";
import {NestApplication, NestFactory} from "@nestjs/core";
import process from "process";
import {ExpressAdapter} from "@nestjs/platform-express";
import express, {Express} from "express";
import {configure as serverlessExpress} from "@codegenie/serverless-express";
import * as core from "express-serve-static-core";
import {cors} from "cors"
import {APIGatewayProxyEventV2, Context, Handler} from "aws-lambda";

const LOGGER:Logger=new Logger("boot-utils.ts")
declare global {
    var cachedApp: INestApplicationContext;
    var cachedServer: Handler
}

export function getCachedApp():INestApplicationContext{
    return global.cachedApp;
}
export function printHandlerEvents(event: APIGatewayProxyEventV2, context: Context):Observable<any>{
    LOGGER.debug(`Received API GATEWAY event ${JSON.stringify(event)}`);
    LOGGER.debug(`Received API GATEWAY context ${JSON.stringify(context)}`);
    return of({});
}

export function createAppFromModuleAsync(moduleCls: any, options: NestApplicationContextOptions = getDefaultApplicationOptions()):Observable<INestApplicationContext> {
    if (!global.cachedApp) {
        // config({path:".env/local.env"});
        LOGGER.log("Initializing app");
        return defer(()=>NestFactory.createApplicationContext(moduleCls, options))
            .pipe(switchMap((app)=>{
                    return defer(()=>app.init());
                }),
                switchMap((app)=>{
                    global.cachedApp = app;
                    return of(app);
                }),
                catchError((error)=> {
                    console.error(error);
                    return EMPTY;
                }))
    }
    return of(global.cachedApp);
}

function configureNestApplication(nestApp: INestApplication):Observable<INestApplication<any>> {
    nestApp.enableCors({
        origin:"*",
        methods:"GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        allowedHeaders:"*",
        credentials:true,
        exposedHeaders:"*",
    });
    LOGGER.log("setting global prefix to '"+process.env.WORKSPACE+"'");
    nestApp.setGlobalPrefix(process.env.WORKSPACE);
    nestApp.useGlobalPipes(new ValidationPipe({
        enableDebugMessages:true,
        disableErrorMessages:false,
        transform:true,
    }));
    return of(nestApp);

}



function initNestApplication(nestApp: INestApplication):Observable<INestApplication<any>> {
    return defer(() => nestApp.init())
}

function generateHandler(nestApp:INestApplication):Observable<Handler> {
        global.cachedServer = serverlessExpress({app: nestApp.getHttpAdapter().getInstance()});
        LOGGER.log("Created cached server "+global.cachedServer);
        return of(global.cachedServer);
}


function generateNestApplication(moduleCls: any, options: NestApplicationContextOptions) :
    Observable<INestApplication>{
    return defer(() => NestFactory.create(moduleCls, options));
}

export function createOrGetLambdaHandler(
    moduleCls: any,
    options: NestApplicationContextOptions = getDefaultApplicationOptions()
):Observable<Handler>{
    if (!global.cachedServer) {
        LOGGER.log("Initializing app with prefix '"+process.env.WORKSPACE+"'");
        return createNestApplication(moduleCls, options)
            .pipe(
                switchMap((nestApp:INestApplication<any>)=>generateHandler(nestApp)),
                catchError((error)=> {
                    console.error(error);
                    return EMPTY;
                }))
    }
    return of(global.cachedServer);
}

export function createNestApplication(
    moduleCls: any,
    options: NestApplicationContextOptions = getDefaultApplicationOptions(),
    keepAlive:boolean=false
    ):Observable<INestApplication>{
    return generateNestApplication(moduleCls, options)
        .pipe(
            switchMap((nestApp:INestApplication<any>)=>configureNestApplication(nestApp)),
            switchMap((nestApp:INestApplication<any>)=>initNestApplication(nestApp)),
            switchMap((nestApp:INestApplication<any>)=>keepAlive?defer(()=>nestApp.listen(3001)):of(nestApp)));

}




export function getDefaultApplicationOptions(): NestApplicationContextOptions{
    return {logger:process.env.AWS_EXECUTION_ENV==="LOCAL"?LOGGER:console};
}

export function handleRequest(event:any,context:Context,callback:any,moduleCls:any):Promise<any>{
    return firstValueFrom(
        of({})
            .pipe(
                switchMap(() => printHandlerEvents(event, context)),
                switchMap(() => createOrGetLambdaHandler(moduleCls)),
                switchMap((serverHandler: Handler) =>{
                    // @ts-ignore
                    return defer(()=>serverHandler(event,context,callback))
                })
            ),{defaultValue:"err"}
    )
}

function boot(modelCls:any) {
    createNestApplication(modelCls,getDefaultApplicationOptions(),true).subscribe();
}
export function handleBooting(moduleCls:any){
    console.log(process.env.AWS_EXECUTION_ENV);
    process.env.AWS_EXECUTION_ENV === "LOCAL" ? boot(moduleCls) : LOGGER.log("No need to boot");
}
