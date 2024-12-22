# Fintech App
![Vercel Deploy](https://deploy-badge.vercel.app/vercel/fintech-app-blond?style=flat-square&logo=Site)
## Overview
The Fintech App is a web application designed to manage tasks and user accounts. It utilizes Node.js with Express for the backend, MySQL for the database, and serves a simple HTML frontend. This application allows users to create accounts, manage tasks efficiently, and includes secure user authentication.

## Features
- User creation with validation
- JWT-based authentication for secure access
- Task management (create and read tasks)
- RESTful API for interacting with user and task data
- Static file serving for the frontend

## Technologies Used
- **Node.js**: JavaScript runtime for building the backend
- **Express**: Web framework for Node.js
- **MySQL**: Relational database for storing user and task data
- **Sequelize**: ORM for MySQL
- **jsonwebtoken**: For JWT-based authentication
- **dotenv**: Module for loading environment variables
- **Nodemon**: Development tool for automatically restarting the server on file changes

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MySQL (v5.7 or later)
- A package manager like npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fintech-app.git
   cd fintech-app
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory of the backend folder and add your database configuration:
   ```plaintext
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_PORT=3306
   PORT=2555
   JWT_SECRET=your_jwt_secret  # Secret for JWT
   ```

### Running the Application
To start the application, run:
```bash
npm start
```
This command will use Nodemon to start the server and watch for file changes.

### API Endpoints
- **POST /auth/register**: Register a new user
- **POST /auth/login**: Authenticate user and return a JWT
- **GET /auth/logout**: Logout the user and clear the session
- **POST /tasks**: Create a new task
- **GET /tasks**: Retrieve all tasks
- **GET /status**: Check if the server is running

### Project Structure
```
fintech-app/
│
├── backend/
│   ├── config/
│   │   └── db.js                # Database connection setup
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── models/
│   │   ├── DatabaseCreation.js   # User and Transaction models
│   │   └── UserCreation.js       # User creation logic
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   └── route.js              # Task-related routes
│   ├── server.js                 # Main server file
│   └── validateTask.js           # Task validation logic
│
├── .env                          # Environment variables
├── package.json                  # Project metadata and dependencies
└── README.md                     # Project documentation
```

## Contributing
Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Notes
- Replace `yourusername` in the clone command with your actual GitHub username.
- Ensure that the `.env` file contains the correct database credentials and JWT secret.
- Adjust any sections as necessary to fit your specific project details or requirements.
