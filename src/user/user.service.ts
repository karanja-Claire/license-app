import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import {
    CreateUserDto,
    LoginDto,
    ResetPasswordDto,
    UpdateUserDto,
    ConfirmEmailDto,
} from './dto/user.dto'

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    async createUser(dto: CreateUserDto): Promise<User> {
        const existing = await this.userModel.findOne({ email: dto.email });
        if (existing) throw new BadRequestException('Email already exists');

        const hash = await bcrypt.hash(dto.password, 10);
        const created = new this.userModel({
            ...dto,
            password: hash,
            isActive: false,
            isEmailConfirmed: false,
        });
        await created.save();
        // Send confirmation email here (stub)
        return created;
    }

    async confirmEmail(dto: ConfirmEmailDto): Promise<User> {
        const user = await this.userModel.findOne({ email: dto.email });
        if (!user) throw new NotFoundException('User not found');
        user.isEmailConfirmed = true;
        user.isActive = true;
        return user.save();
    }

    async login(dto: LoginDto): Promise<{ token: string }> {
        const user: any = await this.userModel.findOne({ email: dto.email });
        if (!user) {
            throw new BadRequestException('Invalid Email');
        }
        if (!(await bcrypt.compare(dto.password, user.password))) {
            throw new BadRequestException('Invalid credentials');

        }
        const payload = { sub: user._id, role: user.role, userType: user.userType };
        const token = await this.jwtService.signAsync(payload);
        return { token };
    }

    async requestPasswordReset(email: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) throw new NotFoundException('User not found');
        // Send reset token email (stub)
        return { message: 'Reset email sent' };
    }

    async resetPassword(dto: ResetPasswordDto) {
        const user = await this.userModel.findOne({ email: dto.email });
        if (!user) throw new NotFoundException('User not found');
        user.password = await bcrypt.hash(dto.password, 10);
        return user.save();
    }

    async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
        return this.userModel.findByIdAndUpdate(id, dto, { new: true });
    }

    async deactivateUser(id: string): Promise<User> {
        return this.userModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    }

    async getUsers(): Promise<User[]> {
        return this.userModel.find().exec()
    }

    async getUserById(id: string): Promise<User> {
        return this.userModel.findById(id).exec()
    }
}

