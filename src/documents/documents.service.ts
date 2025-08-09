import { Injectable } from '@nestjs/common';
import { Template, TemplateDocument } from './schema/documents.schema';
import { Model } from 'mongoose';
import { SubmissionService } from 'src/submission/submission.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DocumentsService {

    constructor(
        @InjectModel(Template.name) private templateModel: Model<TemplateDocument>, private submissionService: SubmissionService
    ) { }

    async generateDocument(applicationId: any, decision: string) {
        const appData = await this.submissionService.findById(applicationId);

        // Get productId from application
        const productId = appData.productId;

        // Fetch correct template for this product and decision
        const templateHtml = await this.getTemplateForProduct(productId, decision);

        // Replace placeholders with actual data
        let filledHtml = templateHtml;
        Object.keys(appData).forEach(key => {
            filledHtml = filledHtml.replace(new RegExp(`{{${key}}}`, 'g'), appData[key]);
        });

        // Convert to PDF
        //   return this.convertHtmlToPdf(filledHtml, `output-${applicationId}.pdf`);
    }

    private async getTemplateForProduct(productId: any, decision: string) {
        // From DB
        const template: any = await this.templateModel.findOne({
            where: { productId, decisionType: decision }
        });
        return template.templateHtml;
    }
}
