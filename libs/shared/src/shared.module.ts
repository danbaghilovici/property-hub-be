import {ClassSerializerInterceptor, Module} from '@nestjs/common';
import {SharedService} from './shared.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule, TypeOrmModuleOptions} from "@nestjs/typeorm";
import {APP_INTERCEPTOR} from "@nestjs/core";
import {Property} from "../src/entities/property.entity";
import {typeOrmAsyncConfig} from "../../../typeorm.config";
import {DecodingURIPipe} from "@app/shared/pipes/decoding/decode-uri-pipe.service";
import {ParseJsonPipe} from "@app/shared/pipes/parse-json/parse-json.pipe";

@Module({
    providers: [SharedService,DecodingURIPipe,ParseJsonPipe,
        {
            provide: APP_INTERCEPTOR,
            useClass: ClassSerializerInterceptor,
        }
    ],
    exports: [SharedService,DecodingURIPipe,ParseJsonPipe],
    imports: [
        ConfigModule.forRoot({isGlobal: true, envFilePath: ".env/local.env"}),
        TypeOrmModule.forRootAsync(typeOrmAsyncConfig)
    ]
})
export class SharedModule {
}
