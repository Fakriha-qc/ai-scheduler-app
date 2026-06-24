# AI Smart Scheduler

## Description
AI Smart Scheduler is a full-stack web application that helps users create organized schedules using Google's Gemini AI API. Users can sign up, sign in, enter their tasks, available time, and deadline, and the app generates a personalized schedule.

## Features
- User sign up
- User sign in
- Password hashing with bcrypt
- Session-based login
- Protected dashboard page
- AI schedule generation using Gemini API
- SQLite database
- Saved schedule history
- Delete saved schedules
- Responsive frontend design

## Technologies Used
- Node.js
- Express.js
- EJS
- CSS
- SQLite
- bcrypt
- express-session
- Google Gemini API

## API Used
Google Gemini API

## Database Schema

### users table
- id INTEGER PRIMARY KEY AUTOINCREMENT
- username TEXT
- email TEXT UNIQUE
- password TEXT

### schedules table
- id INTEGER PRIMARY KEY AUTOINCREMENT
- user_id INTEGER
- task_input TEXT
- ai_schedule TEXT
- created_at TEXT

## Routes

### Authentication Routes
- GET /signup
- POST /signup
- GET /signin
- POST /signin
- GET /logout

### Main App Routes
- GET /dashboard
- GET /schedule
- POST /schedule
- POST /delete/:id

## How to Run Locally

1. Install dependencies:
```bash
npm install