import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Field {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    type: string;

    @Prop({ required: true })
    required: boolean;

    @Prop({
        type: [{
            label: String,
            value: String
        }],
        default: []
    })
    options?: { label: string; value: string }[];
}

export const FieldSchema = SchemaFactory.createForClass(Field);