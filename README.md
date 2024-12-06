
# Fintech App

## Overview
The Fintech App is a web application designed to manage tasks and user accounts. It utilizes Node.js with Express for the backend, MySQL for the database, and serves a simple HTML frontend. This application allows users to create accounts and manage tasks efficiently.

## Features
- User creation with validation
- Task management (create and read tasks)
- RESTful API for interacting with user and task data
- Static file serving for the frontend

## Technologies Used
- **Node.js**: JavaScript runtime for building the backend
- **Express**: Web framework for Node.js
- **MySQL**: Relational database for storing user and task data
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

3. Create a `.env` file in the root directory and add your database configuration:
   ```plaintext
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_PORT=3306
   PORT=2555
   ```

### Running the Application
To start the application, run:
```bash
npm start
```
This command will use Nodemon to start the server and watch for file changes.

### API Endpoints
- **POST /tasks**: Create a new task
- **GET /tasks**: Retrieve all tasks
- **GET /status**: Check if the server is running

### Project Structure
```
fintech-app/
│
├── backend/
│   ├── db.js                # Database connection setup
│   ├── server.js            # Main server file
│   ├── modules/             # Contains user and task related modules
│   │   ├── validateTask.js  # User creation logic
│   │   ├── SetRoutes.js     # API route setup
│       └── ETC              # The rest of the modules we use will be placed here
│
├── .env                     # Environment variables
├── package.json             # Project metadata and dependencies
└── README.md                # Project documentation
```

## Contributing
Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


### Notes
- Replace `yourusername` in the clone command with your actual GitHub username.
- Ensure that the `.env` file contains the correct database credentials.
- Adjust any sections as necessary to fit your specific project details or requirements.
