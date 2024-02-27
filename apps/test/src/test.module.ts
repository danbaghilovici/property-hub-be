import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import {SharedModule} from "@app/shared";
import {AuthenticationModule} from "../../../libs/authentication/src";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Property} from "@app/shared/entities/property.entity";
import {Type} from "@app/shared/entities/type.entity";
import {Status} from "@app/shared/entities/status.entity";

@Module({
  imports: [SharedModule,
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
