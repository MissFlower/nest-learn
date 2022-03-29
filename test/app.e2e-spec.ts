import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  // beforEach 改为 beforAll 因为我们通常不想为每一个e2e测试重新创建应用程序
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(); // 该方法实例化一个实际的nest运行时环境

    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .set('Authorization', process.env.API_KEY)
      .expect(200)
      .expect({
        data: 'Hello Nest!',
      });
  });

  // 解决 This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.
  // 这通常意味着在测试中有一些异步操作没有停止。考虑运行带有'——detectOpenHandles '的Jest来解决此问题。
  afterAll(async () => {
    await app.close();
  });
});
