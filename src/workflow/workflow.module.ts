import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Workflow, WorkflowSchema } from './schema/workflow.schema';

@Module({
  providers: [WorkflowService],
  controllers: [WorkflowController],
  imports: [
    MongooseModule.forFeature([{ name: Workflow.name, schema: WorkflowSchema }])
  ],
  exports: [WorkflowService],

})
export class WorkflowModule { }
