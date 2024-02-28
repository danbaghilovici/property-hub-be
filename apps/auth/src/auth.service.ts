import {Injectable, Logger} from '@nestjs/common';
import {AuthenticationService} from "../../../libs/authentication/src";
import {AuthRequestRegisterUserDto} from "../../../libs/authentication/src/models/auth.request.register.user.dto";
import {Observable} from "rxjs";
import {AuthLoginUserDto} from "../../../libs/authentication/src/models/auth.login.user.dto";
import {AuthResponseTokenDto} from "../../../libs/authentication/src/models/auth.response.token.dto";
import {UserTypeDto} from "../../../libs/authentication/src/models/user.type.dto";
import {AuthResponseRegisterUserDto} from "../../../libs/authentication/src/models/auth.response.register.user.dto";

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly authenticationService:AuthenticationService) {
  }


  public createNewUser(authData:AuthRequestRegisterUserDto):Observable<AuthResponseRegisterUserDto>{
    return this.authenticationService.register(authData);
  }

  public authenticateUser(authData:AuthLoginUserDto) : Observable<AuthResponseTokenDto>{
    return this.authenticationService.logIn(authData);
  }

  public getUserTypes() :UserTypeDto[]{
    return this.authenticationService.getUserTypes();
  }
}
