import bcrypt from "bcryptjs";

const hashPassword = async(password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const comparePassword = async(password: string, hashPassword: string) => {
    return await bcrypt.compare(password, hashPassword);
};

const passwordUTILS = {
    hashPassword,
    comparePassword,
};

export default passwordUTILS;