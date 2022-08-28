# API for CoderSpace
### File Uploader API:
To upload files in aws S3, I have used AWS SDK for javascript. Controller functions are defined to get the requested data from the models.
The various controller functions are:
uploadFiles: Uploads file in S3, the path of a file is subId(unique id of user)/name of file. The filename is sanitized before sending data to s3, that is names are converted into s3 acceptable form. After the file is uploaded to s3, as a response s3 returns a versionId which is then stored in the files table.

#### getFileController: 
This controller is defined to get files from s3, a s3 signed url is generated and using this url a user gets access to the files according to their fileId. By default, all S3 objects are private. Only the object owner has permission to access them. However, the object owner can optionally share objects with others by creating a presigned URL, using their own security credentials, to grant time-limited permission to download the objects.
When a presigned URL is created for the object, you must provide your security credentials and then specify a bucket name, an object key, an HTTP method (GET to download the object), and an expiration date and time. The presigned URLs are valid only for the specified duration. If it is created  using a temporary token, then the URL expires when the token expires, even if the URL was created with a later expiration time.
Anyone who receives the presigned URL can then access the object. For example, if you have a video in your bucket and both the bucket and the object are private, you can share the video with others by generating a presigned URL.

#### createUser: 
This controller helps to create a user, the subId is provided from the frontend side, which will then be used as the userId for the user table.

## Routes

- POST `/api/files/post` - Post files
- GET `/api/files/user/:id` - Get files by user ID.
- GET `/api/file/:id` - Get a file by ID
- PUT `/api/file/:id` - Update a file using ID
- DELETE `/api/file/:id` - Delete a file by ID
- GET `/api/user/:userId` - Get user by the given userId (subId of the user)
- POST `/api/user/:userId` - Create user with the given userId


To start the server in development mode:

Run:

`npm run dev`
