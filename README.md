# Fintech App
![Vercel Deploy](https://deploy-badge.vercel.app/vercel/fintech-app-blond?style=flat-square&logo=Site)

## Overview
The Fintech App is a modern web application designed for personal finance management. Built with Node.js and Express, it leverages PostgreSQL on Neon Tech for cloud database storage, providing a reliable and scalable solution for managing financial transactions. The application features a clean, user-friendly interface built with EJS templates and modern CSS.

## Features
- Secure user authentication and session management
- Personal financial transaction tracking
- Dashboard with transaction history
- Responsive design for mobile and desktop use
- Flash messages for user feedback
- Cloud-based PostgreSQL database for reliable data storage

## Technologies Used
- **Backend**: Node.js with Express
- **Database**: PostgreSQL (hosted on Neon Tech)
- **Template Engine**: EJS
- **Authentication**: JWT and Session-based auth
- **CSS Framework**: Modern CSS with responsive design
- **Deployment**: Vercel
- **Other Tools**: 
  - `method-override` for RESTful methods
  - `connect-flash` for user notifications
  - `express-session` for session management

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn package manager
- A Neon Tech account for PostgreSQL database

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AD-Archer/fintech-app.git
   cd fintech-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables by creating a `.env` file:
   ```plaintext
   PORT=2555
   JWT_SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret
   DATABASE_URL=your_neon_tech_postgres_url
   ```

   Replace `your_neon_tech_postgres_url` with your actual Neon Tech PostgreSQL connection string.

### Running the Application
Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### Key Routes
- **/** - Landing page
- **/dashboard** - Main transaction dashboard (requires authentication)
- **/auth/login** - User login
- **/auth/register** - New user registration
- **/transactions** - Transaction management

### Project Structure
```
fintech-app/
│
├── config/
│   └── db.js              # Database configuration
├── middleware/
│   └── auth.js            # Authentication middleware
├── models/
│   ├── DatabaseCreation.js # Database models
│   └── UserCreation.js    # User model logic
├── public/
│   ├── css/              # Stylesheets
│   └── js/               # Client-side JavaScript
├── routes/
│   ├── auth.js           # Authentication routes
│   └── transactions.js   # Transaction routes
├── views/
│   └── pages/            # EJS templates
├── server.js             # Main application file
└── .env                  # Environment variables
```

## Database Setup
This application uses Neon Tech's PostgreSQL service. To set up your own instance:

1. Create an account at [Neon Tech](https://neon.tech)
2. Create a new project and database
3. Copy your connection string
4. Update your `.env` file with the connection string

## Security Notes
- Never commit your `.env` file
- Keep your JWT_SECRET and SESSION_SECRET secure
- The application uses secure session cookies in production
- Database credentials are managed through environment variables

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License.
