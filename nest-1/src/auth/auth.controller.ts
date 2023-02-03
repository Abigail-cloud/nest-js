/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post } from '@nestjs/common';
import { Body, Req, Res } from '@nestjs/common/decorators';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto)
  }
  @Post('signin')
  signin(@Body() dto:AuthDto,@Req() req, @Res() res) {
    return this.authService.signin(dto, req, res)
  }
  @Get('signout')
  signout(@Req() req, @Res() res) {
    return this.authService.signout(req, res)
  }
}
