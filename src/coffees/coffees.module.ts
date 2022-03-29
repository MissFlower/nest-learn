import { Coffee } from './entities/coffee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { Module, Injectable } from '@nestjs/common';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS, COFFEE_FLAVORS } from './coffees.constants';
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';
import { DataSource } from 'typeorm';

class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable()
export class CoffeeFlavorsFactory {
  create() {
    /* ...do something... */
    return ['flavor one', 'flavor two'];
  }
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    ConfigModule.forFeature(coffeesConfig),
  ], // 使用forFeature()将TypeORM注册到此子模块中 请记住 在此之前我们在主AppModule中使用了forRoot() 但我们只这样做了一次 其他模块都将使用forFeature()
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    { provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafe'] },
    // useClass 动态选择
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    },
    CoffeeFlavorsFactory,
    {
      provide: COFFEE_FLAVORS,
      useFactory: (flavorsFactory: CoffeeFlavorsFactory) =>
        flavorsFactory.create(),
      inject: [CoffeeFlavorsFactory],
    },
  ],
  exports: [CoffeesService], // 这里需要到处 否则别的模块(coffee-rating)无法使用
})
export class CoffeesModule {}
