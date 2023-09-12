# Buzz
## Full-Stack Social Media Website
## Features

- Buzz is a Twitter-inspired networking website
- Users can **create, like, comment on, delete** posts
- Users can **create, follow, search, view** profiles
- Users can **view** a news feed or following users page

## Tech

Buzz uses the MERN stack

- Mongoose/MongoDB - Database
- ExpressJS - Backend Web Server
- ReactJS - Frontend Web Application
- Supertest and Jest - Unit & Integration Testing
- Amazon Web Services EC2 / Netlify - Hosting
- Redis - Rate Limiting
- NGINX - Load Balancing & Health Checks

I used the MERN stack since I wanted to learn backend/databases, and I had previous experience with javascript using ReactJS. As for testing, rate limiting, and load balancing, I read about those topics in a book and wanted to implement them into this project.

## Installation

Buzz requires [Node.js](https://nodejs.org/) and NPM (node package manager) to run.

Install the dependencies, setup the .env file, and start the server.

```
cd backend
create a .env file
have values for PORT, MONGO_URI (link to mongo atlas database), SECRET (for JWT token)
npm install
node run dev
```

Install the dependencies, setup the .env file, and start the frontend webapp

```
cd frontend
create a .env file
have value for BACKEND_API (link to API)
npm install
npm start
```
## License

MIT

**Enjoy! Feel free to contact me if you have any questions/suggestions: https://www.linkedin.com/in/braydentam/**
