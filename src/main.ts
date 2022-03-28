import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 添加全局校验
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 白名单有效过滤掉DTO之外的属性 直接被删除 不会抛错
      transform: true, // 传入的DTO本身不是类的实例 通过转换可以变成该实例
      forbidNonWhitelisted: true, // 如果存在DTO之外的属性 不是直接过滤掉 而是抛错 配合白名单使用
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('Nest App')
    .setDescription('this is a about Coffee application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // api: 挂在swagger的路由路径 app:应用实例 document: 实例化后的文档
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
