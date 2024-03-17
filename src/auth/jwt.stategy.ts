import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";
import { Strategy, ExtractJwt } from "passport-jwt"; // Corrected import

@Injectable()
export class JwtStategy extends PassportStrategy(Strategy) {
    constructor( 
        @InjectModel(User.name)
        private userModel: Model<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Corrected typo in ExtractJwt
            secretOrKey: process.env.JWT_SECRET // Corrected typo in secretOrKey
        });
    }

    async validate(payload) {
        const { id } = payload;
        const user = await this.userModel.findById(id);

        if (!user) {
            throw new UnauthorizedException('Login first to access this endpoint.');
        }
        return user;
    }
}
