import {CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException} from '@nestjs/common';
import {Observable, tap} from 'rxjs';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
        .handle()
        .pipe(tap(data => {
            console.log("data is "+JSON.stringify(data) + " '"+data+"'");
          if (data === undefined) { throw new NotFoundException("Test msg"); }
        }));
  }


}
