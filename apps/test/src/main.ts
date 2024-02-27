import { NestFactory } from '@nestjs/core';
import { TestModule } from './test.module';
import {handleBooting} from "@app/shared/boot-utils";

handleBooting(TestModule);
