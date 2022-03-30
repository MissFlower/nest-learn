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

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}
  // 访问路径为/coffees
  // @Get()
  // findAll() {
  //   return 'This action returns all coffees';
  // }
  // 不推荐
  // @Get()
  // findAll(@Res() response) {
  //   return response.status(201).send('This action returns all coffees');
  // }

  @Get()
  // localhost:3000/coffees?limit=20&offset=10
  findAllByPagination(@Query() paginationQuery: PaginationQueryDto) {
    return this.coffeesService.findAll(paginationQuery);
    // return `This action returns all coffees. Limit: ${limit}, offset: ${offset}`;
  }

  // 同一个请求写过之后在写不会生效
  @Get()
  findSome() {
    return 'This action returns some coffees';
  }

  // 根据路由获取动态参数
  @Get(':id')
  // findOne(@Param() params) {
  //   return `This action retruns #${params.id} coffee`;
  // }
  // 如果我门只想拿特定的参数 如名为id 我们可以这样
  findOne(@Param('id') id: string) {
    return this.coffeesService.findOne(id);
    // return `This action retruns #${id} coffee`;
  }

  // 访问路径为/coffess/every
  @Get('every')
  findEvery() {
    return 'This action returns every coffees';
  }

  // Post请求
  // @Post()
  // findPost() {
  //   return 'This action return post';
  // }

  @Post('create')
  // 访问全部的body参数
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    console.log(createCoffeeDto instanceof CreateCoffeeDto);
    return this.coffeesService.create(createCoffeeDto);
    // return body;
  }
  // 访问部分的body参数
  // create(@Body('name') body) {]
  //   return body;
  // }

  @Post('edit')
  @HttpCode(HttpStatus.ACCEPTED)
  edit(@Body() body) {
    return body;
  }

  // 更新 由于patch是对单个资源进行部分更新 因此它需要一个id和表示给定资源的所有可能的有效负载
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
    // return `This action updates #${id} coffee`;
  }

  // 删除
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(id);
    // return `This action removes #${id} coffee`;
  }
}
