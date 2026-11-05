# Student Management System - Frontend

A modern, responsive React + Vite frontend for the Student CRUD REST API built with Spring Boot.

## Features
- **Full CRUD Capabilities:**
  - **Create:** Add new students with field validation (`firstname`, `lastname`, `course`, `section`).
  - **Read:** View all students with automatic loading states and total student counters.
  - **Update:** Edit existing student details in place with pre-filled forms.
  - **Delete:** Safe deletion with confirmation modal dialogs.
- **Search & Filter:** Real-time search filtering across names, courses, and sections.
- **Vite Proxy:** Configured in `vite.config.js` to eliminate CORS issues during development.
- **Icons & Polish:** Built with `lucide-react` icons and a clean, responsive layout.

## Prerequisites
- Node.js (v18+)
- Spring Boot Backend running on `http://localhost:8080`

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or the port displayed in your terminal).

### 3. Build for Production
```bash
npm run build
```

## Backend API Endpoints (Proxied to http://localhost:8080)
- `GET /santos/students` - Retrieve all students
- `GET /santos/students/{id}` - Retrieve student by ID
- `POST /santos/students` - Create student
- `PUT /santos/students/{id}` - Update student
- `DELETE /santos/students/{id}` - Delete student
