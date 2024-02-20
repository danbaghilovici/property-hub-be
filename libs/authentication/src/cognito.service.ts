import {Injectable} from "@nestjs/common";
import {CognitoUser, CognitoUserAttribute, CognitoUserPool, ISignUpResult} from "amazon-cognito-identity-js";
import {ConfigService} from "@nestjs/config";
import {AuthRegisterUserDto} from "./models/auth.register.user.dto";

@Injectable()
export class CognitoService {
    private userPool: CognitoUserPool;

    constructor(private config:ConfigService) {
        this.userPool = new CognitoUserPool({
            UserPoolId: config.getOrThrow("AWS_AUTH_USER_POOL"),
            ClientId: config.getOrThrow("AWS_AUTH_CLIENT_ID"),
        });
    }

    public registerUser(authRegisterUserDto:AuthRegisterUserDto):Promise<ISignUpResult>{
        const { name, email, password } = authRegisterUserDto;
        return new Promise<ISignUpResult>((resolve, reject) => {
            this.userPool.signUp(
                email,
                password,
                [new CognitoUserAttribute({Name: 'name', Value: name,})],
                null,
                (err, result) => {
                    if (!result || err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                },
            );
        });
    }
}
