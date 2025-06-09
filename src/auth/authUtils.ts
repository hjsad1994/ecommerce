
import jwt from "jsonwebtoken";

const createTokenPairs = async (payload: any, publicKey: string, privateKey: string) => {
    try {
        console.log('🔑 Creating token pairs...');
        console.log('Payload:', JSON.stringify(payload, null, 2));
        
        // create access token
        const accessToken = jwt.sign(payload, privateKey, {
            expiresIn: '2 days'
        });
        
        const refreshToken = jwt.sign(payload, privateKey, {
            expiresIn: '7 days'
        });
        
        console.log('✅ Tokens created successfully');
        return { accessToken, refreshToken };

    } catch (error) {
        console.error('❌ Error creating token pairs:', error);
        console.error('Error details:', error);
        return null;
    }
}

export default createTokenPairs;