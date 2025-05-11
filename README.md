# Beesides API

A Node.js API server that integrates with Appwrite for database and authentication services.

## Features

- **Authentication**: User registration, login, and session management
- **Database**: CRUD operations for Appwrite database collections
- **Storage**: File upload and management with Appwrite storage
- **TypeScript**: Type-safe codebase
- **Express.js**: Fast, unopinionated, minimalist web framework

## Prerequisites

- Node.js (v14 or higher)
- Appwrite instance (self-hosted or cloud)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values with your Appwrite credentials

## Environment Variables

```
# Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Running the Server

### Development

```
npm run dev
```

### Production

```
npm run build
npm start
```

## API Documentation

API documentation is available at `/api/docs` when the server is running.

### Authentication Endpoints

- **Register**: `POST /api/auth/register`
  - Body: `{ "email": "user@example.com", "password": "password", "name": "User Name" }`

- **Login**: `POST /api/auth/login`
  - Body: `{ "email": "user@example.com", "password": "password" }`

- **Get Current User**: `GET /api/auth/user`
  - Headers: `Authorization: Bearer {jwt}`

- **Logout**: `POST /api/auth/logout`
  - Body: `{ "sessionId": "session-id" }`

### Database Endpoints

- **List Documents**: `GET /api/data/:databaseId/:collectionId`
  - Headers: `Authorization: Bearer {jwt}`
  - Query: `queries` (optional, JSON string of query parameters)

- **Get Document**: `GET /api/data/:databaseId/:collectionId/:documentId`
  - Headers: `Authorization: Bearer {jwt}`

- **Create Document**: `POST /api/data/:databaseId/:collectionId`
  - Headers: `Authorization: Bearer {jwt}`
  - Body: Document data

- **Update Document**: `PATCH /api/data/:databaseId/:collectionId/:documentId`
  - Headers: `Authorization: Bearer {jwt}`
  - Body: Document data to update

- **Delete Document**: `DELETE /api/data/:databaseId/:collectionId/:documentId`
  - Headers: `Authorization: Bearer {jwt}`

### Storage Endpoints

- **List Files**: `GET /api/storage/:bucketId`
  - Headers: `Authorization: Bearer {jwt}`

- **Get File**: `GET /api/storage/:bucketId/:fileId`
  - Headers: `Authorization: Bearer {jwt}`

- **Upload File**: `POST /api/storage/upload/:bucketId`
  - Headers: `Authorization: Bearer {jwt}`
  - Body: `{ "name": "filename.ext", "contentType": "image/jpeg" }`

- **Delete File**: `DELETE /api/storage/:bucketId/:fileId`
  - Headers: `Authorization: Bearer {jwt}`

## Appwrite Setup

1. Create a project in Appwrite
2. Create an API key with the following permissions:
   - users.read
   - users.write
   - databases.read
   - databases.write
   - storage.read
   - storage.write
3. Create a database and collections as needed
4. Create a storage bucket for file uploads

## License

MIT