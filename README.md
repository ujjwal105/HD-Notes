# HD Notes

A modern, full-stack notes application with OTP-based authentication, built with React (Vite) frontend and Node.js/Express backend.

---

## 🌐 Hosted URLs

- **Frontend:** [https://highdelite-notes-app.netlify.app](https://highdelite-notes-app.netlify.app)
- **Backend:** [https://hd-notes.onrender.com](https://hd-notes.onrender.com)

---

## 📝 What is HD Notes?

HD Notes is a secure, user-friendly web app for creating, managing, and organizing notes. It features OTP-based authentication, a modern UI, and works seamlessly across devices.

---

## 🚀 How to Run the Project Locally

### 1. Clone the Repository

```bash
git clone <repository-url>
cd HD-Notes
```

### 2. Set Up the Backend

```bash
cd backend
npm install
cp .env.example .env   # Edit .env with your config (MongoDB URI, email, etc.)
```

- Make sure MongoDB is running locally or update the URI in `.env` for a remote database.

**Start the backend:**

```bash
npm run dev    # For development (auto-reloads)
# or
npm start      # For production
```

The backend will run by default on `http://localhost:4000` (or as set in your `.env`).

### 3. Set Up the Frontend

Open a new terminal window/tab:

```bash
cd Frontend
npm install
```

**Start the frontend:**

```bash
npm run dev
```

The frontend will run by default on `http://localhost:5173`.

---

## 🛠️ Project Structure

- `backend/` — Node.js/Express API, MongoDB, authentication, notes logic
- `Frontend/` — React (Vite), modern UI, API integration

---

## 🔗 Useful Links

- **Frontend (Live):** [https://highdelite-notes-app.netlify.app](https://highdelite-notes-app.netlify.app)
- **Backend (Live):** [https://hd-notes.onrender.com](https://hd-notes.onrender.com)

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Commit and push
5. Open a pull request

---

