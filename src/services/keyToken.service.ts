import keyTokenModel from "@/models/keytoken.model";
import { Types } from "mongoose";

class KeyTokenServices {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }: { userId: Types.ObjectId, publicKey: string, privateKey: string, refreshToken: string }) => {
        try {
            // level gà
            // const token = await keyTokenModel.create({
            //     user: userId,
            //     publicKey: publicKey,
            //     privateKey: privateKey
            // })
            // return token ? token.publicKey : null;
            const filter = { user: userId };
            const update = {
                publicKey,
                privateKey,
                refreshTokenUsed: [],
                refreshToken
            }
            const options = {
                upsert: true, // if the document does not exist, it will be created
                new: true,
            }
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }
    static findByUserId = async (userId: Types.ObjectId) => {
        return await keyTokenModel.findOne({ user: userId }).lean();
    }
    static removeKeyById = async (id: Types.ObjectId) => {
        return await keyTokenModel.deleteOne({ _id: id });
    }
    static findByRefreshTokenUsed = async (refreshToken: string) => {
        return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken }).lean();
    }
    static findByRefreshToken = async (refreshToken: string) => {
        return await keyTokenModel.findOne({ refreshToken })
    }
    static deleteTokenUsed = async (userId: Types.ObjectId) => {
        return await keyTokenModel.findByIdAndDelete(userId);
    }

}

export default KeyTokenServices;