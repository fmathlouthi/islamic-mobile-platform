import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AthkarCategory } from './athkar-category.entity';

@Entity('athkar_items')
export class AthkarItem {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Parent category' })
  @ManyToOne(() => AthkarCategory, (category) => category.items)
  @JoinColumn({ name: 'category_id' })
  category!: AthkarCategory;

  @Column({ name: 'category_id' })
  categoryId!: string;

  @ApiProperty({ description: 'The athkar text in Arabic' })
  @Column({ type: 'text' })
  text!: string;

  @ApiProperty({ description: 'Transliteration', required: false })
  @Column({ type: 'text', nullable: true })
  transliteration!: string;

  @ApiProperty({ description: 'English translation', required: false })
  @Column({ type: 'text', nullable: true })
  translation!: string;

  @ApiProperty({ description: 'Number of times to repeat' })
  @Column({ default: 1 })
  count!: number;

  @ApiProperty({ description: 'Source reference', required: false })
  @Column({ nullable: true })
  source!: string;

  @ApiProperty({ description: 'Display order' })
  @Column({ default: 0 })
  order!: number;
}
