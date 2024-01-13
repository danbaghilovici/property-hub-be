import {Body, Controller, Get, Logger, Param, ParseIntPipe, Query} from '@nestjs/common';
import { PropertyService } from './property.service';
import {Observable} from "rxjs";
import {Property} from "@entities/property";
import {PropertiesFiltersDto} from "./property-filters.dto";
import {DecodingURIPipe} from "@app/shared/pipes/decoding/decode-uri-pipe.service";
import {ParseJsonPipe} from "@app/shared/pipes/parse-json/parse-json.pipe";

@Controller("properties")
export class PropertyController {

  private readonly logger:Logger=new Logger(PropertyController.name);
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  getProperties(
      @Query("filters",DecodingURIPipe,ParseJsonPipe)
          propertiesFiltersDto:PropertiesFiltersDto):Observable<Property[]>{
    return this.propertyService.getAvailableProperties(propertiesFiltersDto);
  }

  @Get("by-agent/:agentId")
  getPropertiesByAgent(@Param('agentId',ParseIntPipe) id: number):Observable<Property[]> {
    // this.logger.log("aici cu param");
    return this.propertyService.getPropertiesFromAgentId(id)
  }
}
