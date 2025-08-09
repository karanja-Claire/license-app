import { ApiProperty, PartialType } from '@nestjs/swagger';

class WorkflowStageDto {
    @ApiProperty() order: number;
    @ApiProperty() role: string;
    @ApiProperty({ required: false }) type?: 'manual' | 'auto';
    @ApiProperty({ required: false }) conditions?: Record<string, any>;
}

export class CreateWorkflowDto {
    @ApiProperty() productId: string;
    @ApiProperty({ type: [WorkflowStageDto] }) stages: WorkflowStageDto[];
}

export class UpdateWorkflowDto extends PartialType(CreateWorkflowDto) { }   // This makes all fields from CreateSubmissionDto optional 
