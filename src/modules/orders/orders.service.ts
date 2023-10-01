import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Repository } from 'sequelize-typescript';
import { BinaryNode } from './node.class';
// import { Op } from 'sequelize';
import { Socket } from 'socket.io';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly binaryNodeService: BinaryNode,
    //queue is for multi threading it saves the job temperarily and then execute it on seperate thread one by one
    @InjectQueue('redis-data') private redisDataQueue: Queue,
  ) {}
  public socket: Socket = null;

  async create(createOrderDto: CreateOrderDto): Promise<Order | string> {
    const exist = await this.createBinaryTree(createOrderDto);

    if (exist) {
      const res = await this.orderRepository.destroy({
        where: {
          id: exist.id,
        },
      });
      this.createBinaryTree(createOrderDto);
      //send an event on socket
      this.socket.emit('event', { message: 'transection successfull' });
      //update redis data by adding a job to queue, a seperate thread will run and update data in redis
      await this.redisDataQueue.add('transection', {
        lastOrder: createOrderDto,
      });
      if (res) return 'transection successfull';
    } else {
      const res = await this.orderRepository.create(createOrderDto);
      //update redis data by adding a job to queue, a seperate thread will run and update data in redis
      await this.redisDataQueue.add('order', { lastOrder: res });
      return res;
    }
  }

  async createBinaryTree(order): Promise<Order> {
    const res = await this.orderRepository.findAll();
    const root = this.binaryNodeService.insert(res, 0);
    this.binaryNodeService.inOrder(root);
    const include = this.binaryNodeService.includes(root, order);
    return include;
  }
}
