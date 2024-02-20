import {IsEmail, IsString, Matches} from "class-validator";

export class AuthLoginUserDto{
    @IsEmail()
    email: string;

    /* Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character */
    // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    // TODO check this
    @Matches(/.*/, { message: 'invalid password' })
    // @IsString()
    password: string;
}
