import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('sadaqah')
export class Sadaqah {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column('decimal', { precision: 20, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column()
  category: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  date: string;

  @Column({ default: false })
  isZakat: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
