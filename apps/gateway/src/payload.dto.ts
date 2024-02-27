import {IsString} from "class-validator";

export class PayloadDto {

    @IsString()
    name:string;
}
