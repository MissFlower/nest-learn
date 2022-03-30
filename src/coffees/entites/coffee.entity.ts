import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Coffee extends Document {
  @Prop()
  name: string;

  @Prop()
  brand: string;

  @Prop({ default: 0 })
  recommendations: number;

  @Prop([String])
  flavors: string[]; // 口味
}

// 还可以使用@nestjs/mangoose中的DefinitionsFactoryClass生成原始模式定义
export const CoffeeSchema = SchemaFactory.createForClass(Coffee);
