import { MigrationInterface, QueryRunner } from "typeorm"
import {Logger} from "@nestjs/common";

import {Property} from "../libs/shared/src/entities/property.entity";
import {fsReadFile} from "ts-loader/dist/utils";

export class PopulatePropertyTable1704404746907 implements MigrationInterface {

    private readonly logger: Logger = new Logger(PopulatePropertyTable1704404746907.name);


    public async up(queryRunner: QueryRunner): Promise<void> {
        this.logger.log("Executing migration UP");
        // const appContext:INestApplicationContext=await NestFactory.createApplicationContext(PropertyModule);
        // const propertyService:PropertyService=appContext.get(PropertyService)
        // await appContext.init();

        const mockProperties:Property[] =
            (JSON.parse(fsReadFile("migrations/mock_properties.json")) as Record<any, any>[])
                // .filter((val,index)=>index===0)
                .map(value => Property.fromJson(value));

        console.log(mockProperties)
        console.log(__dirname);
        return queryRunner.connection.createQueryBuilder()
            .insert()
            .into(Property)
            .values(mockProperties)
            .orIgnore(true)
            .execute().then();
        // throw new Error("");

    }


    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
