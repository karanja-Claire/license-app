
import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/user/user.controller';

@ApiTags('Products')
@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @ApiBearerAuth('access-token')  // swagger documentation
    @UseGuards(JwtAuthGuard, RolesGuard) // RBAC
    @Roles('staff') // Only allow users with userType 'staff'
    create(@Body() dto: CreateProductDto) {
        return this.productService.create(dto);
    }

    @Get()
    @ApiBearerAuth('access-token')  // swagger documentation
    @UseGuards(JwtAuthGuard, RolesGuard) // RBAC
    @Roles('staff') // Only allow users with userType 'staff'
    findAll() {
        return this.productService.findAll();
    }

    @Get(':id')
    @ApiBearerAuth('access-token')  // swagger documentation
    @UseGuards(JwtAuthGuard, RolesGuard) // RBAC
    @Roles('staff') // Only allow users with userType 'staff'
    findById(@Param('id') id: string) {
        return this.productService.findById(id);
    }
}