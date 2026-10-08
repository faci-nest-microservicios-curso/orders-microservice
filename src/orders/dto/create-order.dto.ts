import { OrderStatus } from "@prisma/client"
import { IsEnum, IsNumber, IsOptional, IsPositive } from "class-validator"
import { OrderStatusList } from "../enums/order.enum"

export class CreateOrderDto {

    @IsNumber()
    @IsPositive()
    totalAmount: number

    @IsNumber()
    @IsPositive()
    totalItems: number

    @IsEnum(OrderStatusList, {
        message: `Posibble status values are: ${OrderStatusList}`
    })
    @IsOptional()

    status: OrderStatus = OrderStatus.PENDING

}
