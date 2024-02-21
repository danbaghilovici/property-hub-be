import {ArgumentMetadata, Injectable, Logger, PipeTransform} from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  private readonly logger = new Logger(ParseJsonPipe.name);

  transform(value: any, metadata: ArgumentMetadata):Record<any, any> {
    this.logger.log(JSON.stringify(value),JSON.stringify(metadata));
    return JSON.parse(value||"{}");
  }
}
