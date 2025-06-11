import shopModel from "@/models/shop.model";
import { ShopSignUpRequest, Shop } from "@/types";
import bcrypt from "bcrypt";
import KeyTokenService from "@/services/keyToken.service";
import createTokenPairs from "@/auth/authUtils";
import getInfoData from "@/Utils";
import crypto from "crypto";

interface ShopResponse {
    _id: string;
    name: string;
    email: string;
    status: string;
    roles: string[];
}
interface AccessServiceResponse {
    code: number;
    metadata?: any;
    error?: {
        code: string;
        message: string;
        status?: string;
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
        try {
            // check email exist
            const holderShop = await shopModel.findOne({ email }).lean();

            if (holderShop) {
                return {
                    code: 400,
                    error: {
                        code: 'SHOP_ALREADY_EXISTS',
                        message: 'shop already registered!'
                    }
                };
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            const newShop = await shopModel.create({
                email,
                password: hashedPassword,
                name,
                roles: [roleShop.SHOP]
            }) as any;

            if (newShop) {
                const accessTokenSecret = crypto.randomBytes(64).toString('hex');
                const refreshTokenSecret = crypto.randomBytes(64).toString('hex');
                
                // save key token to database
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey: accessTokenSecret,  // access token secret
                    privateKey: refreshTokenSecret // refresh token secret
                });

                if (!keyStore) {
                    return {
                        code: 400,
                        error: {
                            code: 'CREATE_KEY_TOKEN_FAILED',
                            message: 'Không thể lưu key token vào database'
                        }
                    }
                }

                // create token pair using secrets
                const tokens = await createTokenPairs({
                    userId: newShop._id,
                    email,
                }, accessTokenSecret, refreshTokenSecret);
                
                if (!tokens) {
                    return {
                        code: 500,
                        error: {
                            code: 'TOKEN_CREATION_FAILED',
                            message: 'Không thể tạo JWT tokens'
                        }
                    };
                }
                
                console.log(`✅ Created tokens successfully`);
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData<ShopResponse>({
                            fields: ['_id', 'name', 'email'],
                            object: newShop as ShopResponse
                        }),
                        tokens
                    }
                }

            }
            return {
                code: 200,
                metadata: null
            };

        } catch (error) {
            return {
                code: 500,
                metadata: null,
                error: {
                    code: 'SERVER_ERROR',
                    message: (error as Error).message,
                    status: 'error'
                }
            };
        }
    }
}

export default new AccessService();