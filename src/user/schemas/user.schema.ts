// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type UserDocument = User & Document;


export enum UserType {
    APPLICANT = 'applicant',
    STAFF = 'staff',
}



@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ enum: UserType, required: true })
    userType: UserType;

    @Prop()
    staffRole?: string;

    @Prop({ default: false })
    isEmailConfirmed: boolean;

    @Prop({ default: true })
    isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);