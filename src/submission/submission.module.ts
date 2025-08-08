import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission, SubmissionSchema } from './schemas/submission.schema';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';

@Module({
  providers: [SubmissionService],
  controllers: [SubmissionController],
  imports: [
    MongooseModule.forFeature([{ name: Submission.name, schema: SubmissionSchema }])
  ],

})
export class SubmissionModule { }
