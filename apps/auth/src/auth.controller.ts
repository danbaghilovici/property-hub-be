import {
  Body,
  Controller,
  Logger,
  Post
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthRegisterUserDto} from "../../../libs/authentication/src/models/auth.register.user.dto";
import {ConfigService} from "@nestjs/config";
import {Observable} from "rxjs";
import {AuthResponseTokenDto} from "../../../libs/authentication/src/models/auth.response.token.dto";
import {TestDto} from "./test.dto";

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

  // @UseGuards(AuthGuard('jwt'))
  // @Get("test")
  // test(){
  //   this.logger.log("ici");
  //   return null;
  // }
}
