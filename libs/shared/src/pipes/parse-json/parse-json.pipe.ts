import {ArgumentMetadata, Injectable, Logger, PipeTransform} from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  private readonly logger = new Logger(ParseJsonPipe.name);

  transform(value: any, metadata: ArgumentMetadata):Record<any, any> {
    try {
      return JSON.parse(value||"{}");
    } catch (error){
      this.logger.error(error);
      return JSON.parse("{}")
    }

  }
}
