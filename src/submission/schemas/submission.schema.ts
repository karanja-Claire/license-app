import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubmissionDocument = Submission & Document;

@Schema({ timestamps: true })
export class StageProgress {
    @Prop({ required: true })
    order: number;

    @Prop()
    role: string;

    @Prop({ default: 'pending' }) // pending | in_progress | approved | rejected | ammended
    status: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: false })
    assignedTo?: Types.ObjectId;

    @Prop({ type: Object, default: {} })
    meta?: Record<string, any>;
}
export const StageProgressSchema = SchemaFactory.createForClass(StageProgress);

@Schema({ timestamps: true })
export class Submission {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: string; // e.g., user ID 

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

    @Prop({ default: 1 })     // 1 draft 2 Submitted  3 Under Review 4  Completed
    applicationStageOrder: number;

    @Prop({ default: 'in_progress' })
    status: string; // in_progress | approved | rejected | pended

    @Prop({ type: [StageProgressSchema], default: [] })
    workflowProgress: StageProgress[];

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop()
    reviewerId: number;

    @Prop()
    reviewNotes: string;


}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);




