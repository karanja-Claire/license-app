import { ApiProperty } from '@nestjs/swagger';

export class ActionStageDto {
    @ApiProperty() submissionId: string;
    @ApiProperty({ enum: ['approve', 'reject', 'assign'] }) action: 'approve' | 'reject' | 'assign';
    @ApiProperty({ required: false }) assignedTo?: string; // for assign
    @ApiProperty({ required: false, type: Object }) meta?: Record<string, any>;
}
