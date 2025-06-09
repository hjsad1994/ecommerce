import keyTokenModel from "@/models/keytoken.model";
import { Types } from "mongoose";

class KeyTokenServices {
    static createKeyToken = async ({ userId, publicKey }: { userId: Types.ObjectId, publicKey: string }) => {
        try {
            const publicKeyString = publicKey.toString();
            const token = await keyTokenModel.create({
                user: userId,
                publicKey: publicKeyString,
            })
            return token ? token.publicKey : null;
        } catch (error) {
            return error;
        }
    }

}

export default KeyTokenServices;