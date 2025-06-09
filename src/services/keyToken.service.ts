import keyTokenModel from "@/models/keytoken.model";
import { Types } from "mongoose";

class KeyTokenServices {
    static createKeyToken = async ({ userId, publicKey, privateKey }: { userId: Types.ObjectId, publicKey: string, privateKey: string }) => {
        try {
            const token = await keyTokenModel.create({
                user: userId,
                publicKey: publicKey,
                privateKey: privateKey
            })
            return token ? token.publicKey : null;
        } catch (error) {
            return error;
        }
    }

}

export default KeyTokenServices;