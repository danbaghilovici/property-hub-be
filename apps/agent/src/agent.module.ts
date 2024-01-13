import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import {SharedModule} from "@app/shared";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Agent} from "../../../libs/shared/src/entities/agent.entity";

@Module({
  imports: [
      SharedModule,
    TypeOrmModule.forFeature([Agent])
  ],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
