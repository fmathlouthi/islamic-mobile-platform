import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Madhab, Dialect, Gender } from '@tariq/shared';

export class RegisterDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password (min 8 characters)', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'User display name', required: false, example: 'Ahmed' })
  @IsString()
  @IsOptional()
  name?: string;
}

export class LoginDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'User display name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Language preference', required: false })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ description: 'Theme preference', required: false })
  @IsString()
  @IsOptional()
  theme?: string;

  @ApiProperty({ description: 'Calculation method', required: false })
  @IsString()
  @IsOptional()
  calculationMethod?: string;

  @ApiProperty({ description: 'Notifications enabled', required: false })
  @IsOptional()
  notificationsEnabled?: boolean;

  @ApiProperty({ description: 'Prayer time notifications', required: false })
  @IsOptional()
  prayerTimeNotifications?: boolean;

  @ApiProperty({ description: 'Athkar reminders', required: false })
  @IsOptional()
  athkarReminders?: boolean;

  @ApiProperty({ description: 'Islamic events notifications', required: false })
  @IsOptional()
  islamicEventsNotifications?: boolean;

  @ApiProperty({ description: 'Firebase Cloud Messaging token', required: false })
  @IsString()
  @IsOptional()
  fcmToken?: string;

  @ApiProperty({ description: 'Madhab preference', required: false, enum: Madhab })
  @IsEnum(Madhab)
  @IsOptional()
  madhab?: Madhab;

  @ApiProperty({ description: 'Dialect preference', required: false, enum: Dialect })
  @IsEnum(Dialect)
  @IsOptional()
  dialect?: Dialect;

  @ApiProperty({ description: 'Gender', required: false, enum: Gender })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({ description: 'User latitude', required: false })
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: 'User longitude', required: false })
  @IsOptional()
  longitude?: number;
}
