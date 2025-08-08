
import { Controller, Post, Body, Get, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateSubmissionDto, UpdateSubmissionDto } from './dto/create-submission.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/user/user.controller';

@ApiTags('Submissions')
@Controller('submissions')
export class SubmissionController {
    constructor(private readonly submissionService: SubmissionService) { }

    @Post()
    @ApiBody({ type: CreateSubmissionDto })
    @ApiBearerAuth('access-token')  // swagger documentation
    @UseGuards(JwtAuthGuard, RolesGuard) // RBAC
    @Roles('applicant') // Only allow users with userType 'applicant'
    create(@Body() body: CreateSubmissionDto) {
        return this.submissionService.create(body);
    }

    @Get()
    @ApiBearerAuth('access-token')  // swagger documentation
    @UseGuards(JwtAuthGuard) // any role can access this
    findAll() {
        return this.submissionService.findAll();
    }

    @Get(':id')
    @ApiBearerAuth('access-token')  // swagger documentation
    @UseGuards(JwtAuthGuard) // any role can access this
    findOne(@Param('id') id: string) {
        return this.submissionService.findOne(id);
    }
    @Patch(':id')
    @ApiBearerAuth('access-token')  // swagger documentation
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('applicant') // Only allow users with userType 'applicant'

    @ApiBody({ type: UpdateSubmissionDto })

    async update(
        @Param('id') id: string,
        @Body() updateSubmissionDto: UpdateSubmissionDto,
    ) {
        return this.submissionService.update(id, updateSubmissionDto);
    }


    @Delete(':id')
    @ApiBearerAuth('access-token')  // swagger documentation
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('applicant') // Only allow users with userType 'applicant'
    softDelete(@Param('id') id: string) {
        return this.submissionService.delete(id);
    }
}
