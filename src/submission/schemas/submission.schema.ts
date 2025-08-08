import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubmissionDocument = Submission & Document;

@Schema({ timestamps: true })
export class Submission {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productId: Types.ObjectId;

    @Prop({ required: true })
    userId: string; // e.g., user ID or name

    // @Prop({
    //     type: [
    //         {
    //             sectionName: String,
    //             fields: [
    //                 {
    //                     name: String,
    //                     value: String,
    //                 },
    //             ],
    //         },
    //     ],
    //     required: true,
    // })
    // responses: {
    //     sectionName: string;
    //     fields: { name: string; value: string }[];
    // }[];

    @Prop({
        type: [
            {
                sectionName: String,
                fields: [
                    {
                        fieldId: { type: Types.ObjectId, required: true },
                        value: String,
                    },
                ],
            },
        ],
        required: true,
    })
    responses: {
        sectionName: string;
        fields: { fieldId: Types.ObjectId; value: string }[];
    }[];

    @Prop({ default: false })
    isDeleted: boolean;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
