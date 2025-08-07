

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<ProductDocument>,
    ) { }

    async create(createProductDto: CreateProductDto) {
        const product = new this.productModel(createProductDto);
        return product.save();
    }

    async findAll() {
        return this.productModel.find().exec();
    }

    async findById(id: string) {
        return this.productModel.findById(id).exec();
    }
}
