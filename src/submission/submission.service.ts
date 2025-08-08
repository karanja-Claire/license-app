
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Submission, SubmissionDocument } from './schemas/submission.schema';
import { Model } from 'mongoose';
import { UpdateSubmissionDto } from './dto/create-submission.dto';

@Injectable()
export class SubmissionService {
    constructor(
        @InjectModel(Submission.name) private submissionModel: Model<SubmissionDocument>,
    ) { }

    async create(data: any): Promise<Submission> {
        const created = new this.submissionModel(data);
        return created.save();
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
}
