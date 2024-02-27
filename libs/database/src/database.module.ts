import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {typeOrmAsyncConfig} from "../../../typeorm.config";
import {SharedModule} from "@app/shared";
import {Property} from "@app/database/entities/property.entity";
import {Agent} from "@app/database/entities/agent.entity";
import {Type} from "@app/database/entities/type.entity";
import {Status} from "@app/database/entities/status.entity";
import {Feature} from "@app/database/entities/feature.entity";
// import {SharedModule} from "@app/shared";

@Module({
  imports:[
      SharedModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig)
  ],
  providers: [
      DatabaseService,
    // Property,
    // Agent,
    // Type,
    // Status,
    // Feature
  ],
  exports: [
      TypeOrmModule
    //   Property,
    // Agent,
    // Type,
    // Status,
    // Feature
  ],
})
export class DatabaseModule {}
