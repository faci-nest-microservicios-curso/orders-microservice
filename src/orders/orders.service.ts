import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { PRODUCT_SERVICE } from '../config/services';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('OrdersLogger');


    constructor(
        @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
    ) {
        super()
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Orders database connected');
    }

    async create(createOrderDto: CreateOrderDto) {
        const ids = createOrderDto.items.map((item) => item.productId);

        return firstValueFrom(
            this.productsClient.send({ cmd: 'validate_products' }, ids),
        );
    }

    async findAll(orderPaginationDto: OrderPaginationDto) {
        const { status, page = 1, limit = 10 } = orderPaginationDto;

        const total = await this.order.count({
            where: { status },
        });

        return {
            data: await this.order.findMany({
                where: { status },
                skip: (page - 1) * limit,
                take: limit,
            }),
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const order = await this.order.findFirst({
            where: { id },
        });

        if (!order) {
            throw new RpcException({
                message: `Order with id ${id} not found`,
                status: HttpStatus.NOT_FOUND,
            });
        }

        return order;
    }

    async changeOrderStatus({ id, status }: ChangeOrderStatusDto) {
        await this.findOne(id);

        return this.order.update({
            where: { id },
            data: { status },
        });
    }
}
