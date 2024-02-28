import {IsEmail, IsInt, IsString, Matches} from "class-validator";

export class AuthRequestRegisterUserDto {

    @IsInt()
    userTypeId:number;

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    /* Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character */
    // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    @Matches(/.*/ ,{ message: 'invalid password' })
    password: string;
}
