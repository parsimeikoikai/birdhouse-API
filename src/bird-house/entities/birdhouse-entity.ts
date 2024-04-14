import { AfterInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BirdhouseHistory } from './birdhousehistory-entity';

@Entity('birdhouse')
export class Birdhouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  ubid: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ default: 0 })
  birds: number;

  @Column({ default: 0 })
  eggs: number;

  @Column('double')
  longitude: number;

  @Column('double')
  latitude: number;

  @OneToMany(() => BirdhouseHistory, history => history.birdhouse)
  history: BirdhouseHistory[];

  @AfterInsert()
  updateUbid() {
    this.ubid = this.id;
  }
}
