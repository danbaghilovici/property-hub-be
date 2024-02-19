import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {plainToClass} from "class-transformer";


@Entity()
export class Type {

    public static readonly ID_FIELD_NAME = "id";
    public static readonly TITLE_FIELD_NAME = "title";

    @PrimaryGeneratedColumn({name:Type.ID_FIELD_NAME,type:"integer"})
    id:number;

    @Column({name:Type.TITLE_FIELD_NAME})
    title:string;

    public static fromJson(json:Record<any,any>):Type {
        return plainToClass<Type, object>(Type, {...json,id:null});

    }

}
