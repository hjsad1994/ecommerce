import { model, Schema, Types } from 'mongoose';

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

const keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true
        // Lưu access token secret (symmetric key)
    },
    privateKey: {
        type: String,
        required: true
        // Lưu refresh token secret (symmetric key)  
    },
    refreshTokenUsed: {
        type: Array,
        default: [] // những RT đã được sử dụng
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

export default model(DOCUMENT_NAME, keyTokenSchema); 