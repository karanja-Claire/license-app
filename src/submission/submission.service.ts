
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Submission, SubmissionDocument } from './schemas/submission.schema';
import { Model, Types } from 'mongoose';
import { CreateSubmissionDto, ReviewSubmissionDto, UpdateSubmissionDto } from './dto/create-submission.dto';
import { WorkflowService } from '../workflow/workflow.service';
import { DocumentsService } from 'src/documents/documents.service';

@Injectable()
export class SubmissionService {
    constructor(
        @InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>, private workflowService: WorkflowService, private readonly documentsService: DocumentsService
    ) { }

    // async create(data: any): Promise<Submission> {
    //     const created = new this.submissionModel(data);
    //     return created.save();
    // }

    async create(dto: CreateSubmissionDto) {
        const workflow = await this.workflowService.findByProduct(dto.productId);
        if (!workflow) throw new NotFoundException('Workflow not defined for product');

        // initialize stage progress using workflow stages
        const progress = workflow.stages
            .sort((a, b) => a.order - b.order)
            .map(s => ({
                order: s.order,
                role: s.role,
                status: s.order === workflow.stages[0].order ? 'in_progress' : 'pending',
                assignedTo: null,
                meta: {},
            }));

        // first stage assignment: typically HOD — you might implement assignment by dept later
        const submission = new this.submissionModel({
            productId: new Types.ObjectId(dto.productId),
            userId: new Types.ObjectId(dto.userId),
            applicationStageOrder: workflow.stages[0].order,
            status: 'in_progress',
            workflowProgress: progress,
            responses: dto.responses || {},
        });

        await submission.save();

        // optionally notify HOD / assigned users here

        // auto-progress if first stage is auto type
        await this.maybeAutoAdvance(submission._id.toString());

        return submission;
    }

    async delete(id: string): Promise<Submission> {
        return this.submissionModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true },   ///will return the updated document
        );
    }

    async findAll(): Promise<Submission[]> {
        return this.submissionModel.find({ isDeleted: false });
    }

    async findOne(id: string): Promise<Submission> {
        return this.submissionModel.findOne({ _id: id, isDeleted: false });
    }

    async update(id: string, updateSubmissionDto: UpdateSubmissionDto) {
        return this.submissionModel.findByIdAndUpdate(
            id,
            updateSubmissionDto,
            { new: true }, // return updated document
        );
    }
    async findById(id: string) {
        return this.submissionModel.findById(id).exec();
    }

    async getPendingForRole(role: string) {
        return this.submissionModel.find({
            'workflowProgress': { $elemMatch: { role, status: 'in_progress' } },
            status: 'in_progress'
        }).exec();
    }

    // Called when a stage is approved or rejected
    async applyAction(submissionId: string, actorId: string, action: 'approve' | 'reject' | 'assign', payload?: { assignedTo?: string, meta?: any }) {
        const sub = await this.findById(submissionId);
        if (!sub) throw new NotFoundException('Submission not found');

        // find current stage progress entry
        const current = sub.workflowProgress.find(p => p.order === sub.applicationStageOrder);
        if (!current) throw new NotFoundException('Current stage not found');

        if (action === 'assign') {
            // set assignedTo
            if (!payload?.assignedTo) throw new Error('assignedTo required');
            current.assignedTo = new Types.ObjectId(payload.assignedTo);
            await sub.save();
            return sub;
        }

        if (action === 'reject') {
            current.status = 'rejected';
            sub.status = 'rejected';
            await sub.save();
            // TODO: store rejection reason from payload.meta
            return sub;
        }

        if (action === 'approve') {
            current.status = 'approved';
            // move to next stage or complete
            const wf = await this.workflowService.findByProduct(sub.productId.toString());
            const stages = wf.stages.sort((a, b) => a.order - b.order);
            const idx = stages.findIndex(s => s.order === sub.applicationStageOrder);

            if (idx === -1) throw new NotFoundException('Workflow stage not found');

            if (idx === stages.length - 1) {
                // last stage -> complete approval
                sub.status = 'approved';
                sub.applicationStageOrder = stages[stages.length - 1].order;
                await sub.save();
                return sub;
            }

            // advance to next stage
            const next = stages[idx + 1];
            sub.applicationStageOrder = next.order;
            // mark next stage in_progress
            const nextProgress = sub.workflowProgress.find(p => p.order === next.order);
            if (nextProgress) nextProgress.status = 'in_progress';

            await sub.save();

            // maybe auto advance multiple stages (auto-type stages)
            await this.maybeAutoAdvance(sub._id.toString());
            return sub;
        }
    }



    // auto-advance when a stage type = 'auto' and conditions satisfied
    private async maybeAutoAdvance(submissionId: string) {
        const sub = await this.findById(submissionId);
        if (!sub) return;
        const wf = await this.workflowService.findByProduct(sub.productId.toString());
        if (!wf) return;

        let moved = true;
        // repeat while current stage is auto and conditions satisfied and not last
        while (moved) {
            moved = false;
            const stages = wf.stages.sort((a, b) => a.order - b.order);
            const currentIndex = stages.findIndex(s => s.order === sub.applicationStageOrder);
            if (currentIndex === -1) break;
            const currentStage = stages[currentIndex];

            if (currentStage.type === 'auto') {
                // evaluate conditions - simple example: autoAdvance:true
                const cond = currentStage.conditions || {};
                const autoOk = cond.autoAdvance === true;

                if (autoOk) {
                    if (currentIndex === stages.length - 1) {
                        sub.status = 'approved';
                        sub.workflowProgress.find(p => p.order === sub.applicationStageOrder).status = 'approved';
                        await sub.save();
                        return;
                    } else {
                        // mark current approved and move to next
                        sub.workflowProgress.find(p => p.order === sub.applicationStageOrder).status = 'approved';
                        const nextStage = stages[currentIndex + 1];
                        sub.applicationStageOrder = nextStage.order;
                        sub.workflowProgress.find(p => p.order === nextStage.order).status = 'in_progress';
                        await sub.save();
                        moved = true;
                        // continue loop in case next is also auto
                    }
                }
            }
        }
    }


    async reviewSubmission(
        id: number,
        reviewDto: ReviewSubmissionDto,
        reviewerId: number
    ) {
        const submission = await this.submissionModel.findById(id);
        if (!submission) throw new NotFoundException('Submission not found');

        submission.status = reviewDto.status;
        submission.reviewerId = reviewerId;
        submission.reviewNotes = reviewDto.reviewNotes || null;


        // after the last approver
        await this.documentsService.generateDocument(id, reviewDto.status);


        return await submission.save();
    }
}
