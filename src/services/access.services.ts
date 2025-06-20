import shopModel from "@/models/shop.model";
import { ShopSignUpRequest, Shop, ShopLoginRequest, ShopLogoutRequest } from "@/types";
import bcrypt from "bcrypt";
import KeyTokenService from "@/services/keyToken.service";
import createTokenPairs from "@/auth/authUtils";
import getInfoData from "@/Utils";
import crypto from "crypto";
import { BadRequestError, InternalServerError, ConflictRequestError, NotFoundError } from "@/core/error.respone";
import shopServices from "./shop.services";

interface ShopResponse {
    _id: string;
    name: string;
    email: string;
    status: string;
    roles: string[];
}

interface AccessServiceResponse {
    shop: Partial<ShopResponse>;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}
const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}
class AccessService {

    static logout = async (keyStore: any) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        console.log(delKey);
        return delKey;
    }
    /*
    1. check email exist
    2. compare password
    3. create access token and refresh token
    4. generate refresh token
    5. get data return login
     */
    static login = async ({ email, password, refreshToken}: ShopLoginRequest): Promise<AccessServiceResponse> => {
        const foundShop = await shopServices.findByEmail(email);
        const {_id: userId} = foundShop;
        if(!foundShop) {
            throw new NotFoundError('Shop not found. Please check your email and password.');
        }
        const match = await bcrypt.compare(password, foundShop.password);
        if(!match) {
            throw new BadRequestError('Invalid password. Please try again.');
        }
        
        // Generate new keys for this login session
        const accessTokenSecret = crypto.randomBytes(64).toString('hex');
        const refreshTokenSecret = crypto.randomBytes(64).toString('hex');
        
        // First, update the keystore with new keys to ensure consistency
        const keyStore = await KeyTokenService.createKeyToken({
            userId,
            publicKey: accessTokenSecret,
            privateKey: refreshTokenSecret,
            refreshToken: 'temp' // temporary, will be updated below
        });
        
        if (!keyStore) {
            throw new InternalServerError('Failed to create authentication keys. Please try again.');
        }
        
        // Now create tokens with the same keys that are stored in database
        const tokens = await createTokenPairs({
            userId,
            email,
        }, accessTokenSecret, refreshTokenSecret);
        
        if (!tokens) {
            throw new InternalServerError('Failed to generate authentication tokens. Please try again.');
        }
        
        // Finally, update the refresh token in the keystore
        await KeyTokenService.createKeyToken({
            userId,
            publicKey: accessTokenSecret,
            privateKey: refreshTokenSecret,
            refreshToken: tokens.refreshToken
        });
        
        console.log('✅ Login successful with consistent keys');
        
        return {
                shop: getInfoData<ShopResponse>({
                    fields: ['_id', 'name', 'email'],
                    object: foundShop as ShopResponse
                }),
                tokens: tokens as any
        }

    }
    static signUp = async ({ email, password, name }: ShopSignUpRequest): Promise<AccessServiceResponse> => {
        // check email exist
        const holderShop = await shopModel.findOne({ email }).lean();

        if (holderShop) {
            throw new ConflictRequestError('Email already registered. Please use a different email or try logging in.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newShop = await shopModel.create({
            email,
            password: hashedPassword,
            name,
            roles: [roleShop.SHOP]
        }) as any;

        if (!newShop) {
            throw new InternalServerError('Failed to create shop account. Please try again.');
        }

        const accessTokenSecret = crypto.randomBytes(64).toString('hex');
        const refreshTokenSecret = crypto.randomBytes(64).toString('hex');
        
        // create token pair using secrets
        const tokens = await createTokenPairs({
            userId: newShop._id,
            email,
        }, accessTokenSecret, refreshTokenSecret);
        
        if (!tokens) {
            throw new InternalServerError('Failed to generate authentication tokens. Please try again.');
        }
        
        // save key token to database
        const keyStore = await KeyTokenService.createKeyToken({
            userId: newShop._id,
            publicKey: accessTokenSecret,  // access token secret
            privateKey: refreshTokenSecret, // refresh token secret
            refreshToken: tokens.refreshToken
        });

        if (!keyStore) {
            throw new InternalServerError('Failed to create authentication keys. Please try again.');
        }
        
        console.log(`✅ Created tokens successfully`);
        
        return {
            shop: getInfoData<ShopResponse>({
                fields: ['_id', 'name', 'email', 'status', 'roles'],
                object: newShop as ShopResponse
            }),
            tokens
        };
    }
}

export default AccessService;