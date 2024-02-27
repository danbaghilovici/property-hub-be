import {Injectable, Logger} from '@nestjs/common';
import {AuthenticationService} from "../../../libs/authentication/src";
import {AuthRegisterUserDto} from "../../../libs/authentication/src/models/auth.register.user.dto";
import {Observable} from "rxjs";
import {AuthLoginUserDto} from "../../../libs/authentication/src/models/auth.login.user.dto";
import {AuthResponseTokenDto} from "../../../libs/authentication/src/models/auth.response.token.dto";

@Injectable()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly authenticationService:AuthenticationService) {
  }


  public createNewUser(authData:AuthRegisterUserDto):Observable<any>{
    return this.authenticationService.register(authData);
  }

  public authenticateUser(authData:AuthLoginUserDto) : Observable<AuthResponseTokenDto>{
    return this.authenticationService.logIn(authData);
  }
}
