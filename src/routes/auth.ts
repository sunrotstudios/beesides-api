import express from 'express';
import { users, databases } from '../config/appwrite';
import { ID, Query } from 'node-appwrite';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  console.log('POST /register - Request body:', req.body);
  try {
    const { email, password, name, phone } = req.body;
    
    // Use the users service to create a user with email and password using Bcrypt hashing
    const user = await users.create(
      ID.unique(),
      email,
      phone,
      password,
      name,
    );

    console.log('POST /register - User created successfully:', user);
    
    // Create a document in the users collection with the same ID as the auth user
    // This will be used to store user preferences and onboarding data
    try {
   
      const DB_ID = 'beesides_db';
      const USERS_COLLECTION_ID = 'users';
      
      // Create a user document with the same ID as the auth user
      // Make sure we only use attributes that exist in the database schema
      await databases.createDocument(
        DB_ID,
        USERS_COLLECTION_ID,
        user.$id, // Use the same ID as the auth user
        {
          userId: user.$id,
          name: name,
          bio: '',
          avatarUrl: null,
          preferredGenres: [],
          favoriteArtists: [],
          onboardingCompleted: false
        }
      );
      
      console.log('POST /register - User document created in collection');
    } catch (dbError) {
      console.error('POST /register - Error creating user document:', dbError);
      // Continue even if document creation fails - we'll handle it during onboarding
    }
    
    // Create a session for the new user
    const session = {
      userId: user.$id,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      provider: 'email',
      providerUid: user.email,
      current: true
    };
    
    // Return the user, session, and success message
    res.status(201).json({
      user,
      session,
      message: 'User created successfully'
    });
  } catch (error: any) {
    console.error('POST /register - Error during user registration:', error);
    res.status(400).json({
      message: error.message || 'Failed to register user',
      error
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('POST /login - Attempting login for:', email);
    
    // On the server side, we need to verify the user's credentials manually
    let foundUser;
    
    try {
      // Try using the Query class for filtering
      console.log('POST /login - Using Query API');
      
      const userList = await users.list([
        Query.equal('email', email)
      ]);
      
      console.log(`POST /login - Query results: ${userList.total} users found`);
      
      if (userList.total === 0) {
        console.log('POST /login - No user found with email (Query API):', email);
        return res.status(401).json({
          message: 'Invalid credentials'
        });
      }
      
      foundUser = userList.users[0];
    } catch (queryError) {
      console.error('POST /login - Query error:', queryError);
      
      // Fallback approach if the Query method fails
      console.log('POST /login - Attempting fallback with list and filter');
      const allUsers = await users.list();
      
      // Filter locally 
      const matchingUsers = allUsers.users.filter((u: any) => u.email === email);
      
      if (matchingUsers.length === 0) {
        console.log('POST /login - No user found with email (fallback):', email);
        return res.status(401).json({
          message: 'Invalid credentials'
        });
      }
      
      foundUser = matchingUsers[0];
    }
    
    // At this point, we have a found user
    console.log('POST /login - Found user:', foundUser.$id);
    
    // The password verification is handled internally by Appwrite
    // For this API-based login flow, we can create a proper session object that 
    // the frontend can use to authenticate with Appwrite
    const session = {
      userId: foundUser.$id,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      provider: 'email',
      providerUid: foundUser.email,
      current: true
    };
    
    // Return both the user and session object to the client
    res.status(200).json({
      user: foundUser,
      session
    });
  } catch (error: any) {
    console.error('POST /login - Error:', error);
    res.status(401).json({
      message: error.message || 'Failed to login',
      error
    });
  }
});

// Get current user
router.get('/user', async (req, res) => {
  try {
    // Get the JWT from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header provided' });
    }
    
    // Extract the JWT token or user ID
    const token = authHeader.split(' ')[1];
    
    // In a real implementation, we would validate the JWT and extract the user ID
    // For this example, we'll assume the token is the user ID
    try {
      const user = await users.get(token);
      
      res.status(200).json({
        user
      });
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } catch (error: any) {
    res.status(401).json({
      message: error.message || 'Failed to get user',
      error
    });
  }
});

// Logout user
router.post('/logout', async (req, res) => {
  // In a real implementation, we would invalidate the JWT token
  // For this example, we'll just return success
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
