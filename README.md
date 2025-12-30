# LearnCorp Website - Developer Guide

This repository contains the source code for the **LearnCorp** website, a premium IT Solutions & Training platform.

## 🚀 Quick Start

### 1. Frontend (Static Site)
Simply open `index.html` in your browser to view the website.
- **Features**: Responsive design, Tech Prime aesthetic, Services grid, Contact UI.

### 2. Backend (API & Database)
To make the Contact Form functional, you need to run the Node.js server.

**Prerequisites:**
- [Node.js](https://nodejs.org/) installed.
- [MongoDB](https://www.mongodb.com/) installed and running locally (`mongodb://localhost:27017`).

**Steps:**
1.  Navigate to the server folder:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    npm start
    ```
    (Server will run on `http://localhost:5000`)

Once the server is running, the Contact Form on the website will successfully send data to your local MongoDB database.

## 📁 Project Structure

```
/Learncorp website
├── index.html        # Main landing page
├── style.css         # "Tech Prime" Theme & Styles
├── script.js         # Interactivity & API Logic
└── server/           # Backend API
    ├── server.js     # Express App & Mongoose Models
    └── package.json  # Backend Dependencies
```

## 🎨 Design System
- **Primary Color**: Emerald Green (`#10b981`)
- **Background**: Midnight Blue (`#020617`)
- **Font**: Inter (Body) & Space Grotesk (Headings)

&copy; 2025 LearnCorp IT Solutions.
