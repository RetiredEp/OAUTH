

# User Authentication with OAuth

This project is a user authentication application built with Node.js. It implements user verification using Passport.js with Google OAuth and local strategy. User passwords are securely hashed using bcrypt, and important details are stored in environment variables for security.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Routes](#routes)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Features

- User registration and login with local strategy
- Google OAuth authentication
- Secure password storage with bcrypt
- Environment variables for sensitive information
- Basic session management with express-session

## Technologies Used

- Node.js
- Express.js
- Passport.js
  - Google OAuth strategy
  - Local strategy
- Bcrypt for password hashing
- PostgreSQL for database
- dotenv for environment variable management

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/your-oauth-project.git
   cd your-oauth-project
   ```

2. **Install dependencies**:

   Make sure you have Node.js installed. Then run:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory of the project and add the following variables:

   ```plaintext
   DB_USER=your_database_user
   DB_PASS=your_database_password
   DB_NAME=your_database_name
   DB_HOST=your_database_host
   DB_PORT=your_database_port
   SESSION_SECRET=your_session_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Set up your PostgreSQL database**:

   Make sure to create a PostgreSQL database and a `users` table with the following structure:

   ```sql
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       email VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL
   );
   ```

5. **Run the application**:

   Start the application with:

   ```bash
   node index.js
   ```

   The application will be running on `http://localhost:3000`.

## Routes

- **GET /**: Render the home page.
- **GET /register**: Render the registration page.
- **POST /register**: Handle user registration.
- **GET /login**: Render the login page.
- **POST /login**: Handle user login via Passport.js.
- **GET /batman**: Render the authenticated page after successful login.
- **GET /auth/google**: Initiate Google OAuth login.
- **GET /auth/google/callback**: Handle the callback after Google authentication.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Passport.js](http://www.passportjs.org/) for authentication middleware.
- [Bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing.
- [Express](https://expressjs.com/) for building the web server.
- [PostgreSQL](https://www.postgresql.org/) for the database.

