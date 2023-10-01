import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { BinaryNode } from './node.class';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { RedisDataConsumer } from './processors/redis-data.processor';

@Module({
  imports: [
    SequelizeModule.forFeature([Order]),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      },
    }),
    BullModule.registerQueue({
      name: 'redis-data',
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,

      // Store-specific configuration:
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      // port: 6379,
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, BinaryNode, RedisDataConsumer],
  exports: [OrdersService],
})
export class OrdersModule {}
