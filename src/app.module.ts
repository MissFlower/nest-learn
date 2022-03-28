import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
// import Joi from '@hapi/joi';

@Module({
  imports: [
    // 如果TypeOrmModule.forRoot放在了ConfigModule.forRoot的上面 会导致appConfig中没有配置的变量重置 解决方案 使用异步
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        //请记住 我们只在主AppModule中使用了forRoot() 其他模块都将使用forFeature()
        type: 'postgres', // 使用数据库类型
        host: process.env.DATABASE_HOST, // 主机 本地开发使用localhost
        port: process.env.DATABASE_PORT, // 端口号 在docker-compose.yml中设置的
        username: process.env.DATABASE_USER, // 是访问我们数据库的用户名 这是PostgreSQL数据库的默认设置
        password: process.env.DATABASE_PASSWORD, // 密码 在docker-compose.yml中设置的
        database: process.env.DATABASE_NAME, // 数据库名称
        autoLoadEntities: true, // 自动加载模块 而不是制定实体数组
        synchronize: true, // 同步 确保我们的TypeORM实体在每次运行应用程序时都会与数据库同步 切记 只用于开发 生产中禁用
      }),
    }),
    ConfigModule.forRoot({
      load: [appConfig],
    }), // 从默认位置加载和解析我们的.env文件
    CoffeesModule,
    CoffeeRatingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
