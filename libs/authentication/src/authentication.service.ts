import {Injectable, Logger} from '@nestjs/common';

import {defer, Observable, of, single, switchMap} from "rxjs";
import {CognitoService} from "./cognito.service";
import {AuthRequestRegisterUserDto} from "./models/auth.request.register.user.dto";
import {AuthLoginUserDto} from "./models/auth.login.user.dto";
import {AuthResponseTokenDto} from "./models/auth.response.token.dto";
import {UserTypeDto} from "./models/user.type.dto";
import {AuthResponseRegisterUserDto} from "./models/auth.response.register.user.dto";


@Injectable()
export class AuthenticationService {

    private readonly logger = new Logger(AuthenticationService.name);

    private readonly userTypes:UserTypeDto[] = [
        new UserTypeDto(1,"AGENT"),
        new UserTypeDto(2,"AGENCY"),
        new UserTypeDto(3,"BUYER"),

    ]

    constructor(private readonly cognitoService:CognitoService){}

    public getUserTypes(): UserTypeDto[] { return this.userTypes;}
    public getUserTypesById(byId?:number): UserTypeDto {
        return this.userTypes.filter(type =>type.id===byId).pop();
    }

    public register(authData:AuthRequestRegisterUserDto):Observable<AuthResponseRegisterUserDto>{
        const userType:UserTypeDto=this.getUserTypesById(authData.userTypeId);
        if (!userType){throw new Error("invalid user type")}
        return defer(() => this.cognitoService.registerUser(authData,userType))
            .pipe(switchMap((signUp)=> {
                this.logger.debug(signUp);
                return of(new AuthResponseRegisterUserDto(
                    signUp.userSub,
                    signUp.user.getUsername(),
                    signUp.userConfirmed)
                );
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
