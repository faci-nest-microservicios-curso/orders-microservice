import { OrderStatus } from "@prisma/client"
import { IsEnum, IsNumber, IsPositive } from "class-validator"
import { OrderStatusList } from "../enums/order.enum"

export class ChangeOrderStatusDto {

    @IsNumber()
    @IsPositive()
    id: string

    @IsEnum(OrderStatusList, {
        message: `Posibble status values are: ${OrderStatusList}`
    })
    status: OrderStatus
}
