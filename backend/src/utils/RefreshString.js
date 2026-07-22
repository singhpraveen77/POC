import crypto from "crypto";


export const generateRefreshString =()=>{
    return crypto.randomBytes(64).toString("hex");
}