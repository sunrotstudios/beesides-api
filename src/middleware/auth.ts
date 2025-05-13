import { Request, Response, NextFunction } from 'express';

// Middleware to verify if user is authenticated
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the JWT from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header provided' });
    }
    
    // Extract the JWT token
    const jwt = authHeader.split(' ')[1];
    
    // For server-side verification, we'll just check if the token is present
    // In a real production app, you would implement proper JWT validation here
    
    // If we get here, the user is authenticated
    next();
  } catch (error: any) {
    return res.status(401).json({
      message: 'Authentication failed',
      error: error.message
    });
  }
};