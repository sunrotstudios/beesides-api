import express, { Request, Response } from 'express';
import { storage } from '../config/appwrite';
import { ID } from 'node-appwrite';

const router = express.Router();

// Get a file
router.get('/:bucketId/:fileId', async (req: Request, res: Response) => {
  try {
    const { bucketId, fileId } = req.params;
    
    const file = await storage.getFile(bucketId, fileId);
    
    // Get file download URL
    const fileUrl = storage.getFileDownload(bucketId, fileId);
    
    res.status(200).json({
      file,
      url: fileUrl
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to get file',
      error
    });
  }
});

// List files in a bucket
router.get('/:bucketId', async (req: Request, res: Response) => {
  try {
    const { bucketId } = req.params;
    
    const files = await storage.listFiles(bucketId);
    
    res.status(200).json(files);
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to list files',
      error
    });
  }
});

// Create file upload details for client-side uploads
// Note: Clients should use these details with their own Appwrite SDK instance to upload files
router.post('/upload/:bucketId', async (req: Request, res: Response) => {
  try {
    const { bucketId } = req.params;
    const { name, contentType } = req.body as { name: string; contentType: string };
    
    // Generate a unique file ID
    const fileId = ID.unique();
    
    // For direct client uploads, we need to return information that the client can use
    // Since v11+ storage API doesn't have createFileUpload, we need a different approach
    
    // Construct the upload URL manually based on Appwrite API
    const appwriteEndpoint = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
    const appwriteProjectId = process.env.APPWRITE_PROJECT_ID;
    
    // Return details for client-side upload
    const uploadEndpoint = `${appwriteEndpoint}/storage/buckets/${bucketId}/files`;
    const uploadUrl = uploadEndpoint; // Define uploadUrl explicitly to fix TS error
    
    res.status(200).json({
      fileId,
      bucketId,
      endpoint: uploadEndpoint,
      uploadUrl, // Include uploadUrl in response
      projectId: appwriteProjectId,
      name,
      contentType
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to prepare file upload details',
      error
    });
  }
});

// Delete a file
router.delete('/:bucketId/:fileId', async (req: Request, res: Response) => {
  try {
    const { bucketId, fileId } = req.params;
    
    await storage.deleteFile(bucketId, fileId);
    
    res.status(200).json({
      message: 'File deleted successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to delete file',
      error
    });
  }
});

export default router;