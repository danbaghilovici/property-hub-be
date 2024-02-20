import {Body, Controller, Get, Logger, Param, ParseIntPipe, Post, Query, UseGuards} from '@nestjs/common';
import { PropertyService } from './property.service';
import {Observable} from "rxjs";
import {Property} from "../../../libs/shared/src/entities/property.entity";
import {Type} from "../../../libs/shared/src/entities/type.entity";
import {PropertiesFiltersDto} from "./property-filters.dto";
import {DecodingURIPipe} from "@app/shared/pipes/decoding/decode-uri-pipe.service";
import {ParseJsonPipe} from "@app/shared/pipes/parse-json/parse-json.pipe";
import {Status} from "../../../libs/shared/src/entities/status.entity";
import {CreatePropertyDTO} from "./dto/CreatePropertyDTO";
import {AuthGuard} from "@nestjs/passport";

@Controller("properties")
export class PropertyController {

  private readonly logger:Logger=new Logger(PropertyController.name);
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  getProperties(
      @Query("filters",DecodingURIPipe,ParseJsonPipe) propertiesFiltersDto:PropertiesFiltersDto)
      :Observable<Property[]>{
    return this.propertyService.getAvailableProperties(propertiesFiltersDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  addProperty(@Body() createPropertyDto:CreatePropertyDTO):Observable<Property>{
    this.logger.debug("Received ",JSON.stringify(createPropertyDto));
    return this.propertyService.addNewProperty(createPropertyDto);
  }

  @Get("types")
  getPropertyTypes():Observable<Type[]>{
    return this.propertyService.getAvailablePropertyTypes();
  }

  @Get("statuses")
  getPropertyStatuses():Observable<Status[]>{
    return this.propertyService.getAvailablePropertyStatuses();
  }
}
