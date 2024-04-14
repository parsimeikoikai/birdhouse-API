import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { Birdhouse } from './bird-house/entities/birdhouse-entity';
import { birdhouseProvider } from './bird-house/providers/birdhouse-provider';
import { BirdHouseService } from './bird-house/bird-house.service';
import { BirdHouseController } from './bird-house/bird-house.controller';
import { BirdhouseHistory } from './bird-house/entities/birdhousehistory-entity';
import { birdhouseHistoryRepository } from './bird-house/providers/birdhouseHistory-provider';
import { BirdhouseMiddleware } from './bird-house/middleware/birdhouse.middleware';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.HOST,
        port: 3306,
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        entities: [Birdhouse, BirdhouseHistory],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot()],
  controllers: [BirdHouseController],
  providers: [
    AppService,
    BirdHouseService,
    ...birdhouseProvider,
    ...birdhouseHistoryRepository,
    ...databaseProviders,
  ],
  exports: [...databaseProviders],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BirdhouseMiddleware).forRoutes('*');
  }
}
