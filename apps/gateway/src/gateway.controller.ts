import {Controller, Get, Logger, NotFoundException, Post, Req, UseInterceptors} from '@nestjs/common';
import { GatewayService } from './gateway.service';
import {Request} from "express";
import {Property} from "../../../libs/shared/src/entities/property.entity";
import {NotFoundInterceptor} from "@app/shared/not-found/not-found.interceptor";
import {LoggingInterceptor} from "@app/shared/logging/logging.interceptor";
// import {NotFoundInterceptor} from "@app/shared/not-found/not-found.interceptor";


// @UseInterceptors(NotFoundInterceptor)
// @UseInterceptors(LoggingInterceptor)
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
  getHelloEmptyPost(): string {
    return "post";
    // return new PropertyEntity(1,"asd","asd");
  }

}
