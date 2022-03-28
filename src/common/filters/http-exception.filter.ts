import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 该方法能够使我们获取到请求或响应对象
    const response = ctx.getResponse<Response>(); // 该方法将返回我们底层的response

    const status = exception.getStatus(); // 获取异常的http状态
    const exceptionResponse = exception.getResponse(); // 获取异常的response
    const error =
      typeof response === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as object);

    response.status(status).json({
      ...error,
      timestamp: new Date().toISOString(),
    });
  }
}
