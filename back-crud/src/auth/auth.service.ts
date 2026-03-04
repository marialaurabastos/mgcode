import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser( email: string, pass: string ): Promise<{ id: number; name: string; email: string }> {
        const user = await this.usersService.findOneByEmail(email);
        

        if (!user || !user.password) {
            throw new UnauthorizedException('E-mail ou senha incorretos');
        }

        const passwordIsValid = await bcrypt.compare(pass, user.password);

        if (!passwordIsValid) {
            throw new UnauthorizedException('E-mail ou senha incorretos');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email
        };

    }
    async login(user: { id: number; name: string; email: string }) {
        const payload = {
            email: user.email,
            sub: user.id
        };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
