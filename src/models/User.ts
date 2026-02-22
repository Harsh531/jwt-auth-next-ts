import mongoose, { Schema, Document, Model } from "mongoose";
import { required } from "zod/mini";

export interface IUser extends Document {
    email: string;
    password: string;
    role: "user" | "admin";
    refreshTokens: {
        token: string;
        createdAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    refreshTokens : [
        {
            token : {
                type : String,
                required : true
            },
            createdAt : {
                type : Date,
                default : Date.now
            }
        }
    ]
}, {
    timestamps: true
})

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;