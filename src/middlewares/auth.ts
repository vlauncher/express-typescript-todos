import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Users } from '../models/users';
// middleware/protect.ts


export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Extract token from "Bearer <token>"

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

      // Find the user by ID from token payload
      const user = await Users.findById(decoded.id);
      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      // Attach the authenticated user to the request object
      req.user = user;

      // Proceed to the next middleware/controller
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: 'Not authorized, token failed' });
      } else {
        next(error);
      }
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

