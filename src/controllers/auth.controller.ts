import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import tokenUTILS from "../utils/auth/tokens";
import RefreshToken from "../models/tokens.model";
import { ITokenPayload } from "../types/types";

const refresh = async(req: Request, res: Response) => {
    const refreshToken = req.body?.refreshToken;

    if(!refreshToken) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Refresh token required"});
    };

    try{
        const isRevoked = await RefreshToken.findOne({refreshToken});
    
        if(!isRevoked) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid refresh token"});
        };

        const decoded = await tokenUTILS.verifyRefreshToken(refreshToken) as ITokenPayload;
        
        const newAccessToken = await tokenUTILS.generateAccessToken({
            contactNumber: decoded?.contactNumber,
            role: decoded?.role
        });

        return res.status(StatusCodes.CREATED).json({ success: true, token: newAccessToken});

    } catch(error: any) {
        return res.status(StatusCodes.FORBIDDEN).json({ success: false, message: "Invalid or expired refresh token"});
    };


};

const AuthControllers = {
    refresh,
};

export default AuthControllers;