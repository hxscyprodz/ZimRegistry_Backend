import { Request } from "express";

export type TRoles = "super-admin" | "admin" | "user";

export type TBirthApplication = "BC" | "ID";
export interface ITokenPayload {
    userId: string,
    role: TRoles,
}
export interface AuthRequest extends Request {
    user?: ITokenPayload;
}