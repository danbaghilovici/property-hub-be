import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import {AuthenticationGuard} from "../guards/authentication/authentication.guard";

@Module({
  providers: [AuthenticationService,AuthenticationGuard],
  exports: [AuthenticationService, AuthenticationGuard],
})
export class AuthenticationModule {}
