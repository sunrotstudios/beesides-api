import { Client, Account, Databases, Storage, Teams, Users } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const appwriteEndpoint = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const appwriteProjectId = process.env.APPWRITE_PROJECT_ID;
const appwriteApiKey = process.env.APPWRITE_API_KEY || '';

if (!appwriteProjectId) {
  console.error("FATAL ERROR: APPWRITE_PROJECT_ID is not set in environment variables. Appwrite SDK cannot be initialized.");
  process.exit(1); // Exit if project ID is not set
}

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProjectId)
  .setKey(appwriteApiKey);

// Initialize Appwrite services
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const teams = new Teams(client);
const users = new Users(client);

export { client, account, databases, storage, teams, users };