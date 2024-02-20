import {IsString} from "class-validator";

export class AuthResponseTokenDto {

    @IsString()
    accessToken:string;

    @IsString()
    refreshToken:string;


    constructor(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
