import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { HawlCycleStatus } from '@tariq/shared';

@Entity('hawl_cycles')
export class HawlCycle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column({
    type: 'enum',
    enum: HawlCycleStatus,
    default: HawlCycleStatus.ACTIVE,
  })
  status: HawlCycleStatus;

  @Column('decimal', { precision: 20, scale: 2 })
  initialWealth: number;

  @Column('decimal', { precision: 20, scale: 2 })
  currentWealth: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
