🧠 Ollama Chatbot V3
This project is a version 3 of Ollamachatbot. This application allows users to upload PDF and Excel (.xlsx) files, ask questions about the content, and get intelligent answers using a locally hosted LLM with Ollama.
Changes from previous version:
Updated UI
Users can uploaded PDF and Excel files files for quering and generating responses based on the files.

📋 Features
Chat interface with natural language interaction
Uses LLM (Ollama) for intelligent responses functional with multiple models such as llama2,llama3,phi,phi2,mistral etc.
RESTful API backend using Node.js
React frontend with clean UI
⚙️ Tech Stack
Frontend: React.js
Backend: Node.js (Express)
Database: SQLite
AI/LLM: Ollama (e.g., LLaMA 3,Phi2)
API Testing: Postman / Thunder Client
✅ Prerequisites
Before starting, make sure you have the following installed:

Node.js (v16 or later)
npm (comes with Node.js)
SQLite
Ollama installed locally
Git (for cloning the repo)
Any LLM model (preffered llama3)
NOTE:If working on any environment apart from Macos please verify the .env file and add neccessary IPV4 port.

📦 Installation Steps
1. Clone the Repository
git clone https://github.com/abhijitbiswal1902/OllamaChatbot3
cd ollama-chatbot

2. Set Up the Backend
bash
Copy
Edit
cd backend
npm install

3. Set Up the Frontend
bash
Copy
Edit
cd ../frontend
npm install

4. Start the Ollama Model
bash
Copy
Edit
ollama run llama3

5. Start the Backend Server
bash
Copy
Edit
cd ../backend
npm run dev


6. Start the Frontend React App
bash
Copy
Edit
cd ../frontend
npm start

7. Access the App
Open your browser and go to:
http://localhost:3000
