import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import {CognitoService} from "./cognito.service";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./jwt.strategy";

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [AuthenticationService,CognitoService,JwtStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
