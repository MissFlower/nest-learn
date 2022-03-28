import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';

@Module({
  imports: [
    CoffeesModule,
    TypeOrmModule.forRoot({
      //请记住 我们只在主AppModule中使用了forRoot() 其他模块都将使用forFeature()
      type: 'postgres', // 使用数据库类型
      host: 'localhost', // 主机 本地开发使用localhost
      port: 5432, // 端口号 在docker-compose.yml中设置的
      username: 'postgres', // 是访问我们数据库的用户名 这是PostgreSQL数据库的默认设置
      password: 'pass123', // 密码 在docker-compose.yml中设置的
      database: 'postgres', // 数据库名称
      autoLoadEntities: true, // 自动加载模块 而不是制定实体数组
      synchronize: true, // 同步 确保我们的TypeORM实体在每次运行应用程序时都会与数据库同步 切记 只用于开发 生产中禁用
    }),
    CoffeeRatingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
