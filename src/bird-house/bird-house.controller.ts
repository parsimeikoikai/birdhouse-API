import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BirdHouseService } from './bird-house.service';
import { CreateBirdHouseDto } from './dto/createBirdHouse.dto';
import { Birdhouse } from './entities/birdhouse-entity';
import { UpdateBirdhouseDto } from './dto/UpdateBirdhouseDto';
import { BirdhouseResponseInterface } from './interfaces';

@Controller()
export class BirdHouseController {
  constructor(private readonly birdHouseService: BirdHouseService) {}
  @Get()
  public async index(): Promise<string> {
    return 'Welcome to BirdHouse API';
  }

  @Post()
  public async create(@Body() body: CreateBirdHouseDto): Promise<Birdhouse> {
    return await this.birdHouseService.create(body);
  }

  @Patch(':id')
  public async update(@Param('id') id: string, @Body() body: UpdateBirdhouseDto) {
    const updatedBirdhouse = await this.birdHouseService.update(id, body);
    const { id: _, ...response } = updatedBirdhouse;
    return response;
  }

  @Post(':id/occupancy')
  public async updateOccupancy(
    @Param('id') id: string,
    @Body() body: UpdateBirdhouseDto,
  ) {
    return this.birdHouseService.updateResidency(id, body);
  }

  @Get(':id')
  public async find(@Param('id') id: string): Promise<BirdhouseResponseInterface> {
    const updatedBirdhouse = await this.birdHouseService.find(id);
    const { id: _, ...response } = updatedBirdhouse;
    return response;
  }
}
