import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async(req, res, next)=>{
    let token = req.headers.authorization;
    
    if(!token || !token.startsWith('Bearer ')){
        return res.status(401).json({success: false, message: 'No token, authorization denied'});
    }

    try {
        // Extract token from "Bearer TOKEN_VALUE"
        token = token.split(' ')[1];
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if(!decoded){
            return res.status(401).json({success: false, message: 'Token is not valid'});
        }
        
        req.user = await User.findById(decoded).select('-password');
        next();

    } catch (error) {
        console.log('JWT Error:', error.message);
        return res.status(401).json({success: false, message: 'Token is not valid'});
    }
}