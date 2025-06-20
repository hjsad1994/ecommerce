import shopModel from "@/models/shop.model";

const findByEmail = async (email: string, select = {
    email: 1,
    password: 1,
    name: 1,
    roles: 1,
}) => {
    return await shopModel.findOne({ email }).select(select).lean();
}

export default {
    findByEmail
}