import {Injectable} from "@nestjs/common";
import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool,
    ISignUpResult
} from "amazon-cognito-identity-js";
import {ConfigService} from "@nestjs/config";
import {AuthRegisterUserDto} from "./models/auth.register.user.dto";
import {AuthLoginUserDto} from "./models/auth.login.user.dto";
import {AuthResponseTokenDto} from "./models/auth.response.token.dto";

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
