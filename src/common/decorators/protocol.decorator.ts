import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Protocol = createParamDecorator(
  (defaultValue: string, ctx: ExecutionContext) => {
    // defaultValue 装饰器传来的参数
    console.log({ defaultValue });

    const request = ctx.switchToHttp().getRequest();

    return request.protocol;
  },
);
