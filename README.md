📝 Notes App

A simple and modern Note-Taking App built with MERN stack (MongoDB, Express, React, Node.js).
It allows users to create, edit, delete, and manage notes with authentication support.

📌 Features

✅ User Authentication (Signup/Login)
✅ Create, Edit, and Delete Notes
✅ Store Notes securely in MongoDB
✅ Responsive UI with Tailwind CSS
✅ Organized folder structure for easy development

🛠 Tech Stack
Frontend

React (Vite + TypeScript)

Tailwind CSS

React Router

Backend

Node.js + Express

MongoDB (Mongoose)

Zod for validation

JWT + bcrypt for authentication

⚡ Project Structure
notes-app/
├── backend/        # Express + MongoDB API
│   ├── src/
│   │   ├── config/      # MongoDB connection
│   │   ├── routes/      # API routes (auth, notes)
│   │   ├── models/      # Mongoose models
│   │   ├── middleware/  # Auth, error handler
│   │   └── server.ts    # Express server
│   └── package.json
│
├── frontend/      # React + Vite + Tailwind app
│   ├── src/
│   │   ├── pages/       # Login, Signup, Notes
│   │   ├── components/  # UI Components (NoteCard, Navbar, etc.)
│   │   ├── routes.tsx   # Routing
│   │   └── App.tsx
│   └── package.json
│
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/iashutoshyadav/Noteapp
cd notes-app

2️⃣ Backend Setup
cd backend
npm install
cp .env.example .env   # Add your keys
npm run dev

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
