import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
    userId: string; // Change the type according to your actual decoded token structure
  }

const authenticateUser = (req:Request, res:Response, next:NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authentication token missing.' });
        }

        const decoded = jwt.verify(token, process.env.SECRET) as DecodedToken;
        
        req.headers["userId"] = decoded.userId;
        next()
    } catch (error) {
        console.error('Error authenticating user: ', error);
        return res.status(401).json({ message: 'Invalid authentication token. ' })
    }
}

export default authenticateUser;