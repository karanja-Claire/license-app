import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseFieldDto {
    @ApiProperty()
    fieldId: string;

    @ApiProperty()
    value: string;
}

export class ResponseSectionDto {
    @ApiProperty()
    sectionName: string;

    @ApiProperty({ type: [ResponseFieldDto] })
    fields: ResponseFieldDto[];
}

export class CreateSubmissionDto {
    @ApiProperty()
    productId: string;
    @ApiProperty()
    userId: string;
    @ApiProperty({ type: [ResponseSectionDto] })
    responses: ResponseSectionDto[];

}




export class UpdateSubmissionDto extends PartialType(CreateSubmissionDto) { }   // This makes all fields from CreateSubmissionDto optional 
