import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { TRANSPORTS_SERVICE, PRODUCT_SERVICE } from '../config/services';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('OrdersLogger');


    constructor(
        @Inject(TRANSPORTS_SERVICE) private readonly client: ClientProxy,
    ) {
        super()
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Orders database connected');
    }

    async create(createOrderDto: CreateOrderDto) {
        try {

            const ids = createOrderDto.items.map(e => e.productId)


            const products = await firstValueFrom(
                this.client.send({ cmd: 'validate_products' }, ids),
            );

            console.log({ products })

            let totalAmount = 0

            for (const product of products) {
                const quantity = createOrderDto.items.find(e => e.productId === product.id)?.quantity
                const newAmount = (product.price as number) * (quantity as number)

                totalAmount += newAmount
            }

            const order = await this.order.create({
                data: {
                    OrderItem: {
                        createMany: {
                            data: createOrderDto.items.map(orderItem => {
                                const price = products.find((product: any) => orderItem.productId == product.id).price
                                return {
                                    price,
                                    productId: orderItem.productId,
                                    quantity: orderItem.quantity,
                                }
                            })
                        }
                    }
                },
                include: {
                    OrderItem: {
                        select: {
                            price: true,
                            quantity: true,
                            productId: true,
                        }
                    }
                }
            })

            const { OrderItem, ...orderData } = order;

            return {
                ...orderData,
                totalAmount,
                orderItem: OrderItem.map((item) => {
                    const product = products.find(
                        (product: any) => product.id === item.productId,
                    );

                    return {
                        ...item,
                        name: product?.name,
                    };
                }),
            }

        } catch (error) {
            throw new RpcException({
                status: HttpStatus.BAD_REQUEST,
                message: 'unexpexted_error'
            })
        }

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
            include: {
                OrderItem: {
                    select: {
                        price: true,
                        quantity: true,
                        productId: true,
                    },
                },
            },
        });

        if (!order) {
            throw new RpcException({
                message: `Order with id ${id} not found`,
                status: HttpStatus.NOT_FOUND,
            });
        }

        const products = await firstValueFrom(
            this.client.send(
                { cmd: 'validate_products' },
                order.OrderItem.map((item) => item.productId),
            ),
        );

        const { OrderItem, ...orderData } = order;

        return {
            ...orderData,
            orderItem: OrderItem.map((item) => {
                const product = products.find(
                    (product: any) => product.id === item.productId,
                );

                return {
                    ...item,
                    name: product?.name,
                };
            }),
        };
    }

    async changeOrderStatus({ id, status }: ChangeOrderStatusDto) {
        await this.findOne(id);

        return this.order.update({
            where: { id },
            data: { status },
        });
    }
}
