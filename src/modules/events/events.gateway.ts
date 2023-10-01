import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { OrdersService } from '../orders/orders.service';

@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class EventsGateway implements OnGatewayInit {
  constructor(private readonly orderService: OrdersService) {}

  @WebSocketServer() server: Socket;

  handleConnection(socket: Socket) {
    console.log('connected-----');
    socket.on('disconnect', () => {
      console.log('disconnected-----');
    });
  }

  afterInit(server: Socket) {
    Logger.log('Socket.io initialized');
    this.orderService.socket = server;
  }
}
