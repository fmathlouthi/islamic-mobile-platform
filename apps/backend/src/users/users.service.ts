import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto, LoginDto, UpdateUserDto } from './dto/user.dto';
import { Language, Theme, CalculationMethod, Madhab, Dialect, AuthProvider, Gender } from '@tariq/shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOrCreateSocial(data: {
    email: string;
    name?: string;
    provider: AuthProvider;
    providerId: string;
  }): Promise<User> {
    let user = await this.usersRepository.findOne({
      where: [
        { provider: data.provider, providerId: data.providerId },
        { email: data.email },
      ],
    });

    if (user) {
      // Update provider info if not already set (e.g. user was created with email/password)
      if (!user.providerId) {
        user.provider = data.provider;
        user.providerId = data.providerId;
        await this.usersRepository.save(user);
      }
      return user;
    }

    user = this.usersRepository.create({
      email: data.email,
      name: data.name,
      provider: data.provider,
      providerId: data.providerId,
      language: Language.ARABIC,
      theme: Theme.SYSTEM,
      calculationMethod: CalculationMethod.MUSLIM_WORLD_LEAGUE,
      notificationsEnabled: true,
      prayerTimeNotifications: true,
      athkarReminders: true,
      islamicEventsNotifications: true,
      madhab: Madhab.MALIKI,
      dialect: Dialect.TUNISIAN,
      gender: Gender.UNSPECIFIED,
    });

    return this.usersRepository.save(user);
  }

  async create(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.usersRepository.create({
      email: registerDto.email,
      password: registerDto.password,
      name: registerDto.name,
      language: Language.ARABIC,
      theme: Theme.SYSTEM,
      calculationMethod: CalculationMethod.MUSLIM_WORLD_LEAGUE,
      notificationsEnabled: true,
      prayerTimeNotifications: true,
      athkarReminders: true,
      islamicEventsNotifications: true,
      madhab: Madhab.MALIKI,
      dialect: Dialect.TUNISIAN,
      gender: Gender.UNSPECIFIED,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: Partial<User> = {};

    if (updateUserDto.name !== undefined) updateData.name = updateUserDto.name;
    if (updateUserDto.language !== undefined) updateData.language = updateUserDto.language as Language;
    if (updateUserDto.theme !== undefined) updateData.theme = updateUserDto.theme as Theme;
    if (updateUserDto.calculationMethod !== undefined) {
      updateData.calculationMethod = updateUserDto.calculationMethod as CalculationMethod;
    }
    if (updateUserDto.notificationsEnabled !== undefined) {
      updateData.notificationsEnabled = updateUserDto.notificationsEnabled;
    }
    if (updateUserDto.prayerTimeNotifications !== undefined) {
      updateData.prayerTimeNotifications = updateUserDto.prayerTimeNotifications;
    }
    if (updateUserDto.athkarReminders !== undefined) {
      updateData.athkarReminders = updateUserDto.athkarReminders;
    }
    if (updateUserDto.islamicEventsNotifications !== undefined) {
      updateData.islamicEventsNotifications = updateUserDto.islamicEventsNotifications;
    }
    if (updateUserDto.fcmToken !== undefined) {
      updateData.fcmToken = updateUserDto.fcmToken;
    }
    if (updateUserDto.madhab !== undefined) {
      updateData.madhab = updateUserDto.madhab as Madhab;
    }
    if (updateUserDto.dialect !== undefined) {
      updateData.dialect = updateUserDto.dialect as Dialect;
    }
    if (updateUserDto.gender !== undefined) {
      updateData.gender = updateUserDto.gender as Gender;
    }
    if (updateUserDto.latitude !== undefined) updateData.latitude = updateUserDto.latitude;
    if (updateUserDto.longitude !== undefined) updateData.longitude = updateUserDto.longitude;

    await this.usersRepository.update(id, updateData);

    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
