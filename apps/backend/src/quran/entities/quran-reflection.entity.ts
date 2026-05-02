import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { QuranProgress } from './quran-progress.entity';

@Entity('quran_reflections')
export class QuranReflection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  progressId: string;

  @OneToOne(() => QuranProgress)
  @JoinColumn()
  progress: QuranProgress;

  @Column('text')
  content: string;

  @Column('text')
  verseContext: string;

  @CreateDateColumn()
  createdAt: Date;
}
