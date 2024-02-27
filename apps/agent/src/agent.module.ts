import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import {SharedModule} from "@app/shared";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Agent} from "../../../libs/database/src/entities/agent.entity";
import {DatabaseModule} from "@app/database";

@Module({
  imports: [
      SharedModule,
      DatabaseModule,
    TypeOrmModule.forFeature([Agent])
  ],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
