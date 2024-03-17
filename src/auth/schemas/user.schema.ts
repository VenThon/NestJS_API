import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
    timestamps: true
})

export class User extends Document {
    @Prop()
    name: string

    @Prop({unique: [true, 'Duplicate email entred']})
    email: string

    @Prop()
    password: string
}

export const UserShema =SchemaFactory.createForClass(User);