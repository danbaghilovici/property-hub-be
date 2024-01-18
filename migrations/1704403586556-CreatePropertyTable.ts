import {MigrationInterface, QueryRunner, Table} from "typeorm"
import {Logger} from "@nestjs/common";
import {Property} from "../libs/shared/src/entities/property.entity";

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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
