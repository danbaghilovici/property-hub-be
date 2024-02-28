import {Injectable} from "@nestjs/common";
import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool,
    ISignUpResult
} from "amazon-cognito-identity-js";
import {ConfigService} from "@nestjs/config";
import {AuthRequestRegisterUserDto} from "./models/auth.request.register.user.dto";
import {AuthLoginUserDto} from "./models/auth.login.user.dto";
import {AuthResponseTokenDto} from "./models/auth.response.token.dto";
import {UserTypeDto} from "./models/user.type.dto";

@Injectable()
export class CognitoService {
    private userPool: CognitoUserPool;

    constructor(private config:ConfigService) {
        this.userPool = new CognitoUserPool({
            UserPoolId: config.getOrThrow("AWS_AUTH_USER_POOL"),
            ClientId: config.getOrThrow("AWS_AUTH_CLIENT_ID"),
        });
    }

    public registerUser(authRegisterUserDto:AuthRequestRegisterUserDto, userType:UserTypeDto):Promise<ISignUpResult>{
        return new Promise<ISignUpResult>((resolve, reject) => {
            this.userPool.signUp(
                authRegisterUserDto.email,
                authRegisterUserDto.password,
                [new CognitoUserAttribute({Name: 'custom:userType', Value:userType.id+"",})],
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

    public loginUser(authLoginUserDto: AuthLoginUserDto): Promise<AuthResponseTokenDto> {
        const { email, password } = authLoginUserDto;
        const userData = {Username: email, Pool: this.userPool};

        const authenticationDetails = new AuthenticationDetails({Username: email, Password: password});

        const userCognito = new CognitoUser(userData);

        return new Promise((resolve, reject) => {
            userCognito.authenticateUser(authenticationDetails, {
                onSuccess: (result) => {
                    resolve(new AuthResponseTokenDto(
                        result.getAccessToken().getJwtToken(),
                        result.getRefreshToken().getToken())
                    );
                },
                onFailure: (err) => {
                    reject(err);
                },
            });
        });
    }
}
