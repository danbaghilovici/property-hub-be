import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {AuthenticationModule} from "../../../libs/authentication/src";
import {SharedModule} from "@app/shared";
import {DatabaseModule} from "@app/database";

@Module({
  imports: [SharedModule, AuthenticationModule, DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
