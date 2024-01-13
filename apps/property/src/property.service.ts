import { Injectable, Logger, } from '@nestjs/common';
import {Between, DataSource, FindOptionsWhereProperty, In, Repository} from "typeorm";
import {Property} from "../../../libs/shared/src/entities/property.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {catchError, concat, concatMap, defer, Observable, of, skip, switchMap} from "rxjs";

import {AgentProperty} from "../../../libs/shared/src/entities/agent_property.entity";
import {PropertiesFiltersDto} from "./property-filters.dto";
import {FindOptionsWhere} from "typeorm/find-options/FindOptionsWhere";
import {FindManyOptions} from "typeorm/find-options/FindManyOptions";

@Injectable()
export class PropertyService {
    private readonly logger = new Logger(PropertyService.name);

    constructor(
        private dataSource: DataSource,
        @InjectRepository(Property) private readonly propertyRepository: Repository<Property>,
        @InjectRepository(AgentProperty) private readonly agentPropertyRepository: Repository<AgentProperty>,
    ) {
    }



    getAvailableProperties(propertiesFiltersDto:PropertiesFiltersDto=new PropertiesFiltersDto()): Observable<Property[]> {
        this.logger.log("Calling getAvailableProperties");
        return this.buildQuery(propertiesFiltersDto)
            .pipe(
                switchMap((whereQ)=> {
                    this.logger.debug("generated where query",whereQ);
                    const q:FindManyOptions={where:whereQ};
                    this.generateQueryForSkip(q,propertiesFiltersDto);
                    this.generateQueryForTake(q,propertiesFiltersDto);
                    this.logger.debug("query is ",q);
                    return defer(() => this.propertyRepository.find(q))
                }))
    }

    private getAvailablePropertiesByIds(ids:number[]=[]):Observable<Property[]>{
        return defer(()=>this.propertyRepository.findBy({id:In(ids)}))
    }

    getPropertiesFromAgentId(id:number):Observable<Property[]>{

        return defer(()=> {
            if (!id) throw new Error("Invalid agent id");
            return this.agentPropertyRepository.findBy({agentId: id})
        })
            .pipe(switchMap((result)=>of(result.map(value => value.propertyId))))
            .pipe(switchMap((result)=>this.getAvailablePropertiesByIds(result)));
    }

    private buildQuery(propertiesFiltersDto:PropertiesFiltersDto):Observable<FindOptionsWhere<Property>> {
        this.logger.debug("from agent",propertiesFiltersDto.fromAgent);
        return this.getPropertiesFromAgentId(+propertiesFiltersDto.fromAgent)
            .pipe(catchError((error)=>of([])))
            .pipe(
                switchMap((ids)=>{
                    this.logger.log("received "+ids);
                    ids=ids.map((p)=>p.id);
                    let where:FindOptionsWhere<Property>={};
                    const filters:Function[]=[
                        this.generateQueryForIds,
                        this.generateQueryForPropertyType,
                        this.generateQueryForPropertyStatus,
                        this.generateQueryForPrice,
                        this.generateQueryForCity,
                        this.generateQueryForZipCode,
                        this.generateQueryForNeighborhood,
                        this.generateQueryForStreet,
                        this.generateQueryForBedrooms,
                        this.generateQueryForBathrooms,
                        this.generateQueryForGarages,
                        this.generateQueryForArea,
                        this.generateQueryForYearBuilt,
                        this.generateQueryForFeatures,

                    ]
                    return of(filters
                        .map(func=>func.apply(this,[where,propertiesFiltersDto,ids]))
                        .reduce((accumulator, currentValue,{})=>{
                            // very inefficient but works for now
                            return {...accumulator,...currentValue}
                        }));
                })
            )
    }

    private generateQueryForBedrooms(where:FindOptionsWhere<Property>,propertiesFiltersDto:PropertiesFiltersDto):FindOptionsWhere<Property>{
        if(propertiesFiltersDto.bedrooms){
            where={...where,bedrooms:Between(propertiesFiltersDto.bedrooms.from,propertiesFiltersDto.bedrooms.to)}
        }
        return where;

    }

    private generateQueryForPrice(where:FindOptionsWhere<Property>,propertiesFiltersDto:PropertiesFiltersDto):FindOptionsWhere<Property>{
        // TODO
        return {};
    }
    private generateQueryForStreet(where:FindOptionsWhere<Property>,propertiesFiltersDto:PropertiesFiltersDto):FindOptionsWhere<Property>{
        // TODO
        return {};
    }


    private generateQueryForBathrooms(where:FindOptionsWhere<Property>,propertiesFiltersDto:PropertiesFiltersDto):FindOptionsWhere<Property>{
        if(propertiesFiltersDto.bathrooms){
            where={...where,bathrooms:Between(propertiesFiltersDto.bathrooms.from,propertiesFiltersDto.bathrooms.to)}
        }
        return where;
    }

    private generateQueryForGarages(where:FindOptionsWhere<Property>,propertiesFiltersDto:PropertiesFiltersDto):FindOptionsWhere<Property>{
        if(propertiesFiltersDto.bathrooms){
            where={...where,garages:Between(propertiesFiltersDto.garages.from,propertiesFiltersDto.garages.to)}
        }
        return where;
    }

    private generateQueryForArea(where:FindOptionsWhere<Property>,propertiesFiltersDto:PropertiesFiltersDto):FindOptionsWhere<Property>{
        // if(propertiesFiltersDto.area){
        //     where={...where,area:Between(+propertiesFiltersDto.area.from,+propertiesFiltersDto.area.to)}
        // }
        // return where;
        // todo
        return {};
    }

    private generateQueryForYearBuilt(where:FindOptionsWhere<Property>,propertiesFiltersDto:PropertiesFiltersDto):FindOptionsWhere<Property>{
        this.logger.debug("props",propertiesFiltersDto.yearBuilt);
        if(propertiesFiltersDto.yearBuilt){
            where={...where,yearBuilt:Between(+propertiesFiltersDto.yearBuilt.from,+propertiesFiltersDto.yearBuilt.to)}
        }
        return where;
    }

    private generateQueryForPropertyType(where:FindOptionsWhere<Property>,propertiesFiltersDto:PropertiesFiltersDto):FindOptionsWhere<Property>{
        if(propertiesFiltersDto.propertyType){
            where={...where,propertyType:Property.getPropertyTypeFromString(propertiesFiltersDto.propertyType.name)}
        }
        return where;
    }

    private generateQueryForPropertyStatus(where:FindOptionsWhere<Property>,propertiesFiltersDto:PropertiesFiltersDto):FindOptionsWhere<Property>{
        if(propertiesFiltersDto.propertyStatus){
            where={...where,propertyStatus:In(propertiesFiltersDto.propertyStatus.map(value=>Property.getPropertyStatusFromString(value.name)).filter(r=>r))}
        }
        return where;
    }

    private generateQueryForCity(where:FindOptionsWhere<Property>,propertiesFiltersDto:PropertiesFiltersDto):FindOptionsWhere<Property>{
        if(propertiesFiltersDto.city){
            where={...where,city: propertiesFiltersDto.city.name}
        }
        return where;
    }

    private generateQueryForZipCode(where:FindOptionsWhere<Property>,propertiesFiltersDto:PropertiesFiltersDto):FindOptionsWhere<Property>{
        if(propertiesFiltersDto.zipCode){
            where={...where,zipCode:propertiesFiltersDto.zipCode}
        }
        return where;
    }

    private generateQueryForNeighborhood(where:FindOptionsWhere<Property>,propertiesFiltersDto:PropertiesFiltersDto):FindOptionsWhere<Property>{
        if(propertiesFiltersDto.neighborhood){
            where={...where,neighborhood: In(propertiesFiltersDto.neighborhood.map(value => value.name))}
        }
        return where;
    }

    private generateQueryForFeatures(where:FindOptionsWhere<Property>,propertiesFiltersDto:PropertiesFiltersDto):FindOptionsWhere<Property>{
        if(propertiesFiltersDto.features){
            where={...where,features: In(propertiesFiltersDto.features.map(value => value.name))}
        }
        return where;
    }

    private generateQueryForIds(where:FindOptionsWhere<Property>,propertiesFiltersDto:PropertiesFiltersDto,ids:number[]=[]):FindOptionsWhere<Property>{
        if(propertiesFiltersDto.fromAgent>0 ){
            if(ids && ids.length>0){
                where={...where,id:In(ids)}
            }else{
                where={...where,id:In([-1])}
            }

        }
        return where;
    }

    private generateQueryForSkip(q:FindManyOptions<Property>,propertiesFiltersDto:PropertiesFiltersDto):FindManyOptions<Property>{
        if(propertiesFiltersDto.skip){
            q["skip"]=propertiesFiltersDto.skip
        }
        return q;
    }

    private generateQueryForTake(q:FindManyOptions<Property>,propertiesFiltersDto:PropertiesFiltersDto):FindManyOptions<Property>{
        if(propertiesFiltersDto.take){
            q["take"]=propertiesFiltersDto.take
        }
        return q;
    }


}
