
# UniFind - Lost and Found Web App

UniFind is a lost and found web application that helps users report lost items, report found items, view potential matches, submit claims, communicate through messages, and receive notifications. The system also includes an admin dashboard for reviewing claims and managing item verification.

## Features

- User registration and login
- Role-based access for users and admins
- Report lost items
- Report found items
- Upload item images
- View potential item matches
- Submit claim requests
- Proof of ownership verification
- Admin claim approval/rejection
- Claim status notifications
- Basic messaging system
- User dashboard
- Admin dashboard
- Search and filter functionality
- Edit and delete user reports
- Protected routes
- Mobile responsive layout
- Custom 404 page

## Technologies Used

### Frontend

- React
- React Router
- JavaScript
- CSS
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt.js
- Multer
- CORS
- Dotenv

## Project Structure

```text
UNIFIND-LOST AND FOUND WEB APP/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

## Installation And Setup

### 1. Clone Or Open The Project

Open the project folder in VS Code.

```bash
cd "C:\UNIFIND-LOST AND FOUND WEB APP"
```

## Backend Setup

Go into the server folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/unifind_lost_found
JWT_SECRET=unifind_secret_key
```

Start the backend server:

```bash
npm run dev
```

The backend should run on:

```text
http://localhost:5000
```

You should see:

```text
Server running on port 5000
MongoDB connected
```

## Frontend Setup

Open a new terminal and go into the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend should run on:

```text
http://localhost:5173
```

## User Roles

### Normal User

A normal user can:

- Register and log in
- Report lost items
- Report found items
- Upload images
- View matches
- Submit claims
- View claim status
- Send and receive messages
- View notifications
- Edit or delete their own open reports

### Admin

An admin can:

- View admin dashboard
- View claim requests
- Review proof of ownership
- Approve claims
- Reject claims
- Request more proof
- Send messages to claimants
- View platform statistics

To make a user an admin, open MongoDB Compass and change the user role from:

```json
"role": "user"
```

to:

```json
"role": "admin"
```

## Main API Routes

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Lost Items

```text
GET /api/lost-items
POST /api/lost-items
PUT /api/lost-items/:id
DELETE /api/lost-items/:id
```

### Found Items

```text
GET /api/found-items
POST /api/found-items
PUT /api/found-items/:id
DELETE /api/found-items/:id
```

### Matches

```text
GET /api/matches
```

### Claims

```text
GET /api/claims
POST /api/claims
PATCH /api/claims/:id/status
```

### Messages

```text
GET /api/messages
POST /api/messages
```

### Notifications

```text
GET /api/notifications
PATCH /api/notifications/:id/read
```

### Uploads

```text
POST /api/uploads
```

### Admin

```text
GET /api/admin/stats
```

## Database Collections

The app uses these MongoDB collections:

- users
- lostitems
- founditems
- claims
- messages
- notifications

## How The Matching System Works

The matching system compares lost and found items using:

- category
- item name similarity
- description similarity

If two items have enough similarity, they appear on the Potential Matches page.

## Claim Workflow

1. A user reports a lost item.
2. Another user reports a found item.
3. UniFind finds a possible match.
4. The user submits a claim with proof of ownership.
5. Admin reviews the claim.
6. Admin approves, rejects, or requests more proof.
7. The user receives a notification.
8. If approved, the item status becomes claimed.

## Image Uploads

Images are uploaded using Multer and stored in:

```text
server/uploads
```

Uploaded images are served from:

```text
http://localhost:5000/uploads/image-name
```

## Future Improvements

- Real-time chat using Socket.io
- Email notifications
- Google Maps location support
- Password reset
- Admin user management
- Better matching algorithm
- Analytics dashboard
- Deployment to Render/Vercel
- Payment/token system

