import { Request, Response } from "express";
import { UserSchema } from "../validators/user.validator";
import { StatusCodes } from "http-status-codes";
import hashPassword from "../utils/auth/hashPassword";
import { generateAccessToken, generateRefreshToken } from "../utils/auth/tokens";
import User from "../models/user.model";
import RefreshToken from "../models/tokens.model";
import { ERole } from "../types/types";

const createUser = async(req: Request, res: Response) => {
    try{
        //validating the re.body
        const validData = UserSchema.safeParse(req.body);

        if(!validData.success) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Provide valid Credentials"})
        };

        //hashing password
        const { data } = validData;
        const hashedPassword = await hashPassword(data?.password);
        const refreshToken = await generateAccessToken({username: data.username, role: data.role || ERole.user});

        const user = await User.create({...data, password: hashedPassword});
        await RefreshToken.create({user: user._id, refreshToken});

        return res.status(StatusCodes.CREATED).json({ success: true, message: "User created successfully"});
    } catch(error: any) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error});
    };
};

const UserControllers = {
    createUser,
};

export default UserControllers;