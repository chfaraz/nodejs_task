/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { BinaryNode } from './node.class';
import { Queue } from 'bull';
import { CreateOrderDto } from './dto/create-order.dto';
import { Side } from '../../config/enum/side.enum';
import { OrdersModule } from './orders.module';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeModule } from '@nestjs/sequelize';
import { BullModule } from '@nestjs/bull';

describe('OrdersService', () => {
  let service: OrdersService;
  const orders = [
    { id: 1, price: '10', side: 'BUY' },
    { id: 1, price: '50', side: 'SELL' },
    { id: 1, price: '3', side: 'BUY' },
    { id: 1, price: '33', side: 'SELL' },
  ];

  beforeEach(async () => {
    const fakeQueue: Partial<Queue> = {
      add: (name: string, data: any) => Promise.resolve({ data } as any),
    };
    const fakeOrder: Partial<any> = {
      destroy: (obj: any) => Promise.resolve(),
      create: (createOrderDto: CreateOrderDto) =>
        Promise.resolve({ ...createOrderDto, id: 1 } as Order),
      findAll: () => Promise.resolve(orders),
    };
    //not using mock for binary tree because it dont have any side effect
    // const fakeBinaryNode: Partial<BinaryNode> = {};
    const module: TestingModule = await Test.createTestingModule({
      //i failed to resolve issues in providers of unit tests, i am new to unit tests :(
      providers: [
        OrdersService,
        { provide: Order, useValue: fakeOrder },
        BinaryNode,
        { provide: fakeQueue as any, useValue: fakeQueue },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('transection successfull', async () => {
    const res = await service.create({
      side: Side.SELL,
      price: '10',
    });
    expect(res).toBe('transection successfull');
  });

  it('order create', async () => {
    const res = await service.create({
      side: Side.SELL,
      price: '101',
    });
    expect(res).toBe({ id: 1, side: 'SELL', price: '101' });
  });
});
