import shopModel from "@/models/shop.model";
import { ShopSignUpRequest, ServiceResponse, Shop } from "@/types";
import bcrypt from "bcrypt";
import KeyTokenService from "@/services/keyToken.service";
const crypto = require('crypto');

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}
class AccessService {
    signUp = async ({ email, password, name }: ShopSignUpRequest) => {
        try {
            // check email exist
            const holderShop = await shopModel.findOne({ email }).lean();

            if (holderShop) {
                return {
                    success: false,
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
            });

            if (newShop) {
                // created private key and public key
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
                });
                console.log(privateKey, publicKey); // save to database keystore
                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                });

                if (!publicKeyString) {
                    return {
                        success: false,
                        error: {
                            code: 'CREATE_KEY_TOKEN_FAILED',
                            message: 'create key token failed!'
                        }
                    }
                }

            }



            return {
                success: true,
                data: newShop
            };

        } catch (error) {
            return {
                success: false,
                error: {
                    code: 'SERVER_ERROR',
                    message: (error as Error).message
                }
            };
        }
    }
}

export default new AccessService();