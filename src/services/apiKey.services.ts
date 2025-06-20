import apiKeyModel from "@/models/apikey.model";
import { ApiKey } from "@/types/models.types";
import crypto from "crypto";
const findById = async (key: string): Promise<ApiKey | null> => {
    const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
    if (!objKey) {
        return null;
    }
    return objKey as ApiKey;
}

export default {
    findById
}