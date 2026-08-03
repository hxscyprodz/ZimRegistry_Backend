import { Request } from "express";
import { roles } from "../db/schemas";

export type TRoles = (typeof roles.enumValues)[number];

export type TBirthApplication = "BC" | "ID";
export interface ITokenPayload {
    userId: string,
    role: TRoles,
}
export interface AuthRequest extends Request {
    user?: ITokenPayload;
}