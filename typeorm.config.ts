import {DataSource} from "typeorm";
import {config} from "dotenv";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {Logger} from "@nestjs/common";
import {Property} from "./libs/shared/src/entities/property.entity";
import {TypeOrmModuleAsyncOptions, TypeOrmModuleOptions} from "@nestjs/typeorm";
import {InstallExtensions1704402536478} from "./migrations/1704402536478-InstallExtensions";
import {Agent} from "./libs/shared/src/entities/agent.entity";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import {Type} from "./libs/shared/src/entities/type.entity";
import {Status} from "./libs/shared/src/entities/status.entity";
import {Feature} from "./libs/shared/src/entities/feature.entity";
import {PopulateStatusTable1706945973803} from "./migrations/1706945973803-PopulateStatusTable";
import {PopulateTypeTable1706946330068} from "./migrations/1706946330068-PopulateTypeTable";
import {PopulateFeatureTable1706946481708} from "./migrations/1706946481708-PopulateFeatureTable";
import {PopulateAgentTable1706946619379} from "./migrations/1706946619379-PopulateAgentTable";
import {PopulatePropertyTable1706946822911} from "./migrations/1706946822911-PopulatePropertyTable";
const logger: Logger = new Logger("typeorm.config.ts")
config({path: ".env/local.env"})

const configService = new ConfigService();

// logger.log(getData(configService));

function getData(configService:ConfigService):PostgresConnectionOptions {
    return {
        type: "postgres",
        database: configService.getOrThrow("AWS_DATABASE_NAME"),
        host:configService.getOrThrow("AWS_DATABASE_HOST"),
        port:configService.getOrThrow("AWS_DATABASE_PORT"),
        username:configService.getOrThrow("AWS_DATABASE_USERNAME"),
        password:configService.getOrThrow("AWS_DATABASE_PASSWORD"),
        connectTimeoutMS:configService.get("AWS_DATABASE_TIMEOUT_MS",10000),
        entities: [
            Property,
            Agent,
            Type,
            Status,
            Feature
        ],
        logging: true,
        synchronize: false,
        migrationsRun:false,
        migrationsTransactionMode:"all",
        // TODO figure out this
        ssl:{
            rejectUnauthorized:false
        },
        migrations:[
            InstallExtensions1704402536478,
            PopulateStatusTable1706945973803,
            PopulateTypeTable1706946330068,
            PopulateFeatureTable1706946481708,
            PopulateAgentTable1706946619379,
            PopulatePropertyTable1706946822911

        ]
    }

}


export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        return {
            ...getData(configService),
            autoLoadEntities:false,
            retryAttempts:3
        };
    }
}

export const typeOrmConfig: DataSource = new DataSource({...getData(configService)});


