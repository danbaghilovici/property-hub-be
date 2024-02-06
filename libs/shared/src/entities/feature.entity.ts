import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Property} from "../entities/property.entity";
import {plainToClass} from "class-transformer";


// todo find if there is a better way

@Entity()
export class Feature {
    public static readonly ID_FIELD_NAME = "id";
    public static readonly TITLE_FIELD_NAME = "title";

    @PrimaryGeneratedColumn({name:Feature.ID_FIELD_NAME,type:"integer"})
    id:number;

    @Column({name:Feature.TITLE_FIELD_NAME})
    title:string;

    @ManyToMany(
        () => Property,
        property => property.features
    )
    properties:Property[]

    static fromJson(json: Record<any, any>): Feature {
        return plainToClass<Feature, object>(Feature, {...json,id:null});
    }
}
