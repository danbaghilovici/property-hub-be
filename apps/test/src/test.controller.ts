import {Body, Controller, Get, Post} from '@nestjs/common';
import { TestService } from './test.service';
import {TestDto} from "./test.dto";

@Controller("test")
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  getHello(@Body() x:TestDto): string {
    return this.testService.getHello();
  }
}
