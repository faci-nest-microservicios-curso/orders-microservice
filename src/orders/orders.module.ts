import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from '../config/services';
import { envs } from '../config';
import { TransportsModule } from '../transports/transports.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
   TransportsModule,
  ]
})
export class OrdersModule { }
