import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ZakatAssetType } from '@tariq/shared';

@Entity('zakat_assets')
export class ZakatAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @Column({
    type: 'enum',
    enum: ZakatAssetType,
  })
  type: ZakatAssetType;

  @Column()
  name: string;

  @Column('decimal', { precision: 20, scale: 2 })
  value: number;

  @Column()
  currency: string;

  @Column('decimal', { precision: 20, scale: 2, nullable: true })
  weightInGrams: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
