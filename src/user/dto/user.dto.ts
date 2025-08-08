import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    userType: string

    @ApiProperty()
    staffRole: string

}

export class UpdateUserDto extends PartialType(CreateUserDto) { }


export class LoginDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

}

export class ResetPasswordDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

}

export class ConfirmEmailDto {
    @ApiProperty()
    email: string;

}
