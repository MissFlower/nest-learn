import { PartialType } from '@nestjs/swagger'; // 从@nestjs/swagger包 而不是@nestjs/mapped-types包中导入 解决swagger-ui上入参不展示问题 主要原因可能是这些都是可选属性
import { CreateCoffeeDto } from './create-coffee.dto';

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
