import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Event extends mongoose.Document {
  @Prop()
  type: string;

  @Prop({ index: true })
  name: string;

  @Prop(mongoose.SchemaTypes.Mixed) // 混合类型
  payload: Record<string, any>;
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ name: 1, type: -1 });
// name 1 指定索引升序排列 type -1 指定索引降序排列
