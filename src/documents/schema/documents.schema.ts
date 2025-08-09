import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TemplateDocument = Template & Document;

@Schema({ timestamps: true })
export class Template {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productId: Types.ObjectId;

    @Prop()
    templateData: string;

    @Prop()
    decisionType: string;

    @Prop({ type: Object, default: {} })
    meta?: Record<string, any>;
}
export const TemplateSchema = SchemaFactory.createForClass(Template);