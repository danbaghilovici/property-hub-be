import {ClassSerializerInterceptor, Module} from '@nestjs/common';
import {SharedService} from './shared.service';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {typeOrmAsyncConfig} from "../../../typeorm.config";
import {DecodingURIPipe} from "@app/shared/pipes/decoding/decode-uri-pipe.service";
import {ParseJsonPipe} from "@app/shared/pipes/parse-json/parse-json.pipe";
import {InvalidJsonParser} from "@app/shared/pipes/json/json-parser";

@Module({
    providers: [SharedService,DecodingURIPipe,ParseJsonPipe,InvalidJsonParser,
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        }
    ],
    exports: [SharedService,DecodingURIPipe,ParseJsonPipe,InvalidJsonParser],
    imports: [
        ConfigModule.forRoot({isGlobal: true, envFilePath: ".env/local.env",expandVariables:true}),
        TypeOrmModule.forRootAsync(typeOrmAsyncConfig)
    ]
})
export class SharedModule {
}
