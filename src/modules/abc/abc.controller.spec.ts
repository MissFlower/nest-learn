import { Test, TestingModule } from '@nestjs/testing';
import { AbcController } from './abc.controller';

describe('AbcController', () => {
  let controller: AbcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AbcController],
    }).compile();

    controller = module.get<AbcController>(AbcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
