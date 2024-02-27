import {Body, Controller, Get, Logger, NotFoundException, Post, Req, UseInterceptors} from '@nestjs/common';
import { GatewayService } from './gateway.service';
import {PayloadDto} from "./payload.dto";

@Controller("gateway")
export class GatewayController {

  private readonly LOGGER:Logger=new Logger(GatewayController.name);

  constructor(private readonly gatewayService: GatewayService) {}

  @Get("test")
  getHello(): string {
    return "test endpoint"
  }

  @Get()
  getHelloEmpty(): string {
    // Logger.log("request in controller is '"+JSON.stringify(req.route)+"'");
    throw new NotFoundException("asd");
    // return "empty endpoint";
  }

  @Post()
  getHelloEmptyPost(@Body() x:PayloadDto): string {
    return "post";
    // return new PropertyEntity(1,"asd","asd");
  }

}
