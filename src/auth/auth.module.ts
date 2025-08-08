import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        PassportModule,
        ConfigModule.forRoot(),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'your_jwt_secret',
            signOptions: { expiresIn: '1d' },
        }),
        forwardRef(() => UserModule),
    ],
    providers: [JwtStrategy],
    exports: [JwtModule],
})
export class AuthModule { }
