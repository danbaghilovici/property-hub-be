import {DataSource} from "typeorm";
import {config} from "dotenv";
import {ConfigModule, ConfigService} from "@nestjs/config";

import {Logger} from "@nestjs/common";
import {Property} from "./libs/shared/src/entities/property.entity";
import {TypeOrmModuleAsyncOptions, TypeOrmModuleOptions} from "@nestjs/typeorm";
import {AuroraPostgresConnectionOptions} from "typeorm/driver/aurora-postgres/AuroraPostgresConnectionOptions";
import {CreatePropertyTable1704403586556} from "./migrations/1704403586556-CreatePropertyTable";
import {InstallExtensions1704402536478} from "./migrations/1704402536478-InstallExtensions";
import {PopulatePropertyTable1704404746907} from "./migrations/1704404746907-PopulatePropertyTable";
import {CreateAgentsTable1704462454263} from "./migrations/1704462454263-CreateAgentsTable";
import {PopulateAgentsTable1704462542077} from "./migrations/1704462542077-PopulateAgentsTable";
import {Agent} from "./libs/shared/src/entities/agent.entity";
import {CreateAgentsPropertiesTable1704540455563} from "./migrations/1704540455563-CreateAgentsPropertiesTable";
import {AgentProperty} from "./libs/shared/src/entities/agent_property.entity";
import {PopulateAgentPropertyTable1704543258507} from "./migrations/1704543258507-PopulateAgentPropertyTable";

const logger: Logger = new Logger("typeorm.config.ts")
config({path: ".env/local.env"})

const configService = new ConfigService();

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        return {...getData(configService),autoLoadEntities:false};
    }
}

export const typeOrmConfig: DataSource = new DataSource({...getData(configService)});

function getData(configService:ConfigService):AuroraPostgresConnectionOptions {
    return {
        type: "aurora-postgres",
        region: configService.getOrThrow("AWS_REGION"),
        resourceArn: configService.getOrThrow("AWS_AURORA_RESOURCE_ARN"),
        secretArn: configService.getOrThrow("AWS_AURORA_SECRET_MANAGER_ARN"),
        database: configService.getOrThrow("AWS_AURORA_DATABASE_NAME"),
        entities: [Property,Agent,AgentProperty],
        logging: true,
        synchronize: false,
        migrationsRun:false,
        migrationsTransactionMode:"each",
        migrations:[
            // InstallExtensions1704402536478,
            CreatePropertyTable1704403586556,
            PopulatePropertyTable1704404746907,
            CreateAgentsTable1704462454263,
            PopulateAgentsTable1704462542077,
            CreateAgentsPropertiesTable1704540455563,
            PopulateAgentPropertyTable1704543258507
        ]
    }

}
