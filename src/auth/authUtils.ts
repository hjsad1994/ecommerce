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
        console.log('🔑 Creating token pairs...');
        console.log('Payload:', JSON.stringify(payload, null, 2));
        
        // create access token using access token secret
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: '2 days'
        });
        
        // create refresh token using refresh token secret
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: '7 days'
        });
        
        console.log('✅ Tokens created successfully');
        return { accessToken, refreshToken };

    } catch (error) {
        console.error('❌ Error creating token pairs:', error);
        console.error('Error details:', error);
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
    
    console.log('🔍 Authentication middleware started...');
    
    const userId = req.headers[HEADER.CLIENT_ID] as string;
    if (!userId) {
        throw new UnauthorizedError('Invalid request - missing user ID');
    }
    console.log('📋 User ID:', userId);
    
    const keyStore = await KeyTokenServices.findByUserId(new Types.ObjectId(userId));
    if(!keyStore) {
        throw new NotFoundError('Not found keyStore');
    }
    console.log('🔑 KeyStore found for user:', userId);
    console.log('🔑 PublicKey (accessTokenSecret):', keyStore.publicKey?.substring(0, 20) + '...');
    
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string;
    if(!accessToken) {
        throw new UnauthorizedError('Invalid request - missing access token');
    }
    console.log('🎫 Access token received:', accessToken.substring(0, 20) + '...');

    try {
        console.log('🔍 Verifying token with stored publicKey...');
        const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
        console.log('✅ Token verified successfully:', decodeUser);
        
        if(userId !== (decodeUser as any).userId) {
            console.log('❌ User ID mismatch:', { expected: userId, actual: (decodeUser as any).userId });
            throw new AuthFailureError('Invalid user id');
        }
        
        (req as any).keyStore = keyStore;
        console.log('✅ Authentication successful');
        return next();

    } catch (error) {
        console.log('❌ JWT verification failed:', (error as Error).message);
        console.log('❌ Error details:', error);
        throw error as Error;
    }
});

export default createTokenPairs;
export { authencation };