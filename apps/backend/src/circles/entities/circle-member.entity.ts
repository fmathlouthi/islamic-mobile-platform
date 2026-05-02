import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Circle } from './circle.entity';

@Entity('circle_members')
@Unique(['circleId', 'userId'])
export class CircleMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  circleId: string;

  @ManyToOne(() => Circle, (circle) => circle.members)
  circle: Circle;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  joinedAt: Date;
}
