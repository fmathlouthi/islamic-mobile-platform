import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionPlan, SubscriptionStatus } from '@tariq/shared';
import { User } from '../../users/entities/user.entity';

@Entity('subscriptions')
export class Subscription {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;

  @ApiProperty({ description: 'Subscription plan', enum: SubscriptionPlan })
  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
    default: SubscriptionPlan.FREE,
  })
  plan!: SubscriptionPlan;

  @ApiProperty({ description: 'Subscription status', enum: SubscriptionStatus })
  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status!: SubscriptionStatus;

  @ApiProperty({ description: 'Stripe customer ID' })
  @Column({ nullable: true })
  stripeCustomerId!: string;

  @ApiProperty({ description: 'Stripe subscription ID' })
  @Column({ nullable: true })
  stripeSubscriptionId!: string;

  @ApiProperty({ description: 'Current period end date' })
  @Column({ type: 'timestamp', nullable: true })
  currentPeriodEnd!: Date;

  @ApiProperty({ description: 'Cancel at period end' })
  @Column({ default: false })
  cancelAtPeriodEnd!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
