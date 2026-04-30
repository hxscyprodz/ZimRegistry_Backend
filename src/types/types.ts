import mongoose from "mongoose"

export enum ERole {
    user = "USER",
    admin = "ADMIN"
};

export interface IUser {
    fullName: string;
    address: string;
    username: string;
    password: string;
    role: ERole;
    refreshToken: string;
};

export interface IRefreshToken {
    userId: mongoose.Types.ObjectId;
    refreshToken: string;
};

export interface ITokenPayload {
    username: string;
    role: ERole;
};
