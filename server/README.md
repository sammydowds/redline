# Redline API  

## Overview
This application is an API built using Express.js that allows me to manage markdown posts and upload images. It supports creating, reading, and updating posts, as well as handling image uploads.

## Technologies Used
- **Node.js**: JavaScript runtime for server-side programming.
- **Express.js**: Web framework for building the API.
- **Multer**: Middleware for handling multipart/form-data, primarily for file uploads.
- **Front-Matter**: Library for parsing front matter in markdown files.
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing.
- **dotenv**: Module for loading environment variables from a `.env` file.
- **File System (fs)**: Node.js module for file operations.

## Environment Variables
- **POSTS_TARGET_URL**: Directory path where markdown posts and uploaded images are stored.
- **PORT**: Port number for the server to listen on (default is 5000).

## API Endpoints

### 1. Update Post
| Method | Endpoint          | Request Body                     | Response                                      | Functionality                                                                 |
|--------|-------------------|----------------------------------|-----------------------------------------------|-------------------------------------------------------------------------------|
| POST   | `/post/update`    | `markdown`: The markdown content | Success: `{ message: "Post updated." }`     | Parses the markdown to extract the title and saves it as a `.md` file.      |
|        |                   |                                  | Error: `{ message: "Error saving file." }`  |                                                                               |

### 2. Upload Photo
| Method | Endpoint          | Request                          | Response                                      | Functionality                                                                 |
|--------|-------------------|----------------------------------|-----------------------------------------------|-------------------------------------------------------------------------------|
| POST   | `/photo/upload`   | Multipart form-data with a file  | Success: `{ message: 'File uploaded successfully!', url: <filename> }` | Handles image uploads and saves them to the specified directory.              |
|        |                   | field named `image`             |                                               |                                                                               |

### 3. Get Editor Data
| Method | Endpoint          | Parameters                       | Response                                      | Functionality                                                                 |
|--------|-------------------|----------------------------------|-----------------------------------------------|-------------------------------------------------------------------------------|
| GET    | `/editor/:filename`| `filename`: The name of the markdown file | Success: `{ data: { attributes: <parsed attributes>, raw: <raw markdown> } }` | Reads a markdown file and returns its content along with parsed front matter. |
|        |                   |                                  | Error: `{ message: "File not found." }`     |                                                                               |

### 4. Get All Posts
| Method | Endpoint          | Response                                      | Functionality                                                                 |
|--------|-------------------|-----------------------------------------------|-------------------------------------------------------------------------------|
| GET    | `/posts`          | Success: `{ posts: [ { attributes: <parsed attributes>, fileName: <filename> }, ... ] }` | Lists all markdown files in the specified directory, returning their parsed content and filenames. |
|        |                   | Error: `{ message: "An error occurred while processing posts." }` |                                                                               |

## Middleware
- **CORS**: Enabled to allow cross-origin requests.
- **Body Parser**: Parses incoming JSON requests.

## File Structure
- **server/src/index.ts**: Main entry point of the application containing all route definitions and middleware setup.

## Error Handling
- Basic error handling is implemented for file operations and API responses, returning appropriate status codes and messages.

## Logging
- Console logging is used to indicate when the server is running and to log errors during post processing.

## Future Enhancements
- Implement authentication for secure access to the API.
- Add validation for incoming data to ensure proper formatting.
- Consider using a database for storing posts and images instead of the file system for scalability.