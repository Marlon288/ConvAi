# Conversational AI for Internal Business Processes

This project focuses on developing a conversational AI application to optimize internal business processes and assist employees in their day-to-day operations of using the Enterprise Asset Management (EAM) system, HxGN.

## Features

-   User-friendly chat interface to interact with the AI using natural language
-   Location-based customization to provide relevant information and processes
-   Integration with HxGN documentation for context-specific answers
-   Support for multiple languages
-   Real-time response streaming
-   Admin environment for managing training data and viewing analytics
-   User authentication and access control
-  View, update and delete training data

## Technologies Used

-   Frontend: React
-   Backend: Express.js
-  Conversational AI architecture: Langchain 
-   Conversational AI: OpenAI's GPT-4 API
-   Retrieval-Augmented Generation (RAG)
-   Vector database: CloseVector
-   User authentication: JSON Web Tokens (JWT), bcrypt
-   Testing: React Testing Library, Jest

## Getting Started

1.  Clone the repository
2.  Install dependencies for both frontend and backend
3.  Set up environment variables for API keys
        OPENAI_API_KEY and JWT_SECRET
4.  Start the development server
5.  Access the application through the provided URL

## Documentation
To access the frontend documentation, follow these steps:

1.  Navigate to the `/interactive_documentation/docs/` directory in your project.
2.  Open the `index.html` file in a web browser.

To generate and view the backend API documentation, use the following command:

1.  Open a terminal or command prompt.
2.  Navigate to the `/api` directory of your project.
3.  Run the command: `npm run doc`.
4.  The documentation can be accessed through `http://localhost:443/api-docs/`
