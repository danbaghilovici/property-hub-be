import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {AuthenticationModule} from "../../../libs/authentication/src";
import {SharedModule} from "@app/shared";

@Module({
  imports: [SharedModule, AuthenticationModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
