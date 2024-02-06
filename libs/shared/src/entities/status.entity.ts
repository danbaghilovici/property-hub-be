import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Property} from "../entities/property.entity";


@Entity()
export class Status{

    public static readonly ID_FIELD_NAME = "id";
    public static readonly TITLE_FIELD_NAME = "title";
    // public static readonly PROPERTIES_FIELD_NAME = "properties";

    @PrimaryGeneratedColumn({name:Status.ID_FIELD_NAME,type:"integer"})
    id:number;

    @Column({name:Status.TITLE_FIELD_NAME})
    title:string;

    @ManyToMany(
        () => Property,
        property => property.propertyStatuses
    )
    properties:Property[]



}
