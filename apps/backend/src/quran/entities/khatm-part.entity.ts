import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Khatm } from './khatm.entity';

@Entity('khatm_parts')
export class KhatmPart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  khatmId: string;

  @ManyToOne(() => Khatm, (khatm) => khatm.parts)
  khatm: Khatm;

  @Column()
  juzNumber: number;

  @Column({ nullable: true })
  claimedByUserId: string;

  @ManyToOne(() => User, { nullable: true })
  claimedByUser: User;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  completedAt: Date;
}
