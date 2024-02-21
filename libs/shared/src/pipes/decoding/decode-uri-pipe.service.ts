import {ArgumentMetadata, Injectable, Logger, PipeTransform} from '@nestjs/common';

@Injectable()
export class DecodingURIPipe implements PipeTransform {

  private readonly logger = new Logger(DecodingURIPipe.name);

  transform(value: any, metadata: ArgumentMetadata):string {
    return decodeURIComponent(value||"");
  }
}
