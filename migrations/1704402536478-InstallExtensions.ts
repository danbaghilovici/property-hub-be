import {MigrationInterface, QueryRunner} from "typeorm"
import {Logger} from "@nestjs/common";
import {catchError, concat, defer, EMPTY, firstValueFrom, switchMap, tap} from "rxjs";

export class InstallExtensions1704402536478 implements MigrationInterface {

    private readonly logger: Logger = new Logger(InstallExtensions1704402536478.name);


    public async up(queryRunner: QueryRunner): Promise<void> {
        this.logger.log("Executing migration UP");
        const statements:string[]=[
            "CREATE EXTENSION IF NOT EXISTS postgis;",
            "CREATE EXTENSION IF NOT EXISTS postgis_topology;",
            "CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;",
            "CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;",
            "CREATE EXTENSION IF NOT EXISTS address_standardizer;"
        ]

        await firstValueFrom(
            concat(statements.map(value => defer(()=>queryRunner.query(value))))
            .pipe(tap((result) => this.logger.debug(JSON.stringify(result))))
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
