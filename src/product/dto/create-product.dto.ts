import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    billable: boolean;

    @ApiProperty()
    applicationSerialization: string;

    @ApiProperty()
    licenseSerialization: string;

    @ApiProperty()
    timeDuration: string;

    @ApiProperty()
    sections: [
        {
            sectionName: string;
            fields: [
                {
                    name: string;
                    type: string;
                    required: boolean;
                    options: []

                }
            ];

        }
    ];








}

export class UpdateProductDto extends PartialType(CreateProductDto) { }   // This makes all fields from CreateSubmissionDto optional 
