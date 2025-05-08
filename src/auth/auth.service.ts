import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compareSync } from 'bcrypt';
import { AuthResponse } from './auth.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private jwtTimeExpiration: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtTimeExpiration = +(
      this.configService.get<number>('JWT_EXPIRATION') ?? 3600
    );
  }
  async login(username: string, password: string): Promise<AuthResponse> {
    const user = await this.usersService.findByUsername(username);
    if (!user || !compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);
    return {
      token,
      expiresIn: this.jwtTimeExpiration,
    };
  }
}
