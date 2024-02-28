import {IsBoolean, IsString} from "class-validator";

export class AuthResponseRegisterUserDto {


    constructor(id: string, email: string, confirmed: boolean) {
        this.id = id;
        this.email = email;
        this.confirmed = confirmed;
    }

    @IsString()
    id:string;

    @IsString()
    email:string;

    @IsBoolean()
    confirmed:boolean;


}
