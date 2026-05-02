import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PrayerName } from '@tariq/shared';

@Entity('prayer_completions')
@Index(['userId', 'date', 'prayerName'], { unique: true })
export class PrayerCompletion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User)
  user!: User;

  @Column({
    type: 'enum',
    enum: PrayerName,
  })
  prayerName!: PrayerName;

  @Column({ type: 'date' })
  date!: string; // YYYY-MM-DD

  @CreateDateColumn()
  completedAt!: Date;
}
