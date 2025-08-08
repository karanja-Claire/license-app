import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, FieldSchema } from './field.schema';

@Schema()
export class Section {
    @Prop({ required: true })
    sectionName: string;

    @Prop({ type: [FieldSchema], required: true })
    fields: Field[];
}

export const SectionSchema = SchemaFactory.createForClass(Section);