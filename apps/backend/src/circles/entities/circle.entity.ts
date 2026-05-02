import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CircleMember } from './circle-member.entity';

@Entity('circles')
export class Circle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  inviteCode: string;

  @Column()
  creatorId: string;

  @ManyToOne(() => User)
  creator: User;

  @OneToMany(() => CircleMember, (member) => member.circle)
  members: CircleMember[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
