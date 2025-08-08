
import {
    Body,
    Controller,
    Get,
    Injectable,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto, ResetPasswordDto, UpdateUserDto, ConfirmEmailDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
@ApiTags('Users')

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Post('confirm-email')
    async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
        return this.userService.confirmEmail(confirmEmailDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.userService.login(loginDto);
    }

    @Post('reset-password')
    async requestPasswordReset(@Body() resetDto: ResetPasswordDto) {
        return this.userService.requestPasswordReset(resetDto.email);
    }

    // @Post('reset-password/confirm')
    // async confirmPasswordReset(
    //     @Body() confirmDto: ConfirmResetPasswordDto,
    // ) {
    //     return this.userService.confirmPasswordReset(
    //         confirmDto.token,
    //         confirmDto.newPassword,
    //     );
    // }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updateUser(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
        return this.userService.updateUser(id, updateDto);
    }

    @Patch(':id/deactivate')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('staff') // Only allow users with userType 'staff'
    async deactivate(@Param('id') id: string) {
        return this.userService.deactivateUser(id);
    }

    //   @Get()
    //   @UseGuards(JwtAuthGuard)
    //   async getAllUsers(@Query('role') role?: string) {
    //     return this.userService.getUsers(role);
    //   }
    @Get()
    @ApiBearerAuth('access-token')  // swagger documentation
    @UseGuards(JwtAuthGuard, RolesGuard) // RBAC
    @Roles('staff') // Only allow users with userType 'staff'

    async getAllUsers() {
        return this.userService.getUsers();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getUserById(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }
}
