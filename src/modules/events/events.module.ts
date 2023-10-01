import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { OrdersModule } from '../orders/orders.module';

@Module({ imports: [OrdersModule], providers: [EventsGateway] })
export class EventsModule {}
