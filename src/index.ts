import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import dataRoutes from './routes/data';
import storageRoutes from './routes/storage';
import onboardingRoutes from './routes/onboarding'; // Added import
import { errorHandler, notFound } from './middleware/error';
import { isAuthenticated } from './middleware/auth';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000; // Changed port to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', isAuthenticated, onboardingRoutes); // Added route
// Protected routes - require authentication
app.use('/api/data', isAuthenticated, dataRoutes);
app.use('/api/storage', isAuthenticated, storageRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Beesides API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// API documentation route
app.get('/api/docs', (req, res) => {
  res.json({
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        user: 'GET /api/auth/user',
        logout: 'POST /api/auth/logout'
      },
      data: {
        listDocuments: 'GET /api/data/:databaseId/:collectionId',
        getDocument: 'GET /api/data/:databaseId/:collectionId/:documentId',
        createDocument: 'POST /api/data/:databaseId/:collectionId',
        updateDocument: 'PATCH /api/data/:databaseId/:collectionId/:documentId',
        deleteDocument: 'DELETE /api/data/:databaseId/:collectionId/:documentId'
      },
      storage: {
        listFiles: 'GET /api/storage/:bucketId',
        getFile: 'GET /api/storage/:bucketId/:fileId',
        uploadFile: 'POST /api/storage/upload/:bucketId',
        deleteFile: 'DELETE /api/storage/:bucketId/:fileId'
      }
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port} ✨`);
  console.log(`API documentation available at http://localhost:${port}/api/docs`);
});
