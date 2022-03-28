import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.time('Request-response time');
    console.log('Hi from niddleware!');
    // 注册中间件
    // 中间件没有特别绑定到任何方法 我们不能使用装饰器以声明方式绑定它们
    // 相反我们将中间件绑定到路由上 表示为字符串

    res.on('finish', () => console.timeEnd('Request-response time'));
    // 注意：此计算将包括此路由可能具体有的拦截器、过滤器、守卫、方法处理程序
    next();
  }
}
