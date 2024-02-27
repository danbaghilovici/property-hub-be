import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Exclude, plainToClass} from "class-transformer";
import {Property} from "./property.entity";

@Entity()
export class Agent {

    public static readonly ID_FIELD_NAME = "id";
    public static readonly FULL_NAME_FIELD_NAME = "full_name";
    public static readonly DESCRIPTION_FIELD_NAME = "description";
    public static readonly ORGANIZATION_FIELD_NAME = "organization";
    public static readonly EMAIL_FIELD_NAME = "email";
    public static readonly PHONE_FIELD_NAME = "phone";
    public static readonly SOCIAL_FIELD_NAME = "social";
    public static readonly RATING_COUNT_FIELD_NAME = "rating_count";
    public static readonly RATING_VALUE_FIELD_NAME = "rating_value";
    public static readonly IMAGE_FIELD_NAME = "image";


    @PrimaryGeneratedColumn(
        "increment",
        {name: Agent.ID_FIELD_NAME}
    )
    id: number;

    @OneToMany(() => Property, (property)=>property.agent)
    properties: Property[]

    @Column({name: Agent.FULL_NAME_FIELD_NAME})
    fullName: string;

    @Column({name: Agent.DESCRIPTION_FIELD_NAME})
    desc: string;

    @Column({name: Agent.ORGANIZATION_FIELD_NAME})
    organization: string;

    @Column({name: Agent.EMAIL_FIELD_NAME})
    email: string;

    @Column({name: Agent.PHONE_FIELD_NAME})
    phone: string;

    @Column({name: Agent.RATING_COUNT_FIELD_NAME, nullable: true})
    ratingsCount: number;

    @Column({name: Agent.RATING_VALUE_FIELD_NAME, nullable: true})
    ratingsValue: number;

    @Column({name: Agent.IMAGE_FIELD_NAME})
    image: string;


    @Column({
        name: Agent.SOCIAL_FIELD_NAME,
        type: "simple-json"
    })
    social: Socials;



    @Exclude()
    public static fromJson(json: Record<any, any>): Agent {
        let agent = plainToClass<Agent, object>(Agent, json);
        console.log(agent);
        console.log(json);
        return agent;
    }

    @Exclude()
    public toString(): string {
        return JSON.stringify(this);
    }

}

export interface Socials {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    website: string;
}
