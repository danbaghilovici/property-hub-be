import {Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryColumn} from "typeorm";
import {Agent} from "../entities/agent.entity";
import {Property} from "../entities/property.entity";
import {Exclude, plainToClass} from "class-transformer";


@Entity()
export class AgentProperty{

    @PrimaryColumn({name:"agent_id"})
    @ManyToMany((type)=>Agent)
    @JoinColumn({foreignKeyConstraintName:"fk_agent_id"})
    agentId:number;

    @PrimaryColumn({name:"property_id"})
    @ManyToMany((type)=>Property)
    // @ManyToMany(()=>Property)
    @JoinColumn({foreignKeyConstraintName:"fk_property_id"})
    propertyId:number;

    @Exclude()
    public static fromJson(json:Record<any, any>):AgentProperty{
        return plainToClass<AgentProperty, object>(AgentProperty, json);
    }

}
