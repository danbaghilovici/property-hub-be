import {DataSource} from "typeorm";
import {config} from "dotenv";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {Logger} from "@nestjs/common";
import {Property} from "./libs/shared/src/entities/property.entity";
import {TypeOrmModuleAsyncOptions, TypeOrmModuleOptions} from "@nestjs/typeorm";
import {CreatePropertyTable1704403586556} from "./migrations/1704403586556-CreatePropertyTable";
import {InstallExtensions1704402536478} from "./migrations/1704402536478-InstallExtensions";
import {PopulatePropertyTable1704404746907} from "./migrations/1704404746907-PopulatePropertyTable";
import {CreateAgentsTable1704462454263} from "./migrations/1704462454263-CreateAgentsTable";
import {PopulateAgentsTable1704462542077} from "./migrations/1704462542077-PopulateAgentsTable";
import {Agent} from "./libs/shared/src/entities/agent.entity";
import {CreateAgentsPropertiesTable1704540455563} from "./migrations/1704540455563-CreateAgentsPropertiesTable";
import {AgentProperty} from "./libs/shared/src/entities/agent_property.entity";
import {PopulateAgentPropertyTable1704543258507} from "./migrations/1704543258507-PopulateAgentPropertyTable";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
const logger: Logger = new Logger("typeorm.config.ts")
config({path: ".env/local.env"})

const configService = new ConfigService();

logger.log(getData(configService));

function getData(configService:ConfigService):PostgresConnectionOptions {
    return {
        type: "postgres",
        database: configService.getOrThrow("AWS_DATABASE_NAME"),
        host:configService.getOrThrow("AWS_DATABASE_HOST"),
        port:configService.getOrThrow("AWS_DATABASE_PORT"),
        username:configService.getOrThrow("AWS_DATABASE_USERNAME"),
        password:configService.getOrThrow("AWS_DATABASE_PASSWORD"),
        connectTimeoutMS:configService.get("AWS_DATABASE_TIMEOUT_MS",10000),
        entities: [Property,Agent,AgentProperty],
        logging: true,
        synchronize: false,
        migrationsRun:false,
        migrationsTransactionMode:"each",
        // TODO figure out this
        ssl:{
            rejectUnauthorized:false
        },
        migrations:[
            InstallExtensions1704402536478,
            CreatePropertyTable1704403586556,
            PopulatePropertyTable1704404746907,
            CreateAgentsTable1704462454263,
            PopulateAgentsTable1704462542077,
            CreateAgentsPropertiesTable1704540455563,
            PopulateAgentPropertyTable1704543258507
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


