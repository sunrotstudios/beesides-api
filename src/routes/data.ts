import express from 'express';
import { databases } from '../config/appwrite';
import { ID, Query } from 'node-appwrite';

const router = express.Router();

// Get all documents from a collection
router.get('/:databaseId/:collectionId', async (req, res) => {
  try {
    const { databaseId, collectionId } = req.params;
    const { queries } = req.query;
    
    let queryParams = [];
    
    // If queries are provided, parse them
    if (queries && typeof queries === 'string') {
      try {
        queryParams = JSON.parse(queries);
      } catch (e) {
        console.error('Failed to parse queries:', e);
      }
    }
    
    const documents = await databases.listDocuments(
      databaseId,
      collectionId,
      queryParams
    );
    
    res.status(200).json(documents);
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to get documents',
      error
    });
  }
});

// Get a single document
router.get('/:databaseId/:collectionId/:documentId', async (req, res) => {
  try {
    const { databaseId, collectionId, documentId } = req.params;
    
    const document = await databases.getDocument(
      databaseId,
      collectionId,
      documentId
    );
    
    res.status(200).json(document);
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to get document',
      error
    });
  }
});

// Create a document
router.post('/:databaseId/:collectionId', async (req, res) => {
  try {
    const { databaseId, collectionId } = req.params;
    const data = req.body;
    
    const document = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      data
    );
    
    res.status(201).json(document);
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to create document',
      error
    });
  }
});

// Update a document
router.patch('/:databaseId/:collectionId/:documentId', async (req, res) => {
  try {
    const { databaseId, collectionId, documentId } = req.params;
    const data = req.body;
    
    const document = await databases.updateDocument(
      databaseId,
      collectionId,
      documentId,
      data
    );
    
    res.status(200).json(document);
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to update document',
      error
    });
  }
});

// Delete a document
router.delete('/:databaseId/:collectionId/:documentId', async (req, res) => {
  try {
    const { databaseId, collectionId, documentId } = req.params;
    
    await databases.deleteDocument(
      databaseId,
      collectionId,
      documentId
    );
    
    res.status(200).json({
      message: 'Document deleted successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to delete document',
      error
    });
  }
});

export default router;