# PromptSlide: Automated AI-Powered Presentation Generator

PromptSlide is an innovative tool that transforms text prompts into complete PowerPoint presentations using AI. It's designed for users who want to save time and generate high-quality slides automatically with just a few inputs.

---

## ✨ Features

- **AI-Powered Slide Generation** – Just type your topic, and PromptSlide creates a full PPT.
- **Simple and Clean Interface** – User-friendly frontend made with modern UI.
- **Download Presentations** – You can download the PPT in `.pptx` format.
- **Supports Local Setup** – Backend can be run locally to enable full features.

---

## 🚀 Live Frontend

The frontend is deployed on Vercel. You can check it out here:

🔗 **[Live Website](https://promptslide.vercel.app)**

> ⚠️ **Note**: The backend is not hosted because it uses heavy libraries like `python-pptx`, `faiss` and `langchain_groq`.  
> To use all features, clone the project and run it locally.

---

## 🛠️ Local Setup

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.7 or higher)
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/Dileep01712/PromptSlide.git
cd PromptSlide
```

---

### 2. Setup Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend server will run at `http://localhost:8000`

> ℹ️ This project uses **Prisma** for database management. To view the database in a browser UI:

```bash
npx prisma studio
``` 

---

### 3. Setup Frontend

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at `http://localhost:5173`

---

## 📃 License

This project is licensed under the [MIT License](LICENSE).
