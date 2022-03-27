import { Coffee } from './entities/coffee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { Module } from '@nestjs/common';
import { Flavor } from './entities/flavor.entity';
import { Event } from 'src/events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])], // 使用forFeature()将TypeORM注册到此子模块中 请记住 在此之前我们在主AppModule中使用了forRoot() 但我们只这样做了一次 其他模块都将使用forFeature()
  controllers: [CoffeesController],
  providers: [CoffeesService],
})
export class CoffeesModule {}
