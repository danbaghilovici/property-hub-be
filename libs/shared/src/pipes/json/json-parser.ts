import {ArgumentMetadata, Injectable, Logger, PipeTransform} from '@nestjs/common';

@Injectable()
export class InvalidJsonParser implements PipeTransform {

    private readonly logger = new Logger(InvalidJsonParser.name);

    transform(value: any, metadata: ArgumentMetadata):string {
        this.logger.debug("asdwa",value,value?value:"{}");
        return value?value:"{}";
    }
}
