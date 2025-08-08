import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Section, SectionSchema } from './section.schema';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })

export class Product {
    @Prop({ required: true, unique: true })
    name: string; // e.g., "Permit License"

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, default: false })
    billable: boolean;

    @Prop({ required: true })
    applicationSerialization: string;

    @Prop({ required: true })
    licenseSerialization: string;

    @Prop({ required: true })
    timeDuration: string;

    // @Prop({
    //     type: [
    //         {
    //             title: { type: String, required: true },
    //             fields: [
    //                 {
    //                     name: { type: String, required: true },
    //                     type: { type: String, required: true },
    //                     required: { type: Boolean, required: true },
    //                     options: { type: [String], required: false }, // for dropdowns
    //                 },
    //             ],
    //         },
    //     ],
    //     required: true,
    // })
    // sections: {
    //     title: string;
    //     fields: {
    //         name: string;
    //         type: string;
    //         required: boolean;
    //         options?: any[];
    //     }[];
    // }[];
    @Prop({ type: [SectionSchema], required: true })
    sections: Section[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);



