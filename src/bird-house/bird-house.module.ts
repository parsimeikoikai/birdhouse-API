import { Module } from '@nestjs/common';
import { BirdHouseService } from './bird-house.service';
import { BirdHouseController } from './bird-house.controller';

@Module({
  providers: [BirdHouseService],
  controllers: [BirdHouseController]
})
export class BirdHouseModule {}
