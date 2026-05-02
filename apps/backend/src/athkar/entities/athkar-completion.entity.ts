import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AthkarCategory } from '@tariq/shared';

@Entity('athkar_completion')
export class AthkarCompletion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  athkarId: string;

  @Column({
    type: 'enum',
    enum: AthkarCategory,
  })
  category: AthkarCategory;

  @Column()
  count: number;

  @Column()
  date: string; // YYYY-MM-DD

  @CreateDateColumn()
  completedAt: Date;
}
