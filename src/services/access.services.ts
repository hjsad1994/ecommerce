import shopModel from "@/models/shop.model";
import { ShopSignUpRequest, Shop } from "@/types";
import bcrypt from "bcrypt";
import KeyTokenService from "@/services/keyToken.service";
import createTokenPairs from "@/auth/authUtils";
import getInfoData from "@/Utils";
import crypto from "crypto";
import { BadRequestError, InternalServerError, ConflictRequestError } from "@/core/error.respone";

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
    signUp = async ({ email, password, name }: ShopSignUpRequest): Promise<AccessServiceResponse> => {
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
        
        // save key token to database
        const keyStore = await KeyTokenService.createKeyToken({
            userId: newShop._id,
            publicKey: accessTokenSecret,  // access token secret
            privateKey: refreshTokenSecret // refresh token secret
        });

        if (!keyStore) {
            throw new InternalServerError('Failed to create authentication keys. Please try again.');
        }

        // create token pair using secrets
        const tokens = await createTokenPairs({
            userId: newShop._id,
            email,
        }, accessTokenSecret, refreshTokenSecret);
        
        if (!tokens) {
            throw new InternalServerError('Failed to generate authentication tokens. Please try again.');
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

export default new AccessService();