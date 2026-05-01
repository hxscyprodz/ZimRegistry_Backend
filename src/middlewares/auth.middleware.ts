import { Response, NextFunction } from "express";
import tokenUTILS from "../utils/auth/tokens";
import { StatusCodes } from "http-status-codes";
import { TokenExpiredError } from "jsonwebtoken";
import { ITokenPayload, IUserTokenRequest } from "../types/types";

const authenticationMiddleware = async(req: IUserTokenRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Access denied. Token not provided"});
    };

    //extract token from the header
    const token = authHeader.split(" ")[1];
    
    try{
        const decoded = await tokenUTILS.verifyAccessToken(token || "") as ITokenPayload;

        if(!decoded) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid or expired token"})
        };

        req.user = decoded;
        next();

    } catch(error: any) {
        if(error instanceof TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false, 
                message: "Token has expired. Login again.",
                expired: true
            });
        };

        return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Failed to verify token. Please try again later."});
    };

};

export default authenticationMiddleware;