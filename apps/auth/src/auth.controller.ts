import {Body, Controller, Get, Logger, Post, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthRegisterUserDto} from "../../../libs/authentication/src/models/auth.register.user.dto";
import {AuthLoginUserDto} from "../../../libs/authentication/src/models/auth.login.user.dto";
import {AuthGuard} from "@nestjs/passport";
import {ConfigService} from "@nestjs/config";

@Controller("auth")
export class AuthController {

  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService, private readonly config:ConfigService) {
    this.logger.debug(this.config.getOrThrow("AWS_AUTH_AUTHORITY"));
  }

  @Post("register")
  createNewUser(@Body() authData:AuthRegisterUserDto){
    return this.authService.createNewUser(authData);
  }

  @Post("login")
  authenticateUser(@Body() authData:AuthLoginUserDto){
    return this.authService.authenticateUser(authData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("test")
  test(){
    this.logger.log("ici");
    return null;
  }
}
