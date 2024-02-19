import { MigrationInterface, QueryRunner } from "typeorm";
import {Logger} from "@nestjs/common";
import {Status} from "../libs/shared/src/entities/status.entity";
import {fsReadFile} from "ts-loader/dist/utils";
import {plainToClass} from "class-transformer";

export class PopulateStatusTable1706945973803 implements MigrationInterface {

    private readonly logger: Logger = new Logger(PopulateStatusTable1706945973803.name);

    public async up(queryRunner: QueryRunner): Promise<void> {
        const mockProperties:Status[] =
            (JSON.parse(fsReadFile("migrations/mock_statuses.json")) as Record<any, any>[])
                .map(value => plainToClass<Status, object>(Status, value));

        return queryRunner
            .connection
            .createQueryBuilder()
            .insert()
            .into(Status)
            .values(mockProperties)
            .orIgnore(true)
            .execute()
            .then();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
