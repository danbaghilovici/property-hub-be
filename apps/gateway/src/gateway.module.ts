import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import {SharedModule} from "@app/shared";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Property} from "../../../libs/shared/src/entities/property.entity";
import {NotFoundInterceptor} from "@app/shared/not-found/not-found.interceptor";

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([Property])
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
