import {MigrationInterface, QueryRunner, Table} from "typeorm"
import {Logger} from "@nestjs/common";
import {Property} from "../libs/shared/src/entities/property.entity";
import {catchError, defer, firstValueFrom, switchMap, tap} from "rxjs";
import {meta} from "@typescript-eslint/parser";

export class CreatePropertyTable1704403586556 implements MigrationInterface {
    private readonly logger: Logger = new Logger(CreatePropertyTable1704403586556.name);

    public async up(queryRunner: QueryRunner): Promise<void> {
        this.logger.log("Executing migration UP");

        let metadata = queryRunner.connection.getMetadata(Property);
        console.log("metadata "+metadata);
        return queryRunner.createTable(
            Table.create(
                metadata,
                queryRunner.connection.driver)
            ,true)
            .then(result=>{
                this.logger.log(result);
        }).catch(error=>this.logger.error(error));
        // throw new Error("");
        // const statement:string="CREATE TABLE IF NOT EXISTS public.property " +
        //     "(id SERIAL NOT NULL, " +
        //     "title character varying NOT NULL, " +
        //     "description character varying NOT NULL, " +
        //     "property_type property_property_type_enum, property_status property_property_status_enum, city character varying, " +
        //     "zip_code character varying, " +
        //     "neighborhood text, " +
        //     "street text, " +
        //     "location text NOT NULL, " +
        //     "formatted_address character varying, " +
        //     "features text, " +
        //     "featured boolean, " +
        //     "price_dollar text, " +
        //     "price_euro text, " +
        //     "bedrooms integer, " +
        //     "bathrooms integer, " +
        //     "garages integer, " +
        //     "area text, " +
        //     "year_built integer, " +
        //     "ratings_count integer, " +
        //     "ratings_value integer, " +
        //     "additional_features text, " +
        //     "gallery text, " +
        //     "plans text, " +
        //     "videos text, " +
        //     "published character varying, " +
        //     "lastUpdate character varying, " +
        //     "views integer, " +
        //     "CONSTRAINT PK_d80743e6191258a5003d5843b4f PRIMARY KEY (id))";
        // this.logger.debug(statement);
        // await firstValueFrom(
        //     defer(()=>queryRunner.query(statement))
        //         .pipe(
        //             tap((result)=>this.logger.debug(JSON.stringify(result))),
        //             switchMap((value)=>{
        //                 return defer(()=> {
        //                     this.logger.log("running query");
        //                     return queryRunner.query("SELECT * FROM property")
        //                 })
        //             }),
        //             tap((result)=>this.logger.debug(JSON.stringify(result))),
        //             catchError((err, caught)=>{
        //                 this.logger.error(err);
        //                 return caught;
        //             })));
        // this.logger.log("DONE");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
