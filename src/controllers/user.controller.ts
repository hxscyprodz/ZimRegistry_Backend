import { Request, Response } from "express";
import { UserLoginSchema, UserSchema } from "../validators/user.validator";
import { StatusCodes } from "http-status-codes";
import passwordUTILS from "../utils/auth/password";
import tokenUTILS from "../utils/auth/tokens";
import User from "../models/user.model";
import RefreshToken from "../models/tokens.model";
import { ERole } from "../types/types";


const createUser = async(req: Request, res: Response) => {
    try{
        //validating the req.body
        const validData = UserSchema.safeParse(req.body);

        if(!validData.success) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Provide valid Credentials"})
        };

        const { data } = validData;
        
        const isUserAvailable = await User.findOne({ contactNumber: data?.contactNumber, email: data?.email });
        
        if(isUserAvailable) {
            return res.status(StatusCodes.OK).json({ success: false, message: "Account already exist"});
        };
        
        const hashedPassword = await passwordUTILS.hashPassword(data?.password);
        const accessToken = await tokenUTILS.generateAccessToken({contactNumber: data.contactNumber, role: data.role || ERole.user});
        const refreshToken = await tokenUTILS.generateRefreshToken({contactNumber: data.contactNumber, role: data.role || ERole.user});

        const user = await User.create({...data, password: hashedPassword});
        await RefreshToken.create({user: user._id, refreshToken});

        return res.status(StatusCodes.CREATED).json({ success: true, data: {
            message: "User created successfully",
            accessToken,
        }});

    } catch(error: any) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Failed to create account. Please try again later."});
    };
};

const loginUser = async(req: Request, res: Response) => {
    try{
        const validData = UserLoginSchema.safeParse(req.body);

        if(!validData.success) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Provide valid credentials."});
        };
        const { data } = validData;

        const user = await User.findOne({ contactNumber: data?.contactNumber });

        if(!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Account not found"});
        };

        const isPasswordMatch = await passwordUTILS.comparePassword(data.password, user.password);

        if(!isPasswordMatch) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Invalid username or password"});
        };

        const accessToken = await tokenUTILS.generateAccessToken({ contactNumber: user.contactNumber, role: user.role });

        return res.status(StatusCodes.OK).json({ success: true, data: {
            message: "User logged in successfully.",
            accessToken,
        }});

    } catch(error: any) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Failed to login account. Please try again later."})
    };
};


const UserControllers = {
    createUser,
    loginUser
};

export default UserControllers;