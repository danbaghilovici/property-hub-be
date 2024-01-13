import {MigrationInterface, QueryRunner, Table} from "typeorm";
import {Agent} from "@entities/agent";
import {AgentProperty} from "../libs/shared/src/entities/agent_property.entity";
import {Logger} from "@nestjs/common";

export class CreateAgentsPropertiesTable1704540455563 implements MigrationInterface {

    private readonly logger: Logger = new Logger(CreateAgentsPropertiesTable1704540455563.name);

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            Table.create(
                queryRunner.connection.getMetadata(AgentProperty),
                queryRunner.connection.driver)
            ,true).then(value => {
            this.logger.log(value)
            // throw new Error("");
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
