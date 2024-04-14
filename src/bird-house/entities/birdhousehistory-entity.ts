import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Birdhouse } from './birdhouse-entity';

@Entity('birdhouse_history')
export class BirdhouseHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: Date;

  @Column()
  birds: number;

  @Column()
  eggs: number;

  @UpdateDateColumn({ type: 'timestamp' }) 
  updatedAt: Date;

  @ManyToOne(() => Birdhouse, birdhouse => birdhouse.history)
  birdhouse: Birdhouse; 
}
