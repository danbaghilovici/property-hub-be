import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import {SharedModule} from "@app/shared";
import {AuthenticationModule} from "../../../libs/authentication/src";
import {DatabaseModule} from "@app/database";
import {AuthModule} from "../../auth/src/auth.module";
import {AgentModule} from "../../agent/src/agent.module";
import {PropertyModule} from "../../property/src/property.module";

@Module({
  imports: [
    SharedModule,
    AuthenticationModule,
    DatabaseModule,
    AuthModule,
    AgentModule,
    PropertyModule
  ],
  exports: [],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
