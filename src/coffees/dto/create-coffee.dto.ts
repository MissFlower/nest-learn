import { IsString } from 'class-validator';

// class-validator为我们提供校验 如果参数无效 应用程序将自动响应400 BadRequest
export class CreateCoffeeDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly brand: string;

  @IsString({ each: true }) // 确保数组的每一项都是string 期望是一个字符串的数组
  readonly flavors: string[]; // 口味
}
