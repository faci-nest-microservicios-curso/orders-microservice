import { OrderStatus } from "@prisma/client"
import { IsEnum, IsNumber, IsPositive } from "class-validator"
import { OrderStatusList } from "../enums/order.enum"

export class ChangeOrderStatusDto {

    @IsNumber()
    @IsPositive()
    id: number

    @IsEnum(OrderStatusList, {
        message: `Posibble status values are: ${OrderStatusList}`
    })
    status: OrderStatus
}
