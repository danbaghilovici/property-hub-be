import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import {SharedModule} from "../../../libs/shared/src/shared.module";
import {Property} from "../../../libs/shared/src/entities/property.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AgentProperty} from "../../../libs/shared/src/entities/agent_property.entity";

@Module({
  imports: [
      SharedModule,
    TypeOrmModule.forFeature([Property,AgentProperty])
  ],
  controllers: [PropertyController],
  providers: [PropertyService]
})
export class PropertyModule {}
