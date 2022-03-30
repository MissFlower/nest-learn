import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { Coffee, CoffeeSchema } from './entites/coffee.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCoffeeDto } from './dto/create-coffee.dto';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectModel(Coffee.name)
    private readonly coffeeModel: Model<Coffee>,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeModel.find().skip(offset).limit(limit).exec();
  }

  async findOne(id: string) {
    const coffee = await this.coffeeModel.findOne({ _id: id }).exec();
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = new this.coffeeModel(createCoffeeDto);
    return coffee.save();
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    // 第一个参数查询
    // 第一个参数是MongooseUpdateQuery对象
    // 第三个参数让我们设置Mongoose在进程执行后如何运行 new:true是我们想得到更新后最新的数据 如果不设置 会得到更新之前的数据
    const existingCoffee = await this.coffeeModel
      .findByIdAndUpdate({ _id: id }, { $set: updateCoffeeDto }, { new: true })
      .exec();
    if (!existingCoffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return existingCoffee;
  }

  async remove(id: string) {
    const coffee = await this.findOne(id);
    return coffee.remove();
  }
}
