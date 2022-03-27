// import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional() // 可选装饰器
  @IsPositive() // 校验值是否为正整数
  // @Type(() => Number)
  limit: number;

  @IsOptional() // 可选装饰器
  @IsPositive() // 校验值是否为正整数
  // @Type(() => Number) // 在全局设置了enableImplicitConversion：true 这里就不需要了
  offset: number;
}
