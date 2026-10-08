import { IsEnum, IsOptional } from "class-validator"
import { OrderStatus } from "@prisma/client"
import { PaginationDto } from "../../common/dto"
import { OrderStatusList } from "../enums/order.enum"

export class OrderPaginationDto extends PaginationDto {

    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `Posibble status values are: ${OrderStatusList}`
    })
    status?: OrderStatus
}
