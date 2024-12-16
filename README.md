<head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>

<h1 align="center" style="font-weight: bolder; color: #059d06">Social Media API</h1>

<div align="center">

[![Test API with Postman](https://img.shields.io/badge/Test%20API%20with%20Postman-orange)](https://app.getpostman.com/run-collection/33891228-e2b7a7dc-db1a-4bdc-8b5b-f0f768b11765?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D33891228-e2b7a7dc-db1a-4bdc-8b5b-f0f768b11765%26entityType%3Dcollection%26workspaceId%3D7a63351a-2e1e-4435-84ba-c7e1ed8def04#?env%5Bsocial-media-api%5D=W3sia2V5IjoiYmFzZVVybCIsInZhbHVlIjoiaHR0cHM6Ly9zb2NpYWwtbWVkaWEtYXBpLXByb2R1Y3Rpb24tOTAzZC51cC5yYWlsd2F5LmFwcCIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJkZWZhdWx0Iiwic2Vzc2lvblZhbHVlIjoiaHR0cHM6Ly9zb2NpYWwtbWVkaWEtYXBpLXByb2R1Y3Rpb24tOTAzZC51cC5yYWlsd2F5LmFwcCIsImNvbXBsZXRlU2Vzc2lvblZhbHVlIjoiaHR0cHM6Ly9zb2NpYWwtbWVkaWEtYXBpLXByb2R1Y3Rpb24tOTAzZC51cC5yYWlsd2F5LmFwcCIsInNlc3Npb25JbmRleCI6MH1d)
[![How to Test API with Postman](https://img.shields.io/badge/How%20to%20Test%20API%20with%20Postman-orange)](https://www.linkedin.com/posts/guru-bandike_cfbr-backenddevelopment-socialmediaapi-activity-7273660552655052800-rwok?utm_source=share&utm_medium=member_desktop)

</div>

## Project Description

**Social Media API** is a backend application designed to support social media platforms. It provides essential functionalities such as user authentication, post management, commenting, liking, friendships, OTP-based password resets and password hashing, ensuring a seamless and secure user experience.

## Key Features

- **User Authentication:** Secure signup, login, and logout functionalities, including multi-device logout and active sessions with device info support.
- **Post Management:** Full CRUD capabilities for posts with ownership restrictions.
- **Comment System:** Add, update, and delete comments with ownership and permissions management.
- **Like Functionality:** Toggle likes on posts and comments with metadata support.
- **Friendships:** Manage friend requests and friendships with pending request handling.
- **OTP-Based Password Reset:** Secure OTP generation and verification for password resets.

---

## Tech Used

The **Social Media API** leverages the following technologies and tools:

### Backend

- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Framework for building APIs and handling routing.
- **MongoDB**: NoSQL database for storing user, post, and other app data.
- **Mongoose**: ODM library for MongoDB and Node.js.

### Other Tools and Libraries

- **multer**: For handling file uploads.
- **bcryptjs**: For password hashing and security.
- **jsonwebtoken (JWT)**: Secure token-based authentication.
- **cloudinary**: For managing and storing uploaded media files.
- **dotenv**: For managing environment variables.
- **winston**: Logging utility for effective debugging.

---

## Folder Structure

```
social-media-api/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── errors/
│   │   └── customError.js
│   ├── features/
│   │   ├── comment/
│   │   ├── friendship/
│   │   ├── like/
│   │   ├── otp/
│   │   ├── user/
│   │   │   └── user.controller.js
│   │   │   └── user.model.js
│   │   │   └── user.repository.js
│   │   │   └── user.routes.js
│   ├── middlewares/
│   │   └── auth-user.middleware.js
│   ├── utils/
│   │   └── dbHelpers.js
├── .gitignore
├── .env.example
├── app.js
├── env.js
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

---

## Installation

To get started with the **Social Media API**, follow these steps:

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js**
- **npm** (Node Package Manager)
- **MongoDB** (Local or cloud instance)

---

### Clone the Repository

```bash
git clone https://github.com/guru-bandike/Social-Media-API.git
cd Social-Media-API
```

---

### Install Dependencies

```bash
npm install
```

---

### Set Up Environment Variables

- Create a `.env` file in the root of the project by copying the provided `.env.example` file:

```bash
cp .env.example .env
```

- Open the **.env** file and replace the placeholder values with your actual environment settings.

---

### Start the Application

Start the server in development mode:

```bash
npm run dev
```

The application will run on `http://localhost:8000` by default.

---

<h3 align="center" style="font-weight: bolder; color: #059d06">Happy Coding!</h3>
