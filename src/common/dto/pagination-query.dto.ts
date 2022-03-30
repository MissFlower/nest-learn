import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional() // 可选的
  @IsPositive() // 大于0的正整数
  @Type(() => Number) // 暂留
  // 这是显式的指定了类型转换 如果我们在全局的校验ValidationPipe中设置 这里就不需要了 会进行隐式转换
  // transformOptions: {
  //   enableImplicitConversion: true, //是否开启隐式转换
  // },
  limit: number;

  @IsOptional() // 可选的
  @IsPositive() // 大于0的正整数
  @Type(() => Number)
  offset: number;
}
