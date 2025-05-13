import { Client, Databases, Storage, Teams, Users, Query } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const appwriteEndpoint = process.env.APPWRITE_ENDPOINT;
const appwriteProjectId = process.env.APPWRITE_PROJECT_ID;
const appwriteApiKey = process.env.APPWRITE_API_KEY;

if (!appwriteEndpoint) {
  console.error("FATAL ERROR: APPWRITE_ENDPOINT is not set in environment variables. Appwrite SDK cannot be initialized.");
  process.exit(1); // Exit if endpoint is not set
}

if (!appwriteProjectId) {
  console.error("FATAL ERROR: APPWRITE_PROJECT_ID is not set in environment variables. Appwrite SDK cannot be initialized.");
  process.exit(1); // Exit if project ID is not set
}

if (!appwriteApiKey) {
  console.error("FATAL ERROR: APPWRITE_API_KEY is not set in environment variables. Appwrite SDK cannot be initialized.");
  process.exit(1); // Exit if API key is not set
}

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProjectId)
  .setKey(appwriteApiKey);

// Initialize Appwrite services
const databases = new Databases(client);
const storage = new Storage(client);
const teams = new Teams(client);
const users = new Users(client);

export { client, databases, storage, teams, users, Query };