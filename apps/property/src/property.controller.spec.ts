import { Test, TestingModule } from '@nestjs/testing';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';

describe('PropertyController', () => {
  let propertyController: PropertyController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PropertyController],
      providers: [PropertyService],
    }).compile();

    propertyController = app.get<PropertyController>(PropertyController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(propertyController.getHello()).toBe('Hello World!');
    });
  });
});
