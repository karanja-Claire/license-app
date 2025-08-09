import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { SubmissionModule } from './submission/submission.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { JwtAuthGuard } from './user/user.controller';
import { WorkflowModule } from './workflow/workflow.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/license-app'), // or your Mongo URI
    ProductModule, SubmissionModule, UserModule, AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // <-- this makes ConfigService available everywhere
    }),
    WorkflowModule,
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService,

  ],
})
export class AppModule { }


