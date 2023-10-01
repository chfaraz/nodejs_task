import { Processor, Process, OnQueueActive } from '@nestjs/bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from '../entities/order.entity';
import { Repository } from 'sequelize-typescript';
import { Sequelize } from 'sequelize';
//this is used for multi threading
@Processor('redis-data')
export class RedisDataConsumer {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  //it runs when ever there is a price mach between buyer and seller
  @Process({ name: 'transection' })
  async transection(job: Job<unknown>) {
    //i am not sure which price to sum, so i am just doing the buy in db
    const priceSum = await this.orderRepository.findAll({
      attributes: [
        'price',
        'side',
        [
          Sequelize.fn(
            'sum',
            Sequelize.cast(Sequelize.col('price'), 'integer'),
          ),
          'totalAmount',
        ],
      ],
      group: ['price', 'side'],
      having: { side: 'BUY' },
    });

    const noOfOrders = await this.orderRepository.count();

    await await this.cacheManager.set('lastOrder', job.data['lastOrder']);
    await this.cacheManager.set('priceSum', priceSum['totalAmount']);
    //also adding transection total
    const totalPurchase = await this.cacheManager.get('totalPurchase');
    await this.cacheManager.set(
      'totalPurchase',
      totalPurchase
        ? totalPurchase + +job.data['lastOrder']['price']
        : 0 + +job.data['lastOrder']['price'],
    );
    await this.cacheManager.set('noOfOrders', noOfOrders);
  }

  //it runs every order save
  @Process('order')
  async order(job: Job<unknown>) {
    await await this.cacheManager.set('lastOrder', job.data['lastOrder']);
    if (job.data['lastOrder'].side === 'BUY') {
      await this.cacheManager.set(
        'priceSum',
        +(await this.cacheManager.get('priceSum')) +
          +job.data['lastOrder'].price,
      );
    }
    await this.cacheManager.set(
      'noOfOrders',
      +(await this.cacheManager.get('noOfOrders')) + 1,
    );
  }
}
