import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WorkflowDocument = Workflow & Document;

@Schema()
export class WorkflowStage {
    @Prop({ required: true })             // position/order, 1-based
    order: number;

    @Prop({ required: true })             // role responsible for this stage
    role: string;

    @Prop({ default: 'manual' })          // 'manual' | 'auto' (auto = auto-advance)
    type: string;

    @Prop({ type: Object, default: {} })  // any rules/conditions
    conditions: Record<string, any>;

}

export const WorkflowStageSchema = SchemaFactory.createForClass(WorkflowStage);

@Schema({ timestamps: true })
export class Workflow {
    @Prop({ type: Types.ObjectId, required: true, ref: 'Product' })
    productId: Types.ObjectId;

    @Prop({ type: [WorkflowStageSchema], required: true })
    stages: WorkflowStage[];
}

export const WorkflowSchema = SchemaFactory.createForClass(Workflow);
