import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AthkarItem } from './athkar-item.entity';

export enum AthkarCategoryEnum {
  MORNING = 'morning',
  EVENING = 'evening',
  SLEEP = 'sleep',
  WAKE_UP = 'wake_up',
  PRAYER = 'prayer',
  QURAN = 'quran',
}

@Entity('athkar_categories')
export class AthkarCategory {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Category key', enum: AthkarCategoryEnum })
  @Column({
    type: 'enum',
    enum: AthkarCategoryEnum,
    unique: true,
  })
  category!: AthkarCategoryEnum;

  @ApiProperty({ description: 'Arabic name' })
  @Column()
  nameAr!: string;

  @ApiProperty({ description: 'English name' })
  @Column()
  nameEn!: string;

  @ApiProperty({ description: 'Icon name' })
  @Column({ nullable: true })
  icon!: string;

  @OneToMany(() => AthkarItem, (item) => item.category)
  items!: AthkarItem[];
}
