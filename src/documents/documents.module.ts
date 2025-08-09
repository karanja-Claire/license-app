import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Template, TemplateSchema } from './schema/documents.schema';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  imports: [
    MongooseModule.forFeature([{ name: Template.name, schema: TemplateSchema }])
  ],

})
export class DocumentsModule { }
