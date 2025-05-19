import { Request, Response, NextFunction } from 'express';
import { Client, Account } from 'node-appwrite'; // Import Client and Account from node-appwrite

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user?: any; // You can define a more specific type for the user object
}

// Middleware to verify if user is authenticated
export const isAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Get the JWT from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header provided' });
    }
    
    // Extract the JWT token (expecting "Bearer <token>")
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid authorization header format. Expected "Bearer <token>".' });
    }
    const jwt = parts[1];
    
    if (!jwt) {
      return res.status(401).json({ message: 'No token provided in authorization header' });
    }

    // Create a new Appwrite client instance specifically for this request and set its JWT
    // This is important because the JWT is tied to the client instance.
    // Ensure APPWRITE_ENDPOINT and APPWRITE_PROJECT_ID are available in process.env
    if (!process.env.APPWRITE_ENDPOINT || !process.env.APPWRITE_PROJECT_ID) {
      console.error('FATAL ERROR: Appwrite environment variables (APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID) are not set.');
      return res.status(500).json({ message: 'Server configuration error.'});
    }

    const requestSpecificClient = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setJWT(jwt);

    const accountInstance = new Account(requestSpecificClient);

    // Verify the token by fetching the current user
    const user = await accountInstance.get();
    
    // Attach user to the request object
    req.user = user;
    
    // If we get here, the user is authenticated
    next();
  } catch (error: any) {
    // Log the error for debugging, but don't expose too much detail to the client
    console.error('Authentication error:', error.message, error.code, error.response?.data);

    // Appwrite error codes can be more specific, e.g., user_jwt_invalid (401), user_not_found (404)
    if (error.code === 401 || (error.response && error.response.code === 401) || (error.message && error.message.toLowerCase().includes('jwt'))) {
         return res.status(401).json({
            message: 'Authentication failed: Invalid token or session.',
        });
    }
    
    return res.status(401).json({
      message: 'Authentication failed',
    });
  }
};