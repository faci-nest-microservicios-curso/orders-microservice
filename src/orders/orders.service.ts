import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma.service';
import { PrismaClient } from '@prisma/client/extension';

@Injectable()
export class OrdersService extends PrismaClient {

    private readonly logger = new Logger('OrdersLogger')

    constructor(private readonly prisma: PrismaService) {
        super()
    }

    create(createOrderDto: CreateOrderDto) {
        return 'create'
    }

    findOne(id: number) {
        return 'create'
    }

    findAll() {
        return 'create'
    }
}