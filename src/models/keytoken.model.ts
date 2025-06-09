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
    },
    refreshToken: {
        type: Array,
        default: [] // những RT đã được sử dụng
    },  
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

export default model(DOCUMENT_NAME, keyTokenSchema); 