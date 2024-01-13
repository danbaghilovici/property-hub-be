import {MigrationInterface, QueryRunner, Table} from "typeorm";
import {Agent} from "../libs/shared/src/entities/agent.entity";
import {Logger} from "@nestjs/common";

export class CreateAgentsTable1704462454263 implements MigrationInterface {
    private readonly logger: Logger = new Logger(CreateAgentsTable1704462454263.name);

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            Table.create(
                queryRunner.connection.getMetadata(Agent),
                queryRunner.connection.driver)
            ,true).then(value => {
            this.logger.log(value)
            // throw new Error("");
        });

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
