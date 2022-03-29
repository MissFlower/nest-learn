import { CreateCoffeeDto } from './../../src/coffees/dto/create-coffee.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesModule } from './../../src/coffees/coffees.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

describe('[Feature] Coffees - / coffees', () => {
  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    // createNestApplication方法用于实例化完整的Nest运行时环境 可以将其视为我们在main.ts文件中拥有的应用程序的一个实例
    // 这意味着在模块本身之外添加的任何配置（基本上我们在main.ts文件中完成的任何事情）都必须添加在这里 除非他不需要这个特定的e2e测试
    app = moduleFixture.createNestApplication();
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
    await app.init();
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/coffees/create')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        const expectedCoffee = jasmine.objectContaining({
          ...coffee,
          flavors: jasmine.arrayContaining(
            coffee.flavors.map((name) => jasmine.objectContaining({ name })),
          ),
        });
        expect(body).toEqual(expectedCoffee);
      });
  });
  it.todo('Get all [GET /]');
  it.todo('Get one [GET /:id]');
  it.todo('Update one [PATCH /:id]');
  it.todo('Delete one [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});
