import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { AbcController } from './modules/abc/abc.controller';
import { CoffeesModule } from './coffees/coffees.module';

@Module({
  imports: [CoffeesModule],
  controllers: [AppController, CatsController, AbcController],
  providers: [AppService],
})
export class AppModule {}
