# AetherBot

A professional AI chat application with a modern, user-friendly interface.
## view
<img width="1397" height="811" alt="image" src="https://github.com/user-attachments/assets/ab9df858-b127-4167-83b0-5dbb412cb135" />
<img width="1902" height="892" alt="image" src="https://github.com/user-attachments/assets/5953eb4d-54c7-4ca1-a6a2-55fa89b18b3b" />


## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

*   **Node.js** (v18 or higher recommended)
*   **MongoDB** (running locally or a cloud instance like MongoDB Atlas)
*   **Git**

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd AetherBot
    ```

2.  **Install dependencies for Backend:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install dependencies for Frontend:**

    ```bash
    cd ../frontend
    npm install
    ```

### Configuration

1.  **Backend Environment Variables:**

    Create a `.env` file in the `backend` directory with the following keys:

    ```env
    # backend/.env

    PORT=5002
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key_for_jwt
    GROQ_API_KEY=your_groq_api_key
    FRONTEND_URL=http://localhost:5173
    ```

    *   Replace `your_mongodb_connection_string` with your actual MongoDB URI.
    *   Replace `your_secret_key_for_jwt` with a strong random string.
    *   Replace `your_groq_api_key` with your API key from Groq.

2.  **Frontend Environment Variables (Optional):**

    The frontend is pre-configured to connect to `http://localhost:5002/api`. If you need to change this, create a `.env` file in the `frontend` directory:

    ```env
    # frontend/.env

    VITE_API_BASE_URL=http://localhost:5002/api
    ```

### Running the Application

1.  **Start the Backend Server:**

    Open a terminal, verify you are in the `backend` directory, and run:

    ```bash
    npm run dev
    ```

    You should see: `🚀 Server running in development mode on port 5002` and `MongoDB Connected`.

2.  **Start the Frontend Development Server:**

    Open a **new** terminal, navigate to the `frontend` directory, and run:

    ```bash
    cd frontend
    npm run dev
    ```

    You should see `➜  Local:   http://localhost:5173/`.

### Usage

1.  Open your browser and navigate to `http://localhost:5173`.
2.  **Sign Up:** Create a new account using the Signup page.
3.  **Login:** Log in with your new credentials.
4.  **Chat:** Start a new chat, send messages, and view your history in the sidebar. Note that chat history is isolated per user.

## ✨ Features

*   **Modern UI:** Professional off-white theme with a dotted background pattern.
*   **User Isolation:** Chat history is private and secured for each specific user.
*   **Authentication:** Secure Login and Signup functionality.
*   **Responsive Design:** Fully functional on desktop and mobile devices


