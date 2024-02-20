import {CanActivate, ExecutionContext, Injectable, Logger} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly logger:Logger=new Logger(AuthenticationGuard.name);
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.debug("canActivate",context+"");
    return false;
  }
}
