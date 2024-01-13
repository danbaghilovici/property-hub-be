import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DecodingURIPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata):string {
    return decodeURIComponent(value||"");
  }
}
