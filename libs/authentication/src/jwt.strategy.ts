import {Injectable, Logger} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {ConfigService} from "@nestjs/config";
import e from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    private readonly logger = new Logger(JwtStrategy.name);
    constructor(private readonly config:ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            _audience: config.getOrThrow("AWS_AUTH_CLIENT_ID"),
            issuer: config.getOrThrow("AWS_AUTH_AUTHORITY"),
            algorithms: ['RS256'],
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: config.getOrThrow("AWS_AUTH_AUTHORITY") + '/.well-known/jwks.json',
            }),
        });
        this.logger.verbose("JWTStrategy inited");
    }

    async validate(payload: any) {
        this.logger.verbose("validating...",payload);
        return { idUser: payload.sub, email: payload.email };
    }
}
