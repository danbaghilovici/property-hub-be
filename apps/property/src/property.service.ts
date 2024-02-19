import {Injectable, Logger,} from '@nestjs/common';
import {Between, DataSource, FindOptionsWhereProperty, In, Repository} from "typeorm";
import {Property} from "../../../libs/shared/src/entities/property.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {catchError, concat, concatMap, defer, Observable, of, skip, switchMap} from "rxjs";

import {PropertiesFiltersDto} from "./property-filters.dto";
import {FindOptionsWhere} from "typeorm/find-options/FindOptionsWhere";
import {FindManyOptions} from "typeorm/find-options/FindManyOptions";
import {Type} from "../../../libs/shared/src/entities/type.entity";
import {Status} from "../../../libs/shared/src/entities/status.entity";
import {CreatePropertyDTO} from "./dto/CreatePropertyDTO";
import {Agent} from "@app/shared/entities/agent.entity";
import {Feature} from "../../../libs/shared/src/entities/feature.entity";

@Injectable()
export class PropertyService {
    private readonly logger = new Logger(PropertyService.name);

    constructor(
        private dataSource: DataSource,
        @InjectRepository(Property) private readonly propertyRepository: Repository<Property>,
        @InjectRepository(Type) private readonly propertyTypesRepository: Repository<Type>,
        @InjectRepository(Status) private readonly propertyStatusRepository: Repository<Status>
    ) {
    }

    private static transformCreatePropertyDtoToLocalEntity(createDto:CreatePropertyDTO): Property{
        const p=new Property();
        p.title=createDto.title;
        p.desc=createDto.desc;
        p.propertyType={id:createDto.propertyTypeId} as Type;
        const statuses=[];
        createDto.propertyStatusIds.forEach(id=>statuses.push({id}));
        p.propertyStatuses=statuses as Status[]
        p.formattedAddress=createDto.formattedAddress;
        p.featured=createDto.featured;
        const features=[] as Feature[];
        createDto.featuresIds.forEach(id=>features.push({id:id} as Feature))
        p.features=features;
        p.bedrooms=createDto.bedrooms;
        p.bathrooms=createDto.bathrooms;
        p.garages=createDto.garages;
        p.yearBuilt=createDto.yearBuilt;
        p.published=Date.now+"";
        p.views=0;
        p.lastUpdate=null;
        p.agent = {id:1} as Agent
        return p;
    }

    public getAvailablePropertyTypes():Observable<Type[]>{
        return defer(()=>this.propertyTypesRepository.find())
    }

    public getAvailablePropertyStatuses():Observable<Status[]>{
        return defer(()=>this.propertyStatusRepository.find());
    }

    public addNewProperty(propertyDto:CreatePropertyDTO):Observable<Property>{
        let property:Property = PropertyService.transformCreatePropertyDtoToLocalEntity(propertyDto);
        this.logger.debug(property);
        return defer(()=>
            this.propertyRepository.save(property))
    }


    public getAvailableProperties(propertiesFiltersDto: PropertiesFiltersDto = new PropertiesFiltersDto()): Observable<Property[]> {
        this.logger.log("Calling getAvailableProperties");
        return this.buildQuery(propertiesFiltersDto)
            .pipe(
                switchMap((whereQ) => {
                    this.logger.debug("generated where query", whereQ);
                    const q: FindManyOptions = {where: whereQ, relations:{agent:true,propertyStatuses:true}};
                    // this.generateQueryForSkip(q, propertiesFiltersDto);
                    // this.generateQueryForTake(q, propertiesFiltersDto);
                    this.logger.debug("query is ", q);
                    return defer(() => this.propertyRepository.find(q))
                }))
    }


    private buildQuery(propertiesFiltersDto: PropertiesFiltersDto): Observable<FindOptionsWhere<Property>> {
        this.logger.debug("filters", propertiesFiltersDto);

        let where: FindOptionsWhere<Property> = {};
        const filters: Function[] = [
            // this.generateQueryForAgent,
            // this.generateQueryForPropertyType,
            // this.generateQueryForPropertyStatus,
            // this.generateQueryForPrice,
            // this.generateQueryForCity,
            // this.generateQueryForZipCode,
            // this.generateQueryForNeighborhood,
            // this.generateQueryForStreet,
            // this.generateQueryForBedrooms,
            // this.generateQueryForBathrooms,
            // this.generateQueryForGarages,
            // this.generateQueryForArea,
            // this.generateQueryForYearBuilt,
            // this.generateQueryForFeatures

        ]
        return of(filters
            .map(func => func.apply(this, [where, propertiesFiltersDto]))
            .reduce((accumulator, currentValue, {}) => {
                // very inefficient but works for now
                return {...accumulator, ...currentValue}
            },[]));

    }

    // private generateQueryForBedrooms(where: FindOptionsWhere<Property>, propertiesFiltersDto: PropertiesFiltersDto): FindOptionsWhere<Property> {
    //     if (propertiesFiltersDto.bedrooms) {
    //         // @ts-ignore
    //         where = {...where, bedrooms: Between(propertiesFiltersDto.bedrooms.from, propertiesFiltersDto.bedrooms.to)}
    //     }
    //     return where;
    //
    // }
    //
    // private generateQueryForPrice(where: FindOptionsWhere<Property>, propertiesFiltersDto: PropertiesFiltersDto): FindOptionsWhere<Property> {
    //     // TODO
    //     return {};
    // }
    //
    // private generateQueryForStreet(where: FindOptionsWhere<Property>, propertiesFiltersDto: PropertiesFiltersDto): FindOptionsWhere<Property> {
    //     // TODO
    //     return {};
    // }
    //
    //
    // private generateQueryForBathrooms(where: FindOptionsWhere<Property>, propertiesFiltersDto: PropertiesFiltersDto): FindOptionsWhere<Property> {
    //     if (propertiesFiltersDto.bathrooms) {
    //         where = {
    //             ...where,
    //             bathrooms: Between(propertiesFiltersDto.bathrooms.from, propertiesFiltersDto.bathrooms.to)
    //         }
    //     }
    //     return where;
    // }
    //
    // private generateQueryForGarages(where: FindOptionsWhere<Property>, propertiesFiltersDto: PropertiesFiltersDto): FindOptionsWhere<Property> {
    //     if (propertiesFiltersDto.bathrooms) {
    //         where = {...where, garages: Between(propertiesFiltersDto.garages.from, propertiesFiltersDto.garages.to)}
    //     }
    //     return where;
    // }
    //
    // private generateQueryForArea(where: FindOptionsWhere<Property>, propertiesFiltersDto: PropertiesFiltersDto): FindOptionsWhere<Property> {
    //     // if(propertiesFiltersDto.area){
    //     //     where={...where,area:Between(+propertiesFiltersDto.area.from,+propertiesFiltersDto.area.to)}
    //     // }
    //     // return where;
    //     // todo
    //     return {};
    // }
    //
    // private generateQueryForYearBuilt(where: FindOptionsWhere<Property>, propertiesFiltersDto: PropertiesFiltersDto): FindOptionsWhere<Property> {
    //     this.logger.debug("props", propertiesFiltersDto.yearBuilt);
    //     if (propertiesFiltersDto.yearBuilt) {
    //         where = {
    //             ...where,
    //             yearBuilt: Between(+propertiesFiltersDto.yearBuilt.from, +propertiesFiltersDto.yearBuilt.to)
    //         }
    //     }
    //     return where;
    // }
    //
    // private generateQueryForPropertyType(where: FindOptionsWhere<Property>, propertiesFiltersDto: PropertiesFiltersDto): FindOptionsWhere<Property> {
    //     if (propertiesFiltersDto.propertyType) {
    //         where = {...where, propertyType: Property.getPropertyTypeFromString(propertiesFiltersDto.propertyType.name)}
    //     }
    //     return where;
    // }
    //
    // private generateQueryForPropertyStatus(where: FindOptionsWhere<Property>, propertiesFiltersDto: PropertiesFiltersDto): FindOptionsWhere<Property> {
    //     if (propertiesFiltersDto.propertyStatus) {
    //         where = {
    //             ...where,
    //             propertyStatus: In(propertiesFiltersDto.propertyStatus.map(value => Property.getPropertyStatusFromString(value.name)).filter(r => r))
    //         }
    //     }
    //     return where;
    // }
    //
    // private generateQueryForCity(where: FindOptionsWhere<Property>, propertiesFiltersDto: PropertiesFiltersDto): FindOptionsWhere<Property> {
    //     if (propertiesFiltersDto.city) {
    //         where = {...where, city: propertiesFiltersDto.city.name}
    //     }
    //     return where;
    // }
    //
    // private generateQueryForZipCode(where: FindOptionsWhere<Property>, propertiesFiltersDto: PropertiesFiltersDto): FindOptionsWhere<Property> {
    //     if (propertiesFiltersDto.zipCode) {
    //         where = {...where, zipCode: propertiesFiltersDto.zipCode}
    //     }
    //     return where;
    // }
    //
    // private generateQueryForNeighborhood(where: FindOptionsWhere<Property>, propertiesFiltersDto: PropertiesFiltersDto): FindOptionsWhere<Property> {
    //     if (propertiesFiltersDto.neighborhood) {
    //         where = {...where, neighborhood: In(propertiesFiltersDto.neighborhood.map(value => value.name))}
    //     }
    //     return where;
    // }
    //
    // private generateQueryForFeatures(where: FindOptionsWhere<Property>, propertiesFiltersDto: PropertiesFiltersDto): FindOptionsWhere<Property> {
    //     if (propertiesFiltersDto.features) {
    //         where = {...where, features: In(propertiesFiltersDto.features.map(value => value.name))}
    //     }
    //     return where;
    // }
    //
    // private generateQueryForAgent(where: FindOptionsWhere<Property>, propertiesFiltersDto: PropertiesFiltersDto): FindOptionsWhere<Property> {
    //     if (propertiesFiltersDto.fromAgent > 0) {
    //         where={...where,agent:+propertiesFiltersDto.fromAgent}
    //     }
    //     this.logger.log("set agent ",propertiesFiltersDto.fromAgent)
    //     return where;
    // }
    //
    // private generateQueryForSkip(q: FindManyOptions<Property>, propertiesFiltersDto: PropertiesFiltersDto): FindManyOptions<Property> {
    //     if (propertiesFiltersDto.skip) {
    //         q["skip"] = propertiesFiltersDto.skip
    //     }
    //     return q;
    // }
    //
    // private generateQueryForTake(q: FindManyOptions<Property>, propertiesFiltersDto: PropertiesFiltersDto): FindManyOptions<Property> {
    //     if (propertiesFiltersDto.take) {
    //         q["take"] = propertiesFiltersDto.take
    //     }
    //     return q;
    // }


}
