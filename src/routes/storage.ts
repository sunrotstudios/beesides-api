import express from 'express';
import { storage } from '../config/appwrite';
import { ID } from 'node-appwrite';

const router = express.Router();

// Get a file
router.get('/:bucketId/:fileId', async (req, res) => {
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
router.get('/:bucketId', async (req, res) => {
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

// Create a file upload URL
router.post('/upload/:bucketId', async (req, res) => {
  try {
    const { bucketId } = req.params;
    const { name, contentType } = req.body;
    
    // Generate a unique file ID
    const fileId = ID.unique();
    
    // Create a new file with an empty file content
    // This will return the file object with upload permissions
    const file = await storage.createFile(
      bucketId,
      fileId,
      undefined,  // Pass undefined for an empty file, client will upload content later
      {
        name,
        contentType
      }
    );
    
    res.status(200).json({
      fileId,
      uploadUrl
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to create file upload URL',
      error
    });
  }
});

// Delete a file
router.delete('/:bucketId/:fileId', async (req, res) => {
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