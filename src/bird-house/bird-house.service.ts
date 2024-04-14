import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { LessThanOrEqual, Repository, UpdateResult } from 'typeorm';
import { Birdhouse } from './entities/birdhouse-entity';
import { CreateBirdHouseDto } from './dto/createBirdHouse.dto';
import { UpdateBirdhouseDto } from './dto/UpdateBirdhouseDto';
import { BirdhouseHistory } from './entities/birdhousehistory-entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BirdHouseService {
  constructor(
    @InjectRepository(Birdhouse)
    private readonly birdhouseRepository: Repository<Birdhouse>,
    @InjectRepository(BirdhouseHistory)
    private readonly birdhouseHistoryRepository: Repository<BirdhouseHistory>,
  ) {}
  private readonly logger = new Logger(BirdHouseService.name);

  public async create(body: CreateBirdHouseDto): Promise<Birdhouse> {
    this.logger.log(`Create new BirdHouse`);
    const birdhouse = this.birdhouseRepository.create(body);
    return this.birdhouseRepository.save(birdhouse);
  }

  public async update(id: string, body: UpdateBirdhouseDto): Promise<any> {
    this.logger.log(`Update BirdHouse`);
    await this.birdhouseRepository.update(id, body);
    return this.find(id);
  }

  public async updateOccupancy(
    id: string,
    body: UpdateBirdhouseDto,
  ): Promise<UpdateResult> {
    this.logger.log(`Update BirdHouse Occupancy ${id}`);
    return this.birdhouseRepository.update(id, body);
  }

  public async find(id: string): Promise<Birdhouse> {
    this.logger.log(`Finding BirdHouse ${id}...`);
    return this.birdhouseRepository.findOne({
      where: { id: id },
    });
  }
  public async updateResidency(id: string, body: UpdateBirdhouseDto) {
    await this.updateOccupancy(id, body);
    const updatedBirdhouse = await this.find(id);
    await this.createHistory(id, body);
    const { id: _, ...response } = updatedBirdhouse;
    return response;
  }

  public async createHistory(
    id: string,
    body: UpdateBirdhouseDto,
  ): Promise<void> {
    const birdhouse = await this.birdhouseRepository.findOne({
      where: { id: id },
    });
    if (!birdhouse) {
      throw new NotFoundException('Birdhouse not found');
    }

    let historyEntry = await this.birdhouseHistoryRepository.findOne({
      where: { birdhouse: birdhouse },
    });

    if (!historyEntry) {
      historyEntry = new BirdhouseHistory();
      historyEntry.birdhouse = birdhouse;
    }

    historyEntry.timestamp = new Date();
    historyEntry.birds = body.birds;
    historyEntry.eggs = body.eggs;
    this.logger.log(`Create BirdHouse History`);
    await this.birdhouseHistoryRepository.save(historyEntry);
  }
  public async isAuthorized(ubid: string): Promise<boolean> {
    const birdhouse = await this.find(ubid);
    return !!birdhouse;
  }

  @Cron(CronExpression.EVERY_DAY_AT_10PM)
  public async pruneInactiveBirdhouses(): Promise<void> {
    const inactiveThreshold = new Date();

    inactiveThreshold.setFullYear(inactiveThreshold.getFullYear() - 1);

    const inactiveBirdhouses = await this.birdhouseHistoryRepository.find({
      relations: ['birdhouse'],
      where: {
        updatedAt: LessThanOrEqual(inactiveThreshold),
      },
    });

    for (const birdhouseHistory of inactiveBirdhouses) {
      try {
        this.logger.log(`Deleting BirdHouse History ${birdhouseHistory.id}...`);

        await this.birdhouseHistoryRepository.delete(birdhouseHistory.id);

        if (birdhouseHistory.birdhouse) {
          const birdhouse = birdhouseHistory.birdhouse;

          this.logger.log(`Deleting BirdHouse ${birdhouse.id}...`);

          await this.birdhouseRepository.delete(birdhouse.id);
        }
      } catch (error) {
        this.logger.error(
          `Error pruning inactive birdhouses: ${error.message}`,
        );
      }
    }
  }
}
