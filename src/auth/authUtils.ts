import jwt from "jsonwebtoken";
import asyncHandler from "@/helpers/asyncHandler";
import { NextFunction, Request, Response } from "express";
import { AuthFailureError, NotFoundError, UnauthorizedError } from "@/core/error.respone";
import KeyTokenServices from "@/services/keyToken.service";
import { Types } from "mongoose";

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
}
const createTokenPairs = async (payload: any, accessTokenSecret: string, refreshTokenSecret: string) => {
    try {
        // create access token using access token secret
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: '2 days'
        });
        
        // create refresh token using refresh token secret
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: '7 days'
        });
        
        return { accessToken, refreshToken };

    } catch (error) {
        return null;
    }
}

const authencation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    /*
    1. check userId is missing ?
    2. get access token
    3. verify token
    4. check user in db
    5. check keyStore with this userId
    6. ok all => return next()
     */
    
    const userId = req.headers[HEADER.CLIENT_ID] as string;
    if (!userId) {
        throw new UnauthorizedError('Invalid request - missing user ID');
    }
    
    const keyStore = await KeyTokenServices.findByUserId(new Types.ObjectId(userId));
    if(!keyStore) {
        throw new NotFoundError('Not found keyStore');
    }
    
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string;
    if(!accessToken) {
        throw new UnauthorizedError('Invalid request - missing access token');
    }

    try {
        const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
        
        if(userId !== (decodeUser as any).userId) {
            throw new AuthFailureError('Invalid user id');
        }
        
        (req as any).keyStore = keyStore;

        return next();

    } catch (error) {

        throw error as Error;
    }
});

const verifyJWT = async (token: string, keySecret: string) => {
    return await jwt.verify(token, keySecret);
}

export default createTokenPairs;
export { authencation, verifyJWT };