import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IslamicEventType } from '@tariq/shared';

@Entity('islamic_events')
export class IslamicEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nameAr!: string;

  @Column()
  nameEn!: string;

  @Column()
  hijriDay!: number;

  @Column()
  hijriMonth!: number;

  @Column({
    type: 'varchar',
    default: IslamicEventType.OBSERVANCE,
  })
  type!: IslamicEventType;
}
