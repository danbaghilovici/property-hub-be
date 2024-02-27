import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import {SharedModule} from "@app/shared";
import {AuthenticationModule} from "../../../libs/authentication/src";
import {DatabaseModule} from "@app/database";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Property} from "@app/database/entities/property.entity";

@Module({
  imports: [
    SharedModule,AuthenticationModule, DatabaseModule,
      TypeOrmModule.forFeature([Property])
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
