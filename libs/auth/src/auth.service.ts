import { Injectable } from '@nestjs/common';
import {CognitoService} from "@app/auth/cognito.service";
import {defer, Observable, of, switchMap} from "rxjs";
import {AuthRegisterUserDto} from "@app/auth/models/auth.register.user.dto";

@Injectable()
export class AuthService {

    constructor(private readonly cognitoService:CognitoService){}

    public register(authData:AuthRegisterUserDto):Observable<any>{
        return defer(() => this.cognitoService.registerUser(authData))
            .pipe(switchMap((signUp)=>of(signUp.user)));


    }

}
