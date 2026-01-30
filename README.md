# 🇮🇳 eSeva India (QueueSmart)

**eSeva India** is a modern, full-stack queue management and appointment booking system designed to streamline access to essential government services (Aadhaar, PAN, Passport, etc.) and healthcare facilities. It features real-time queue tracking, secure OTP verification, and a powerful admin dashboard for dynamic slot management.

---

## 🚀 Key Features

### 👤 User Portal
- **Instant Booking**: Select services like Aadhaar Update, PAN Card, or Driving License.
- **Real-Time Tracking**: Watch your token number move up the queue live (powered by Socket.io).
- **OTP Verification**: Secure "Instant Service" access (e.g., status checks) via simulated OTP.
- **My Dashboard**: View and cancel waiting appointments.

### 🛡️ Admin Dashboard
- **Live Queue Monitoring**: See who is currently being served in every department.
- **Slot Management**: Dynamically **Add**, **Delete**, and **Update** time slots for any service.
- **Queue Control**: "Next Patient" button to advance the queue instantly.
- **Master List**: View and manage all appointments in the system.

### 🎨 Branding & UI
- **Government Standard**: Clean, high-contrast "eSeva India" branding with Indian Flag integration.
- **Responsive Design**: Glassmorphism UI built with pure CSS and React.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), React Router, Axios, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Real-Time**: Socket.io.
- **Database**: Custom In-Memory MockDB (Simulates MongoDB features for easy setup/demo).
- **Auth**: JWT (JSON Web Tokens).

---

## 📦 Setup Instructions

### 1. Prerequisites
- Node.js installed (v14+ recommended).

### 2. Backend Setup
The backend runs on port **5001**.
```bash
cd backend
npm install
node server.js
```
*Note: The server uses an in-memory database. Data resets when the server restarts.*

### 3. Frontend Setup
The frontend runs on Vite (default port **5173** or **5174**).
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Default Credentials

### Admin Login
- **Email**: `admin@eseva.in`
- **Password**: `admin123`

### User Login (Demo)
- **Email**: `user@test.com`
- **Password**: `user123`
*(Or register a new user easily via the text link)*

---

## 📸 Usage Highlights

- **Booking**: Go to "Book Now", pick "Aadhaar Service", select a slot (e.g., 9:00 AM), and confirm.
- **Admin**: Log in as Admin -> "Manage Slot Timings" -> Add a new slot (e.g., 04:00 PM - 06:00 PM) -> See it appear instantly in the Booking page.
- **Instant Service**: Go to "Book Now" -> "Check PAN Status" -> Enter OTP (`123456` by default or check console) -> Verify.

---

&copy; 2026 eSeva India project.
