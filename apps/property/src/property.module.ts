import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import {SharedModule} from "../../../libs/shared/src/shared.module";
import {Property} from "../../../libs/database/src/entities/property.entity";
import {Type} from "../../../libs/database/src/entities/type.entity";
import {Status} from "../../../libs/database/src/entities/status.entity";

import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthenticationModule} from "../../../libs/authentication/src";
import {Feature} from "../../../libs/database/src/entities/feature.entity";
import {Agent} from "../../../libs/database/src/entities/agent.entity";
import {DatabaseModule} from "@app/database";

@Module({
  imports: [
      SharedModule,
      AuthenticationModule,
      DatabaseModule,
      TypeOrmModule.forFeature([
          Property,Type,Status,Feature,Agent
      ])
  ],
  controllers: [PropertyController],
  providers: [PropertyService]
})
export class PropertyModule {}
