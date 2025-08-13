# NexusChatAI - Real-Time AI Chat Application

This is a modern, full-stack chat application designed for seamless, real-time conversations with an intelligent AI assistant. The project is built with a secure, scalable, and modern architecture, leveraging a powerful combination of React, GraphQL, and serverless technologies.

---

## 🔗 Deployed Link

You can access the live application here:
**[https://nexuschatai.netlify.app/](https://nexuschatai.netlify.app/)** 

---

## 🛠️ Tech Stack & Architecture

This project follows a modern, decoupled architecture that separates the frontend from the backend logic, ensuring security and maintainability.

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js | For building a fast and interactive component-based UI. |
| | Apollo Client | For managing all communication with the backend via GraphQL queries, mutations, and real-time subscriptions. |
| **Backend** | Nhost | A versatile Backend-as-a-Service (BaaS) platform providing the database, GraphQL API, and authentication. |
| | PostgreSQL | A robust relational database for storing user, chat, and message data. |
| | GraphQL (Hasura) | A high-performance, real-time API layer over the database with a powerful role-based permission system. |
| **Authentication** | Nhost Auth | Handles secure, JWT-based user sign-up and sign-in. |
| **Chatbot Logic**| n8n.io | An automation workflow platform that orchestrates the AI response generation. |
| | Hasura Actions | Provides a secure webhook to trigger the n8n workflow from the frontend. |
| | OpenRouter | An API service that provides access to various large language models for the AI's responses. |

---

## ⚙️ Architectural Workflow

The application's real-time functionality is achieved through a clean and secure workflow:

1.  **User Sends a Message**: The React frontend executes two GraphQL mutations simultaneously:
    * `insert_messages_one`: Instantly saves the user's message to the database for a snappy UI experience.
    * `sendMessage`: Calls the custom Hasura Action to trigger the bot.
2.  **Hasura Action Trigger**: The `sendMessage` action securely calls a pre-configured webhook URL, passing the chat ID and the user's message to an n8n workflow.
3.  **n8n Workflow Execution**:
    * The n8n workflow receives the data from the webhook.
    * It makes an API call to OpenRouter, sending the user's message to get an AI-generated response.
    * It then sends another GraphQL mutation back to Hasura to save the bot's response to the `messages` table.
4.  **Real-Time UI Update**:
    * The React frontend maintains an active GraphQL subscription to the `messages` table.
    * As soon as the n8n workflow saves the bot's message to the database, the subscription receives the new data, and the UI updates in real-time to display the bot's reply without needing a page refresh.

---

## 🚀 Getting Started

To run this project on your local machine, follow these steps.

### **Prerequisites**

* [Node.js](https://nodejs.org/) (v16 or later) and npm
* A [Nhost](https://nhost.io) account
* An [n8n.io](https://n8n.io) account
* An [OpenRouter.ai](https://openrouter.ai) account for an API key

### **1. Backend Setup (Nhost & n8n)**

1.  **Create a Nhost Project**: Set up a new project on Nhost and save your **Subdomain** and **Region**.
2.  **Define Schema in Hasura**:
    * In the Hasura console provided by Nhost, create the `chats` and `messages` tables.
    * Set up the foreign key relationships: `messages.chat_id -> chats.id` and `chats.user_id -> auth.users.id`.
    * Configure **Row-Level Permissions** for the `user` role on both tables to ensure users can only access their own data.
3.  **Create a Hasura Action**:
    * Create a `sendMessage` action and configure it to trigger your n8n webhook URL.
    * Set its permissions to only be accessible by the `user` role.
4.  **Set up the n8n Workflow**:
    * Create a workflow that starts with a Webhook trigger.
    * Add an "HTTP Request" node to call the OpenRouter API (using your API key as a secure credential).
    * Add another "HTTP Request" node to send a GraphQL mutation back to Hasura to save the bot's response. This node will need your Hasura Admin Secret.
    * Add a "Respond to Webhook" node to send the final reply back to the application.

### **2. Frontend Setup**

1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/your-username/my-chatbot-ui.git](https://github.com/your-username/my-chatbot-ui.git)
    cd my-chatbot-ui
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Create an Environment File**:
    * In the root of the project, create a file named `.env`.
    * Add your Nhost project details to this file. This is used for local development.
    ```
    REACT_APP_SUB_DOMAIN=your-nhost-subdomain
    REACT_APP_REGION=your-nhost-region
    ```

4.  **Run the Development Server**:
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:3000`.

---

## 🚢 Deployment

This application is configured for easy deployment on **Netlify**.

1.  Push your project to a GitHub repository.
2.  Import the repository into Netlify.
3.  In your Netlify site's settings (**Build & deploy -> Environment**), add the same environment variables as in your `.env` file:
    * `REACT_APP_SUB_DOMAIN`
    * `REACT_APP_REGION`
4.  Trigger a deploy. Netlify will automatically build and host your application.

