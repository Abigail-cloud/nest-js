/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { BadRequestException, ForbiddenException } from '@nestjs/common/exceptions';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import {JwtService}from '@nestjs/jwt';
import {jwtSecret} from '../utils/constant'
import { Request, Response } from 'express';
@Injectable()
export class AuthService {
    constructor (private prisma: PrismaService, private jwt : JwtService) {}

    async signup (dto: AuthDto) {
        const {email, password} = dto;

        const userExist= await this.prisma.user.findUnique({
            where: {email},
        });
        if(userExist) {
            throw new BadRequestException('Email already exist')
        } 

        const hashedPassword = await this.hashPassword(password)
        await this.prisma.user.create({
            data: {
                email,
                hashedPassword
            }
        })
        return {message: 'Signup was sucessful' }
    }

    async signin (dto: AuthDto, req: Request, res: Response) {
        const {email, password} = dto;
        const userExist = await this.prisma.user.findUnique({
            where: {email}
        });
        if (!userExist){
            throw new BadRequestException('Wrong credentials')
        }
        const isMatch= await this.comparePassword({
            password, 
            hash: userExist.hashedPassword
            })
            if(!isMatch){
                throw new BadRequestException('Wrong Credentials')
            } 
      const token = await this.signToken({
        id: userExist.id, 
        email: userExist.email
    })
    if(!token){
        throw new ForbiddenException()
    }
    res.cookie('token', token)
        return res.send({message: 'Logged in sucessful'})
    }


    async signout (req: Request, res: Response) {
        res.clearCookie('token')
        return res.send({message: 'user logged out sucessfully'})
    }




    //Helper Functions
    async hashPassword(password: string) {
        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds)

        return hashedPassword
    }

async comparePassword(args: {password: string, hash: string}) {
return await bcrypt.compare(args.password, args.hash)
}

async signToken(args: {id:string, email:string}){
    const payload = args;

   return  this.jwt.signAsync(payload,  {secret:jwtSecret})
}

}
