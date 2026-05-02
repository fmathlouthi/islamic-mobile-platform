import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/auth.dto';

export interface JwtPayload {
  sub: string;
  email: string;
}

import { Language, Theme, CalculationMethod, Madhab, Dialect, AuthProvider } from '@tariq/shared';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async socialLogin(user: any) {
    const dbUser = await this.usersService.findOrCreateSocial({
      email: user.email,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
      provider: user.provider as AuthProvider,
      providerId: user.providerId,
    });

    const payload: JwtPayload = { sub: dbUser.id, email: dbUser.email };

    return {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        provider: dbUser.provider,
        language: dbUser.language,
        theme: dbUser.theme,
        calculationMethod: dbUser.calculationMethod,
        notificationsEnabled: dbUser.notificationsEnabled,
        prayerTimeNotifications: dbUser.prayerTimeNotifications,
        athkarReminders: dbUser.athkarReminders,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
      },
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
      expiresIn: 604800,
    };
  }

  async validateUser(email: string, password: string) {
    return this.usersService.validateUser(email, password);
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload: JwtPayload = { sub: user.id, email: user.email };

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        language: user.language,
        theme: user.theme,
        calculationMethod: user.calculationMethod,
        notificationsEnabled: user.notificationsEnabled,
        prayerTimeNotifications: user.prayerTimeNotifications,
        athkarReminders: user.athkarReminders,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
      expiresIn: 604800, // 7 days in seconds
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      const newPayload: JwtPayload = { sub: user.id, email: user.email };

      return {
        accessToken: this.jwtService.sign(newPayload),
        refreshToken: this.jwtService.sign(newPayload, { expiresIn: '30d' }),
        expiresIn: 604800,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async register(registerDto: { email: string; password: string; name?: string }) {
    const user = await this.usersService.create(registerDto);
    const payload: JwtPayload = { sub: user.id, email: user.email };

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
      expiresIn: 604800,
    };
  }
}
