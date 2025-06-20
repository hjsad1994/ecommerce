import shopModel from "@/models/shop.model";
import { ShopSignUpRequest, Shop, ShopLoginRequest, ShopLogoutRequest } from "@/types";
import bcrypt from "bcrypt";
import KeyTokenService from "@/services/keyToken.service";
import createTokenPairs, { verifyJWT } from "@/auth/authUtils";
import getInfoData from "@/Utils";
import crypto from "crypto";
import { BadRequestError, InternalServerError, ConflictRequestError, NotFoundError, ForbiddenError, AuthFailureError } from "@/core/error.respone";
import shopServices from "./shop.services";
import { Types } from "mongoose";

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
    /**
     * Xử lý refresh token để cấp mới access token và refresh token
     * 
     * Cơ chế bảo mật:
     * 1. Kiểm tra refresh token có bị sử dụng trước đó chưa (detect token reuse attack)
     * 2. Nếu đã được sử dụng -> xóa tất cả token của user (nghi ngờ tấn công)
     * 3. Nếu chưa được sử dụng -> tạo cặp token mới và đánh dấu token cũ đã sử dụng
     * 
     * @param refreshToken - Refresh token từ client gửi lên
     * @returns Object chứa thông tin shop và cặp token mới
     */
    static handleRefreshToken = async (refreshToken: string) => {
        // Bước 1: Kiểm tra refresh token có trong danh sách đã sử dụng không
        // Điều này giúp phát hiện token reuse attack (khi hacker sử dụng lại token cũ)
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        if (foundToken) {
            // Nếu token đã được sử dụng trước đó -> nghi ngờ tấn công
            // Giải mã token để lấy thông tin user
            const decoded = await verifyJWT(refreshToken, foundToken.privateKey);
            const { userId, email } = decoded as { userId: string, email: string };
            
            // Xóa tất cả token của user này để bảo vệ tài khoản
            await KeyTokenService.deleteTokenUsed(new Types.ObjectId(userId));
            throw new ForbiddenError('Something went wrong');
        }

        // Bước 2: Tìm keyStore chứa refresh token hợp lệ
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
        if (!holderToken) {
            throw new AuthFailureError('Shop not registered');
        }

        // Bước 3: Xác minh và giải mã refresh token
        const decoded = await verifyJWT(refreshToken, holderToken.privateKey);
        const { userId, email } = decoded as { userId: string, email: string };

        // Bước 4: Kiểm tra shop có tồn tại trong database không
        const foundShop = await shopServices.findByEmail(email);
        if(!foundShop) {
            throw new AuthFailureError('Shop not registered');
        }

        // Bước 5: Tạo cặp token mới (access token + refresh token)
        const tokens = await createTokenPairs({
            userId,
            email,
        }, holderToken.publicKey, holderToken.privateKey);
        if(!tokens) {
            throw new InternalServerError('Failed to generate authentication tokens. Please try again.');
        }

        // Bước 6: Cập nhật keyStore
        // - Lưu refresh token mới
        // - Thêm refresh token cũ vào danh sách đã sử dụng (để phát hiện reuse attack)
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken, // Refresh token mới
            },
            $addToSet: {
                refreshTokenUsed: refreshToken // Thêm token cũ vào danh sách đã sử dụng
            }
        })

        // Bước 7: Trả về thông tin shop và cặp token mới
        return {
            shop: getInfoData<ShopResponse>({
                fields: ['_id', 'email'],
                object: foundShop as ShopResponse
            }),
            tokens: tokens as any
        }
    }

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
    static login = async ({ email, password, refreshToken }: ShopLoginRequest): Promise<AccessServiceResponse> => {
        const foundShop = await shopServices.findByEmail(email);
        const { _id: userId } = foundShop;
        if (!foundShop) {
            throw new NotFoundError('Shop not found. Please check your email and password.');
        }
        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) {
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