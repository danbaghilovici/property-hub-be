import {Injectable, Logger} from '@nestjs/common';

import {defer, Observable, of, single, switchMap} from "rxjs";
import {CognitoService} from "./cognito.service";
import {AuthRegisterUserDto} from "./models/auth.register.user.dto";
import {AuthLoginUserDto} from "./models/auth.login.user.dto";
import {AuthResponseTokenDto} from "./models/auth.response.token.dto";


@Injectable()
export class AuthenticationService {

    private readonly logger = new Logger(AuthenticationService.name);


    constructor(private readonly cognitoService:CognitoService){}

    public register(authData:AuthRegisterUserDto):Observable<any>{
        return defer(() => this.cognitoService.registerUser(authData))
            .pipe(switchMap((signUp)=> {
                this.logger.debug(signUp);
                return of(signUp.user);
            }));
    }

    public logIn(authData:AuthLoginUserDto):Observable<AuthResponseTokenDto>{
        return defer(()=>this.cognitoService.loginUser(authData))
            .pipe(switchMap((tokenResponse)=>{
                this.logger.debug(tokenResponse);
                return of(tokenResponse);
            }))
    }

}
