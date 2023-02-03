/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { Injectable } from '@nestjs/common';
import { ForbiddenException, NotFoundException } from '@nestjs/common/exceptions';
import { Request } from 'express';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
constructor (private prisma: PrismaService){}


    async getUser (id: string, req: Request) {
        const user = await this.prisma.user.findUnique({
            where: {id}
        })
        if(!user){
            throw new NotFoundException()
        }

       const decodedUser=  req.user as {id: string, email: string}

       if(user.id !== decodedUser.id){
        throw new ForbiddenException()
       }
       
       delete user.hashedPassword

        return {user};
    }




    async getAllUsers () {
        return await this.prisma.user.findMany({
            select: {
                id: true, email: true
            }
        });
    }
}
