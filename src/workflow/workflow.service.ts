import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Workflow, WorkflowDocument } from './schema/workflow.schema';
import { CreateWorkflowDto, UpdateWorkflowDto } from './dto/create-workflow.dto';

@Injectable()
export class WorkflowService {
    constructor(
        @InjectModel(Workflow.name) private workflowModel: Model<WorkflowDocument>,
    ) { }

    async create(dto: CreateWorkflowDto) {
        // validate unique orders and that HOD is present can be done here
        const workflow = new this.workflowModel({ ...dto, productId: new Types.ObjectId(dto.productId) });
        return workflow.save();
    }

    async findByProduct(productId: string) {
        return this.workflowModel.findOne({
            productId: new Types.ObjectId(productId)
        }).exec();
    }
    async findOne(id: string) {
        return this.workflowModel.findById(id).exec()
    }

    async getStages(productId: string) {
        const workflow = await this.findByProduct(productId);
        if (!workflow) throw new NotFoundException('Workflow not found');
        // return sorted by order
        return workflow.stages.sort((a, b) => a.order - b.order);
    }

    async update(id: string, UpdateWorkflowDto: UpdateWorkflowDto) {
        var data = {
            ...UpdateWorkflowDto,
            productId: new Types.ObjectId(UpdateWorkflowDto.productId)
        }
        return this.workflowModel.findByIdAndUpdate(
            id,
            data,
            { new: true }, // return updated document
        );
    }
}
