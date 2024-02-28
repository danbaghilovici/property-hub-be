import {
  Body,
  Controller, Get,
  Logger,
  Post
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthRequestRegisterUserDto} from "../../../libs/authentication/src/models/auth.request.register.user.dto";
import {ConfigService} from "@nestjs/config";
import {Observable} from "rxjs";
import {AuthResponseTokenDto} from "../../../libs/authentication/src/models/auth.response.token.dto";
import {TestDto} from "./test.dto";
import {UserTypeDto} from "../../../libs/authentication/src/models/user.type.dto";
import {AuthResponseRegisterUserDto} from "../../../libs/authentication/src/models/auth.response.register.user.dto";

@Controller("auth")
export class AuthController {

  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {
  }

  @Post("register")
  createNewUser(@Body() authData:AuthRequestRegisterUserDto):Observable<AuthResponseRegisterUserDto>{
    return this.authService.createNewUser(authData);
  }

  @Post("test")
  authenticateUser(@Body() authData:TestDto) : Observable<AuthResponseTokenDto>{
    this.logger.debug(JSON.stringify(authData));
    return null;
    // if (!authData){
    //   this.logger.error("failed");
    //   throw new BadRequestException();
    // }
    // return this.authService.authenticateUser(authData);
  }

  @Get("types")
  userTypes(): UserTypeDto[] {
    return this.authService.getUserTypes();
  }

}
