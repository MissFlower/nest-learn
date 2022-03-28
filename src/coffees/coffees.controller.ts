import { ParseIntPipe } from './../common/pipes/parse-int.pipe';
import { CoffeesService } from './coffees.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Protocol } from 'src/common/decorators/protocol.decorator';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';

@Controller('coffees')
@ApiTags('coffees') // swagger文档分组
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {
    console.log('CoffeesController created');
  }

  @ApiForbiddenResponse({ description: 'Forbidden.' }) // swagger文档中会出现403状态
  @Public()
  @Get()
  // localhost:3000/coffees?limit=20&offset=10
  async findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    // const { limit, offset } = paginationQuery;
    console.log(protocol);

    await new Promise((resolve) => setTimeout(resolve, 5000));
    return this.coffeesService.findAll(paginationQuery);
    // return `This action returns all coffees. Limit: ${limit}, offset: ${offset}`;
  }

  // 根据路由获取动态参数
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(`findOne:::${id}`);

    return this.coffeesService.findOne(id);
    // return `This action retruns #${id} coffee`;
  }

  @Post('create')
  // 访问全部的body参数
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
    // return body;
  }
  // 访问部分的body参数
  // create(@Body('name') body) {]
  //   return body;
  // }

  // 更新 由于patch是对单个资源进行部分更新 因此它需要一个id和表示给定资源的所有可能的有效负载
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
    // return `This action updates #${id} coffee`;
  }

  // 删除
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.coffeesService.remove(id);
    // return `This action removes #${id} coffee`;
  }
}
