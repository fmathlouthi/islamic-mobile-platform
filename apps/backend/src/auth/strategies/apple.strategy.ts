import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('APPLE_CLIENT_ID'),
      teamID: configService.get<string>('APPLE_TEAM_ID'),
      keyID: configService.get<string>('APPLE_KEY_ID'),
      keyFilePath: configService.get<string>('APPLE_KEY_FILE_PATH'),
      callbackURL: configService.get<string>('APPLE_CALLBACK_URL'),
      passReqToCallback: false,
      scope: ['email', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err: any, user: any) => void,
  ): Promise<any> {
    const { id, email, name } = profile;
    const user = {
      email,
      firstName: name?.firstName,
      lastName: name?.lastName,
      provider: 'apple',
      providerId: id,
    };
    done(null, user);
  }
}
