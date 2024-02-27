import { MigrationInterface, QueryRunner } from "typeorm";
import {Logger} from "@nestjs/common";
import {fsReadFile} from "ts-loader/dist/utils";
import {Type} from "../libs/database/src/entities/type.entity";

export class PopulateTypeTable1706946330068 implements MigrationInterface {

    private readonly logger: Logger = new Logger(PopulateTypeTable1706946330068.name);

    public async up(queryRunner: QueryRunner): Promise<void> {
        const mockProperties:Type[] =
            (JSON.parse(fsReadFile("migrations/mock_statuses.json")) as Record<any, any>[])
                .map(value => Type.fromJson(value));

        return queryRunner
            .connection
            .createQueryBuilder()
            .insert()
            .into(Type)
            .values(mockProperties)
            .orIgnore(true)
            .execute()
            .then();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
