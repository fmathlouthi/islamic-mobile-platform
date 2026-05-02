import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { QuranGoal } from './quran-goal.entity';

@Entity('quran_progress')
export class QuranProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ nullable: true })
  goalId: string;

  @ManyToOne(() => QuranGoal, { nullable: true })
  goal: QuranGoal;

  @Column()
  surahNumber: number;

  @Column()
  ayahStart: number;

  @Column()
  ayahEnd: number;

  @Column('float')
  pagesRead: number;

  @Column()
  date: string; // YYYY-MM-DD

  @CreateDateColumn()
  createdAt: Date;
}
