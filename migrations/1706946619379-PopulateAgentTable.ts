import { MigrationInterface, QueryRunner } from "typeorm";
import {Feature} from "../libs/database/src/entities/feature.entity";
import {fsReadFile} from "ts-loader/dist/utils";
import {Logger} from "@nestjs/common";
import {Agent} from "../libs/database/src/entities/agent.entity";

export class PopulateAgentTable1706946619379 implements MigrationInterface {

    private readonly logger: Logger = new Logger(PopulateAgentTable1706946619379.name);

    public async up(queryRunner: QueryRunner): Promise<void> {

        const mockProperties:Agent[] =
            (JSON.parse(fsReadFile("migrations/mock_agents.json")) as Record<any, any>[])
                .map(value => Agent.fromJson(value));

        return queryRunner
            .connection
            .createQueryBuilder()
            .insert()
            .into(Agent)
            .values(mockProperties)
            .orIgnore(true)
            .execute()
            .then();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
