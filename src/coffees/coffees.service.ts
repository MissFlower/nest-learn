import { Coffee } from './entities/coffee.entity';
import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS, COFFEE_FLAVORS } from './coffees.constants';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.DEFAULT }) // 此装饰器将CoffeesService类标记为“提供者”
// scope: Scope.DEFAULT 默认值 只实例化一次
// scope: Scope.TRANSIENT 转瞬的 每次都会实例化
// scope: Scope.REQUEST 会在每次请求时 实例化 并在请求完后进行垃圾回收  使用与回去ip adress, cookies, headers
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,

    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>, // private readonly dataSource: DataSource,

    @Inject(COFFEE_BRANDS)
    coffeeBrands: string[],

    @Inject(COFFEE_FLAVORS)
    coffeeFlavors: string[],

    private readonly configService: ConfigService,
  ) {
    // console.log(coffeeBrands);
    // console.log(coffeeFlavors);
    const databaseHost = this.configService.get(
      'database.host',
      'localhost', // 如果没有设置DATABASE_HOST 则将localhost设置为默认值
    );
    console.log(databaseHost);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset, // 从第几条开始
      take: limit, // 需要多少条
    });
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne({
      where: {
        id: +id,
      },
      relations: ['flavors'],
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));
    // 如果在数据库中没有找到传入的实体id 则preload方法将返回undefined
    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string) {
    const coffee = await this.findOne(id);
    // 这里我们不需要判断coffee是否存在是因为findOne已经做过了处理
    return this.coffeeRepository.remove(coffee);
  }

  async recommendCoffee(coffee: Coffee) {
    const dataSource = new DataSource({
      type: 'postgres',
    });
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect(); // 连接到数据库
    await queryRunner.startTransaction(); // 开始交易
    try {
      coffee.recommendations++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };
      // 使用queryRunner实体管理器来保存coffee和事件实体
      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);
      await queryRunner.commitTransaction();
    } catch (err) {
      // 如果出现错误 通过回滚整个事务来防止数据库中的不一致
      await queryRunner.rollbackTransaction(); // 事务回滚
    } finally {
      // 确保一切完成以后释放或关闭queryRunner实体
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({
      where: {
        name,
      },
    });

    if (existingFlavor) {
      return existingFlavor;
    }

    return this.flavorRepository.create({ name });
  }
}
