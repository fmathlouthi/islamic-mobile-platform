import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { Language, Theme, CalculationMethod, Madhab, Dialect, AuthProvider, Gender } from '@tariq/shared';

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @Column({ unique: true })
  email!: string;

  @ApiProperty({ description: 'Hashed password' })
  @Column({ nullable: true })
  password!: string;

  @ApiProperty({ description: 'Auth provider' })
  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  provider!: AuthProvider;

  @ApiProperty({ description: 'Auth provider ID' })
  @Column({ nullable: true })
  providerId!: string;

  @ApiProperty({ description: 'User display name', required: false })
  @Column({ nullable: true })
  name!: string;

  @ApiProperty({ description: 'Language preference' })
  @Column({
    type: 'enum',
    enum: Language,
    default: Language.ARABIC,
  })
  language!: Language;

  @ApiProperty({ description: 'Theme preference' })
  @Column({
    type: 'enum',
    enum: Theme,
    default: Theme.SYSTEM,
  })
  theme!: Theme;

  @ApiProperty({ description: 'Prayer time calculation method' })
  @Column({
    type: 'enum',
    enum: CalculationMethod,
    default: CalculationMethod.MUSLIM_WORLD_LEAGUE,
  })
  calculationMethod!: CalculationMethod;

  @ApiProperty({ description: 'Enable notifications' })
  @Column({ default: true })
  notificationsEnabled!: boolean;

  @ApiProperty({ description: 'Enable prayer time notifications' })
  @Column({ default: true })
  prayerTimeNotifications!: boolean;

  @ApiProperty({ description: 'Enable athkar reminders' })
  @Column({ default: true })
  athkarReminders!: boolean;

  @ApiProperty({ description: 'Enable Islamic events notifications' })
  @Column({ default: true })
  islamicEventsNotifications!: boolean;

  @ApiProperty({ description: 'Firebase Cloud Messaging token' })
  @Column({ nullable: true })
  fcmToken!: string;

  @ApiProperty({ description: 'Madhab preference' })
  @Column({
    type: 'enum',
    enum: Madhab,
    default: Madhab.MALIKI,
  })
  madhab!: Madhab;

  @ApiProperty({ description: 'Dialect preference' })
  @Column({
    type: 'enum',
    enum: Dialect,
    default: Dialect.TUNISIAN,
  })
  dialect!: Dialect;

  @ApiProperty({ description: 'Gender' })
  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.UNSPECIFIED,
  })
  gender!: Gender;

  @ApiProperty({ description: 'User latitude' })
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 7 })
  latitude!: number;

  @ApiProperty({ description: 'User longitude' })
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 7 })
  longitude!: number;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    if (!this.password) {
      return false;
    }
    return bcrypt.compare(plainPassword, this.password);
  }
}
