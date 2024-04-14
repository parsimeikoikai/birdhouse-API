import { DataSource } from 'typeorm';
import { Birdhouse } from '../entities/birdhouse-entity';

export const birdhouseProvider = [
  {
    provide: 'BirdhouseRepository',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Birdhouse),
    inject: ['DATA_SOURCE'],
  },
];
