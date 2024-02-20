import { Injectable } from '@nestjs/common';

import {defer, Observable, of, switchMap} from "rxjs";
import {CognitoService} from "./cognito.service";
import {AuthRegisterUserDto} from "./models/auth.register.user.dto";


@Injectable()
export class AuthenticationService {

    constructor(private readonly cognitoService:CognitoService){}

    public register(authData:AuthRegisterUserDto):Observable<any>{
        return defer(() => this.cognitoService.registerUser(authData))
            .pipe(switchMap((signUp)=>of(signUp.user)));


    }

}
