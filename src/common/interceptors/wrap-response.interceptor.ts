import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    // tap运算符 在Observable流正常终止时 调用console.log
    // return next.handle().pipe(tap((data) => console.log('After...', data)));
    return next.handle().pipe(map((data) => ({ data })));
  }
}
