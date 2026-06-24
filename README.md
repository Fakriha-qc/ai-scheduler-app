# AI Smart Scheduler

## Description

AI Smart Scheduler is a full-stack web application that helps users create organized schedules using Google's Gemini AI API.

Users can create an account, sign in securely, enter their tasks, available time, and deadlines, and receive an AI-generated schedule. Generated schedules are stored in a database and can be viewed later on the dashboard.

---

## Features

### Authentication

* User Sign Up
* User Sign In
* Password Hashing with bcrypt
* Session-based Authentication
* Protected Routes

### AI Scheduling

* Generate schedules using Google Gemini API
* Enter tasks, available time, and deadlines
* Receive an AI-generated study/work plan

### Database

* User information stored in SQLite
* Schedule history saved in database
* View previous schedules
* Delete saved schedules

### Frontend

* Responsive Design
* Dashboard Interface
* Schedule Creation Page
* Login and Registration Pages

### Deployment

* Hosted on Render
* Publicly accessible web application

---

## Technologies Used

### Frontend

* HTML
* CSS
* EJS

### Backend

* Node.js
* Express.js

### Database

* SQLite

### Authentication

* bcrypt
* express-session

### AI API

* Google Gemini API

### Deployment

* Render

---

## API Used

Google Gemini API

Purpose:

* Generate intelligent schedules based on user input.

---

## Database Schema

### Users Table

| Field    | Type                              |
| -------- | --------------------------------- |
| id       | INTEGER PRIMARY KEY AUTOINCREMENT |
| username | TEXT                              |
| email    | TEXT UNIQUE                       |
| password | TEXT                              |

### Schedules Table

| Field       | Type                              |
| ----------- | --------------------------------- |
| id          | INTEGER PRIMARY KEY AUTOINCREMENT |
| user_id     | INTEGER                           |
| task_input  | TEXT                              |
| ai_schedule | TEXT                              |
| created_at  | TEXT                              |

---

## Routes

### Authentication Routes

GET /signup

POST /signup

GET /signin

POST /signin

GET /logout

### Application Routes

GET /dashboard

GET /schedule

POST /schedule

POST /delete/:id

---

## How to Run Locally

### 1. Clone Repository

```bash
git clone https://github.com/Fakriha-qc/ai-scheduler-app.git
cd ai-scheduler-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create .env File

Create a file named `.env` in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
SESSION_SECRET=mysecret123
PORT=3000
```

### 4. Start Application

```bash
npm run dev
```

### 5. Open Browser

```text
http://localhost:3000
```

---

## Deployment

The application is deployed on Render.

Deployed App URL:

https://ai-scheduler-app.onrender.com

---

## Test Account

Username: Test User

Email: [test@example.com](mailto:test@example.com)

Password: Test123!

---

## Project Structure

```text
ai-scheduler-app
│
├── app.js
├── database.js
├── package.json
├── README.md
│
├── public
│   └── style.css
│
└── views
    ├── signup.ejs
    ├── signin.ejs
    ├── dashboard.ejs
    └── schedule.ejs
```

---

## Notes

This project was developed as a full-stack web application for Project 2.

The application integrates Google's Gemini API to generate schedules. On rare occasions, Google may return a temporary "503 High Demand" response when their model is under unusually heavy load. In such cases, generating the schedule again after a short wait typically resolves the issue.
