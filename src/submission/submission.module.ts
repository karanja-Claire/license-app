import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from './schemas/submission.schema';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { WorkflowService } from 'src/workflow/workflow.service';
import { WorkflowModule } from 'src/workflow/workflow.module';
import { DocumentsService } from 'src/documents/documents.service';

@Module({
  providers: [SubmissionService],
  controllers: [SubmissionController],
  imports: [
    MongooseModule.forFeature([{ name: Submission.name, schema: SubmissionSchema }]), WorkflowModule, DocumentsService
  ],

})
export class SubmissionModule { }
