import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Index,
    Point,
    ManyToOne,
    OneToMany,
    JoinTable,
    ManyToMany, JoinColumn
} from 'typeorm';
import {Exclude, plainToClass} from "class-transformer";
import {Agent} from "../entities/agent.entity";
import {Type} from "./type.entity";
import {Status} from "./status.entity";
import {Feature} from "../entities/feature.entity";

@Entity()
export class Property {

    public static readonly ID_FIELD_NAME = "id";
    public static readonly TITLE_FIELD_NAME = "title";
    public static readonly DESCRIPTION_FIELD_NAME = "description";
    public static readonly PROPERTY_TYPE_FIELD_NAME = "prop_type";
    public static readonly PROPERTY_STATUS_FIELD_NAME = "prop_status";
    public static readonly CITY_FIELD_NAME = "city";
    public static readonly ZIP_CODE_FIELD_NAME = "zip_code";
    public static readonly NEIGHBORHOOD_FIELD_NAME = "neighborhood";
    public static readonly STREET_FIELD_NAME = "street";
    public static readonly LOCATION_FIELD_NAME = "location";
    public static readonly FORMATTED_ADDRESS_FIELD_NAME = "formatted_address";
    public static readonly FEATURES_FIELD_NAME = "features";
    public static readonly FEATURED_FIELD_NAME = "featured";
    public static readonly PRICE_DOLLAR_FIELD_NAME = "price_dollar";
    public static readonly PRICE_EURO_FIELD_NAME = "price_euro";
    public static readonly BEDROOMS_FIELD_NAME = "bedrooms";
    public static readonly BATHROOMS_FIELD_NAME = "bathrooms";
    public static readonly GARAGES_FIELD_NAME = "garages";
    public static readonly AREA_FIELD_NAME = "area";
    public static readonly YEAR_BUILT_FIELD_NAME = "year_built";
    public static readonly RATINGS_COUNT_FIELD_NAME = "ratings_count";
    public static readonly RATINGS_VALUE_FIELD_NAME = "ratings_value";
    public static readonly ADDITIONAL_FEATURES_FIELD_NAME = "additional_features";
    public static readonly GALLERY_FIELD_NAME = "gallery";
    public static readonly PLANS_FIELD_NAME = "plans";
    public static readonly VIDEOS_FIELD_NAME = "videos";
    public static readonly PUBLISHED_FIELD_NAME = "published";
    public static readonly LAST_UPDATE_FIELD_NAME = "last_update";
    public static readonly VIEWS_FIELD_NAME = "views";

    @Exclude()
    public static getEntityFields(): string[] {
        return [
            Property.ID_FIELD_NAME,
            Property.TITLE_FIELD_NAME,
            Property.DESCRIPTION_FIELD_NAME,
            Property.PROPERTY_TYPE_FIELD_NAME,
            Property.PROPERTY_STATUS_FIELD_NAME,
            Property.CITY_FIELD_NAME,
            Property.ZIP_CODE_FIELD_NAME,
            Property.NEIGHBORHOOD_FIELD_NAME,
            Property.STREET_FIELD_NAME,
            Property.LOCATION_FIELD_NAME,
            Property.FORMATTED_ADDRESS_FIELD_NAME,
            Property.FEATURES_FIELD_NAME,
            Property.FEATURED_FIELD_NAME,
            Property.PRICE_DOLLAR_FIELD_NAME,
            Property.PRICE_EURO_FIELD_NAME,
            Property.BEDROOMS_FIELD_NAME,
            Property.BATHROOMS_FIELD_NAME,
            Property.GARAGES_FIELD_NAME,
            Property.AREA_FIELD_NAME,
            Property.YEAR_BUILT_FIELD_NAME,
            Property.RATINGS_COUNT_FIELD_NAME,
            Property.RATINGS_VALUE_FIELD_NAME,
            Property.ADDITIONAL_FEATURES_FIELD_NAME,
            Property.GALLERY_FIELD_NAME,
            Property.PLANS_FIELD_NAME,
            Property.VIDEOS_FIELD_NAME,
            Property.PUBLISHED_FIELD_NAME,
            Property.LAST_UPDATE_FIELD_NAME,
            Property.VIEWS_FIELD_NAME,
        ]
    }

    @Exclude()
    public getCurrentValues():any[]{
        // ordering is important
        return [
            this.id,
            this.title,
            this.desc,
            this.propertyType,
            this.propertyStatuses,

        ]
    }

    public toString():string{
        return JSON.stringify(this);
    }


    @Exclude()
    public static fromJson(json: Record<any, any>): Property {
        const property = plainToClass<Property, object>(Property, json);
        // TODO check if lib supports custom parsing.
        // console.log(json)
        // console.log(property);
        // property.location=p;
        // property.propertyType=PropertyType.OFFICE.toString();
        // property.propertyStatus=json["propertyStatus"];
        return property;
    }

    @PrimaryGeneratedColumn("increment", {name: Property.ID_FIELD_NAME})
    id: number;

    @ManyToOne(()=>Agent,(agent)=>agent.properties,{nullable:false})
    agent:Agent;

    @Column({name: Property.TITLE_FIELD_NAME})
    title: string;

    @Column({name: Property.DESCRIPTION_FIELD_NAME})
    desc: string;

    @ManyToOne(() => Type,(type)=>type.id,{cascade:true})
    propertyType: Type;

    @ManyToMany(() => Status,(status)=>status.properties,{cascade:true})
    @JoinTable()
    propertyStatuses: Status[];

    // TODO must fix the geospatial storage
    //  and location stuff
    // @Column({name: Property.CITY_FIELD_NAME,nullable:true})
    // city: string;
    //
    // @Column({name: Property.ZIP_CODE_FIELD_NAME,nullable:true})
    // zipCode: string;
    //
    // @Column("simple-array", {name: Property.NEIGHBORHOOD_FIELD_NAME,nullable:true})
    // neighborhood: string[];
    //
    // @Column("simple-array", {name: Property.STREET_FIELD_NAME,nullable:true})
    // street: string[];

    // @Index({spatial: true})
    // @Column({
    //     type: "geometry",
    //     spatialFeatureType: 'Point',
    //     srid: 4326,
    //     nullable: true,
    //     name: Property.LOCATION_FIELD_NAME
    // })
    // @Column("geometry",{
    //     name:Property.LOCATION_FIELD_NAME,
    //     spatialFeatureType: 'Point'
    // })

    // @Column({name:Property.LOCATION_FIELD_NAME,type:"simple-json",nullable:true})
    // location: {
    //     "lat": number,
    //     "lng": number
    // };
    //
    @Column({
        name: Property.FORMATTED_ADDRESS_FIELD_NAME
    })
    formattedAddress: string;


    @ManyToMany(() => Feature,(feature)=>feature.properties,{cascade:true})
    @JoinTable()
    features: Feature[];
    //
    @Column({name: Property.FEATURED_FIELD_NAME,nullable:true})
    featured: boolean;
    //
    @Column({name: Property.PRICE_DOLLAR_FIELD_NAME,nullable:true})
    price: number

    @Column({name: Property.BEDROOMS_FIELD_NAME,nullable:true})
    bedrooms: number;

    @Column({name: Property.BATHROOMS_FIELD_NAME,nullable:true})
    bathrooms: number;

    @Column({name: Property.GARAGES_FIELD_NAME,nullable:true})
    garages: number;

    @Column({name: Property.AREA_FIELD_NAME,nullable:true})
    area: number;

    @Column({name: Property.YEAR_BUILT_FIELD_NAME,nullable:true})
    yearBuilt: number;

    // TODO decide if keep this
    // @Column({name: Property.RATINGS_COUNT_FIELD_NAME,nullable:true})
    // ratingsCount: number;
    //
    // @Column({name: Property.RATINGS_VALUE_FIELD_NAME,nullable:true})
    // ratingsValue: number;
    //
    // TODO decide what to do with this
    // @Column({name: Property.GALLERY_FIELD_NAME, type: "simple-json",nullable:true})
    // gallery: Gallery[];
    //
    // @Column({name: Property.PLANS_FIELD_NAME, type: "simple-json",nullable:true})
    // plans: Plan[];
    //
    // @Column({name: Property.VIDEOS_FIELD_NAME, type: "simple-json",nullable:true})
    // videos: Video[];
    //
    @Column({name: Property.PUBLISHED_FIELD_NAME,nullable:true})
    published: string;

    @Column({name: Property.LAST_UPDATE_FIELD_NAME,nullable:true})
    lastUpdate: string;

    @Column({name: Property.VIEWS_FIELD_NAME,nullable:true})
    views: number;
}



export interface Gallery {
    small: string
    medium: string
    big: string
}

export interface Plan {
    name: string
    desc: string
    area: Area2
    rooms: number
    baths: number
    image: string
}

export interface Area2 {
    value: number
    unit: string
}

export interface Video {
    name: string
    link: string
}

