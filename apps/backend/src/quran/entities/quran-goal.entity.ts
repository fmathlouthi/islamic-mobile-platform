import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { QuranGoalType, QuranGoalFrequency } from '@tariq/shared';

@Entity('quran_goals')
export class QuranGoal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'enum',
    enum: QuranGoalType,
  })
  type: QuranGoalType;

  @Column({
    type: 'enum',
    enum: QuranGoalFrequency,
  })
  frequency: QuranGoalFrequency;

  @Column()
  targetAmount: number;

  @Column()
  targetUnit: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
