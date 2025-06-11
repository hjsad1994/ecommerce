
import jwt from "jsonwebtoken";

const createTokenPairs = async (payload: any, accessTokenSecret: string, refreshTokenSecret: string) => {
    try {
        console.log('🔑 Creating token pairs...');
        console.log('Payload:', JSON.stringify(payload, null, 2));
        
        // create access token using access token secret
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: '2 days'
        });
        
        // create refresh token using refresh token secret
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
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