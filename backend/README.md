# Backend Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hope_of_tomorrow

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (optional for future auth)
JWT_SECRET=your_jwt_secret_key_here
```

## Setup Instructions

### 1. Install PostgreSQL

**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Install and remember your password
- Create a database: `hope_of_tomorrow`

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu):**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### 2. Create Database

```bash
psql -U postgres
CREATE DATABASE hope_of_tomorrow;
\q
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Start Backend Server

```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Users
- `GET /api/users/:id` - Get user profile
- `POST /api/users` - Create/update user profile

### Donations
- `GET /api/donations` - Get all donations
- `POST /api/donations` - Create donation
- `GET /api/donations/stats` - Get donation statistics

### Job Applications
- `GET /api/job-applications` - Get all applications
- `POST /api/job-applications` - Submit job application
- `PATCH /api/job-applications/:id` - Update application status

### Volunteers
- `GET /api/volunteers` - Get all volunteer applications
- `POST /api/volunteers` - Submit volunteer application
- `PATCH /api/volunteers/:id` - Update volunteer status

### Job Postings
- `GET /api/jobs` - Get all open job postings
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create job posting

### Health Check
- `GET /api/health` - Check if backend is running

## Frontend Integration Example

```javascript
// Create donation
async function createDonation(donationData) {
  const response = await fetch('http://localhost:5000/api/donations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donationData)
  });
  return response.json();
}

// Get volunteer applications
async function getVolunteerApplications() {
  const response = await fetch('http://localhost:5000/api/volunteers');
  return response.json();
}
```
