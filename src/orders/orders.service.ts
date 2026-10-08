import { CreateOrderDto } from "./dto/create-order.dto"

export class OrdersService {
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