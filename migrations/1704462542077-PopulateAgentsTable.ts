import { MigrationInterface, QueryRunner } from "typeorm";
import {Logger} from "@nestjs/common";
import {Property} from "@entities/property";
import {fsReadFile} from "ts-loader/dist/utils";
import {Agent} from "../libs/shared/src/entities/agent.entity";


export class PopulateAgentsTable1704462542077 implements MigrationInterface {

    private readonly logger: Logger = new Logger(PopulateAgentsTable1704462542077.name);


    public async up(queryRunner: QueryRunner): Promise<void> {

        this.logger.log("Executing migration UP");

        const mockProperties:Agent[] =
            (JSON.parse(fsReadFile("migrations/mock_agents.json")) as Record<any, any>[])
                // .filter((val,index)=>index===0)
                .map(value => Agent.fromJson(value));

        return queryRunner.connection.createQueryBuilder()
            .insert()
            .into(Agent)
            .values(mockProperties)
            .orIgnore(true)
            .execute().then();
        // throw new Error("");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
