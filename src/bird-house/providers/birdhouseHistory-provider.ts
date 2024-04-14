import { DataSource } from 'typeorm';
import { BirdhouseHistory } from '../entities/birdhousehistory-entity';

export const birdhouseHistoryRepository = [
  {
    provide: 'BirdhouseHistoryRepository',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(BirdhouseHistory),
    inject: ['DATA_SOURCE'],
  },
];
