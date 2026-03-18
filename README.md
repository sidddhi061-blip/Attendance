# HRMS Lite - Attendance & Employee Management System

A modern, full-stack Human Resource Management System (HRMS) Lite application designed for efficient employee tracking and attendance management.

## 🚀 Project Overview
HRMS Lite provides a streamlined interface for administrators to manage their workforce, track attendance cycles, and maintain employee records. The system features a real-time dashboard with key metrics and a responsive design for various devices.

## 🛠 Tech Stack

### Frontend
- **React 18** (with TypeScript)
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)
- **Axios** (API Client)
- **React Router Dom** (Routing)
- **React Hot Toast** (Notifications)

### Backend
- **FastAPI** (Python Web Framework)
- **SQLAlchemy** (ORM)
- **SQLite** (Local Database) / **PostgreSQL** (Production)
- **Uvicorn** (ASGI Server)
- **Pydantic** (Data Validation)

## 📋 Features
- **Dashboard**: Real-time stats for total employees, attendance percentage, and active cycles.
- **Employee Management**: Add, view, and delete employees with a modern grid interface.
- **Attendance Tracking**: Mark and view attendance records for any date.
- **Responsive Design**: Fully functional on mobile, tablet, and desktop.
- **Cloud Ready**: Configured for Vercel (Frontend) and Render (Backend).

## 💻 Steps to Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8001
   ```
   *The API will be available at http://localhost:8001*

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The application will be available at http://localhost:5173*

## 📝 Assumptions & Limitations
- **Authentication**: This version (Lite) assumes internal use and does not currently implement a login/auth system.
- **Database**: Uses SQLite locally for simplicity; PostgreSQL is recommended and configured for production via environment variables.
- **Storage**: Employee data and attendance records are stored in a relational database. Images (if added) are assumed to be hosted externally or via URL strings.

## 🚀 Deployment
- **Frontend**: Optimized for [Vercel](https://vercel.com).
- **Backend**: Configured for [Render](https://render.com) using the provided `render.yaml` blueprint.

---
Developed by [Siddhi Mishra](https://github.com/sidddhi061-blip)
