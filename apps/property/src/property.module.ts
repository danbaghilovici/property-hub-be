import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import {SharedModule} from "../../../libs/shared/src/shared.module";
import {Property} from "../../../libs/shared/src/entities/property.entity";
import {Type} from "../../../libs/shared/src/entities/type.entity";
import {Status} from "../../../libs/shared/src/entities/status.entity";

import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
      SharedModule,
    TypeOrmModule.forFeature([Property,Type,Status])
  ],
  controllers: [PropertyController],
  providers: [PropertyService]
})
export class PropertyModule {}
