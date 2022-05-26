# Diogenes

File Uploader API for CoderSpace

## Routes

- POST `/api/files/post` - Post files
- GET `/api/files/user/:id` - Get files by user ID.
- GET `/api/file/:id` - Get a file by ID
- PUT `/api/file/:id` - Update a file using ID
- DELETE `/api/file/:id` - Delete a file by ID
- GET `/api/user/:userId` - Get user by the given userId (subId of the user)
- POST `/api/user/:userId` - Create user with the given userId
- PATCH `/api/user/:userId` - Update user with the given userId