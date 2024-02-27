import { MigrationInterface, QueryRunner } from "typeorm";
import {fsReadFile} from "ts-loader/dist/utils";
import {Feature} from "../libs/database/src/entities/feature.entity";
import {Logger} from "@nestjs/common";

export class PopulateFeatureTable1706946481708 implements MigrationInterface {

    private readonly logger: Logger = new Logger(PopulateFeatureTable1706946481708.name);

    public async up(queryRunner: QueryRunner): Promise<void> {

        const mockProperties:Feature[] =
            (JSON.parse(fsReadFile("migrations/mock_features.json")) as Record<any, any>[])
                .map(value => Feature.fromJson(value));

        return queryRunner
            .connection
            .createQueryBuilder()
            .insert()
            .into(Feature)
            .values(mockProperties)
            .orIgnore(true)
            .execute()
            .then();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
