import { Request, Response } from "express";

const birthApplication = async(req: Request, res: Response) => {
    try{
        
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    };
};

export {
    birthApplication,
};