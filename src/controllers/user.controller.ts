import { Request, Response } from "express";
import { UserSchema } from "../validators/user.validator";
import { StatusCodes } from "http-status-codes";
import hashPassword from "../utils/auth/hashPassword";
import { generateAccessToken, generateRefreshToken } from "../utils/auth/tokens";
import User from "../models/user.model";
import { success } from "zod";
import { ERole } from "../types/types";

const createUser = async(req: Request, res: Response) => {
    try{
        //validating the re.body
        const validData = UserSchema.safeParse(req.body);

        if(!validData.success) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Provide valid Credentials"})
        };

        //hashing password
        const hashedPassword = await hashPassword(validData?.data?.password);
        const { username, role } = validData.data;
        const refreshToken = await generateAccessToken({username, role: role || ERole.user});

        //await User.create({ ...validData, password: hashedPassword, refreshToken});

        return res.status(StatusCodes.CREATED).json({ success: true, message: "User created successfully"});
    } catch(error: any) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Failed to create user"});
    };
};

const UserControllers = {
    createUser,
};

export default UserControllers;