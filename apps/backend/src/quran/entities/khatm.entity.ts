import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Circle } from '../../circles/entities/circle.entity';
import { KhatmPart } from './khatm-part.entity';

@Entity('khatms')
export class Khatm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  circleId: string;

  @ManyToOne(() => Circle)
  circle: Circle;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isCompleted: boolean;

  @OneToMany(() => KhatmPart, (part) => part.khatm, { cascade: true })
  parts: KhatmPart[];

  @CreateDateColumn()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
