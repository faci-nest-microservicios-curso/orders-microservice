import { OrderStatus } from "@prisma/client"
import { IsEnum, IsUUID } from "class-validator"
import { OrderStatusList } from "../enums/order.enum"

export class ChangeOrderStatusDto {

    @IsUUID()
    id: string

    @IsEnum(OrderStatusList, {
        message: `Posibble status values are: ${OrderStatusList}`
    })
    status: OrderStatus
}
