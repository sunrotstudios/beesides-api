import express from 'express';
import { databases } from '../config/appwrite';
import { Query } from 'node-appwrite';
import { isAuthenticated } from '../middleware/auth'; // Assuming you have auth middleware
import { Request } from 'express';

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user: { $id: string }; // Adjust the type based on your actual user object structure
}

const router = express.Router();

// Mock database and collection IDs - replace with your actual IDs
const DB_ID = 'default_database'; // Or your specific database ID
const USERS_COLLECTION_ID = 'users'; // Or your users collection ID

// GET onboarding progress
router.get('/progress', isAuthenticated, async (req, res) => {
  const userId = (req as AuthenticatedRequest).user.$id; // Assuming userId is available from auth middleware

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // Fetch user document which might contain onboarding progress
    // This is an example, adjust based on your actual data structure
    const userDoc = await databases.getDocument(DB_ID, USERS_COLLECTION_ID, userId);

    // Assuming onboarding progress is stored in a 'preferences.onboarding' field
    const onboardingProgress = userDoc.preferences?.onboarding || {
      genres: [],
      artists: [],
      ratings: [],
      following: [],
      rymImported: false,
      lastCompletedStep: null, // Or undefined
    };

    res.status(200).json(onboardingProgress);
  } catch (error: any) {
    if (error.code === 404) {
      // User document or preferences not found, return default progress
      return res.status(200).json({
        genres: [],
        artists: [],
        ratings: [],
        following: [],
        rymImported: false,
        lastCompletedStep: null,
      });
    }
    console.error('Error fetching onboarding progress:', error);
    res.status(500).json({ message: 'Failed to fetch onboarding progress', error: error.message });
  }
});

// POST to update a step in onboarding progress (example)
router.post('/step', isAuthenticated, async (req, res) => {
  // @ts-ignore
  const userId = req.user.$id;
  const { step, data, lastCompletedStep } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!step || data === undefined) {
    return res.status(400).json({ message: 'Step and data are required' });
  }

  try {
    const userDoc = await databases.getDocument(DB_ID, USERS_COLLECTION_ID, userId);
    const currentPreferences = userDoc.preferences || {};
    const currentOnboarding = currentPreferences.onboarding || {};

    const updatedOnboarding = {
      ...currentOnboarding,
      [step]: data,
      lastCompletedStep: lastCompletedStep || currentOnboarding.lastCompletedStep, // Keep previous if not provided
      updatedAt: new Date().toISOString(),
    };

    await databases.updateDocument(DB_ID, USERS_COLLECTION_ID, userId, {
      preferences: {
        ...currentPreferences,
        onboarding: updatedOnboarding,
      },
    });

    res.status(200).json({ message: `Step '${step}' updated successfully`, data: updatedOnboarding });
  } catch (error: any) {
    console.error(`Error updating onboarding step '${step}':`, error);
    res.status(500).json({ message: `Failed to update onboarding step '${step}'`, error: error.message });
  }
});

// POST to complete onboarding (example)
router.post('/complete', isAuthenticated, async (req, res) => {
  // @ts-ignore
  const userId = req.user.$id;
  // Extract progress from req.body, handling both formats ({ progress } or direct progress object)
  const progress = req.body.progress || req.body;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!progress) {
    return res.status(400).json({ message: 'Onboarding progress data is required' });
  }

  try {
    const userDoc = await databases.getDocument(DB_ID, USERS_COLLECTION_ID, userId);
    const currentPreferences = userDoc.preferences || {};

    const completedOnboardingProgress = {
      ...progress,
      completed: true,
      completedAt: new Date().toISOString(),
    };

    await databases.updateDocument(DB_ID, USERS_COLLECTION_ID, userId, {
      preferences: {
        ...currentPreferences,
        onboarding: completedOnboardingProgress,
      },
    });

    res.status(200).json({ message: 'Onboarding completed successfully', data: completedOnboardingProgress });
  } catch (error: any) {
    console.error('Error completing onboarding:', error);
    res.status(500).json({ message: 'Failed to complete onboarding', error: error.message });
  }
});


export default router;
