import { OrderStatus } from "@prisma/client"
import { ArrayMinSize, IsArray, IsEnum, IsNumber, IsOptional, IsPositive, ValidateNested } from "class-validator"
import { OrderStatusList } from "../enums/order.enum"
import { OrderItemDto } from "./order-item.dto"
import { Type } from "class-transformer"

export class CreateOrderDto {

   @IsArray()
   @ArrayMinSize(1)
   @ValidateNested({each:true})
   @Type(() => OrderItemDto)
   items: OrderItemDto[]

}
