import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateWorkflowDto, UpdateWorkflowDto } from './dto/create-workflow.dto';
import { WorkflowService } from './workflow.service';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/user/user.controller';
import { Roles } from 'src/auth/roles.decorator';
@ApiTags('workflow')
@Controller('workflow')
export class WorkflowController {
    constructor(private readonly workflowService: WorkflowService) { }

    @Post()
    @ApiBearerAuth('access-token')
    create(@Body() dto: CreateWorkflowDto) {
        return this.workflowService.create(dto);
    }

    @Get(':productId')
    @ApiBearerAuth('access-token')
    getByProduct(@Param('productId') productId: string) {
        return this.workflowService.getStages(productId);
    }

    @Get(':id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('staff')

    findOne(@Param('id') id: string) {
        return this.workflowService.findOne(id);
    }


    @Patch(':id')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('staff')

    @ApiBody({ type: UpdateWorkflowDto })

    async update(
        @Param('id') id: string,
        @Body() UpdateWorkflowDto: UpdateWorkflowDto,
    ) {
        return this.workflowService.update(id, UpdateWorkflowDto);
    }

}
