import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

// class-validator为我们提供校验 如果参数无效 应用程序将自动响应400 BadRequest
export class CreateCoffeeDto {
  @ApiProperty({ description: 'The name of coffee.' }) // 该装饰器允许我们对属性设置各种模式 例如默认值 或描述信息
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'The brand of coffee.' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ example: [], description: 'The flavor of coffee.' })
  @IsString({ each: true }) // 确保数组的每一项都是string 期望是一个字符串的数组
  readonly flavors: string[]; // 口味
}
