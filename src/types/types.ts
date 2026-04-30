import mongoose from "mongoose"

export enum ERole {
    user = "USER",
    admin = "ADMIN"
};

export interface IUser {
    fullName: string;
    address: string;
    contactNumber: string;
    password: string;
    role: ERole;
};

export interface IRefreshToken {
    userId: mongoose.Types.ObjectId;
    refreshToken: string;
};

export interface ITokenPayload {
    contactNumber: string;
    role: ERole;
};
