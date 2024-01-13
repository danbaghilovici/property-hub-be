import { MigrationInterface, QueryRunner } from "typeorm";
import {fsReadFile} from "ts-loader/dist/utils";
import {Logger} from "@nestjs/common";
import {AgentProperty} from "../libs/shared/src/entities/agent_property.entity";

export class PopulateAgentPropertyTable1704543258507 implements MigrationInterface {

    private readonly logger: Logger = new Logger(PopulateAgentPropertyTable1704543258507.name);

    public async up(queryRunner: QueryRunner): Promise<void> {

        this.logger.log("Executing migration UP");

        const mockProperties:AgentProperty[] =
            (JSON.parse(fsReadFile("migrations/mock_agents_properties.json")) as Record<any, any>[])
                // .filter((val,index)=>index===0)
                .map(value => AgentProperty.fromJson(value));

        return queryRunner.connection.createQueryBuilder()
            .insert()
            .into(AgentProperty)
            .values(mockProperties)
            .orIgnore(true)
            .execute().then();
        // throw new Error("");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
