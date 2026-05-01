import mongoose from "mongoose";
import { Request } from "express";

export enum ERole {
    user = "USER",
    admin = "ADMIN"
};

export interface IUser {
    fullName: string;
    address: string;
    email: string;
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
;

export interface IUserTokenRequest extends Request {
    user?: ITokenPayload;
};


