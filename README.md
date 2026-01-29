# 📝 BlogAI - Full-Stack Blog Platform with AI Summarization

A modern full-stack blog platform built with React, Node.js, Express.js, and MongoDB, featuring AI-powered blog summarization using Google Gemini API.

## ✨ Features

- **User Authentication** - JWT-based secure login and registration
- **Blog CRUD** - Create, read, update, and delete blog posts
- **AI Summarization** - One-click blog summary generation using Google Gemini
- **Modern UI** - Dark mode, glassmorphism, smooth animations
- **Responsive Design** - Mobile-first approach
- **Search & Filter** - Find blogs by keywords or tags
- **Pagination** - Efficient blog listing

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- React Router v6
- Axios
- CSS3 (Custom dark theme)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Google Generative AI SDK

## 📁 Project Structure

```
BLOG_PLATFORM/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth & error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── .env            # Environment variables
│   └── server.js       # Entry point
│
├── frontend/
│   └── src/
│       ├── components/ # Reusable UI components
│       ├── context/    # React Context (Auth)
│       ├── pages/      # Page components
│       ├── services/   # API service
│       └── App.jsx     # Main app with routing
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API Key

### 1. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your values:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A secure random string
# - GEMINI_API_KEY: Your Google Gemini API key

# Start server
npm run dev
```

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Blogs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs` | Get all blogs |
| GET | `/api/blogs/:id` | Get single blog |
| POST | `/api/blogs` | Create blog (auth) |
| PUT | `/api/blogs/:id` | Update blog (auth) |
| DELETE | `/api/blogs/:id` | Delete blog (auth) |
| GET | `/api/blogs/my-blogs` | Get user's blogs (auth) |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/summarize` | Generate AI summary (auth) |

## 🔐 Environment Variables

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blog_platform
JWT_SECRET=your-super-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

## 📸 Screenshots

The application features:
- Modern dark theme with gradient accents
- Glassmorphism UI elements
- Smooth hover animations
- AI-powered summary generation
- Responsive design for all devices

## 📄 License

MIT
