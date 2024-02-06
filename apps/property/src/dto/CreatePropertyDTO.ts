import {IsInt, IsString} from "class-validator";

export class CreatePropertyDTO{

    @IsString()
    title:string;
    desc:string;
    propertyTypeId:number;
    propertyStatusIds:number[]=[];

    formattedAddress:string;
    featured:boolean=false;
    featuresIds:number[]=[];
    bedrooms:number;
    bathrooms:number;

    @IsInt()
    garages:number;
    yearBuilt:number;
}
