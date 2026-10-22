# SkillBridge Backend

Express + MongoDB backend for the SkillBridge hackathon project.

## Requirements

- Node.js (LTS)
- npm
- MongoDB local server or MongoDB Atlas account
- VS Code (recommended)

## Setup

1. Open this folder in VS Code.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env`.
4. Edit `.env` and set `MONGO_URI` and a long, unique `JWT_SECRET`.
   - Local MongoDB example: `mongodb://127.0.0.1:27017/skillbridge`
   - Atlas: use your own Atlas connection string and credentials.
5. Start the API:

   ```bash
   npm run dev
   ```

6. In a second terminal, add demo job listings:

   ```bash
   npm run seed
   ```

7. Check `http://localhost:5000/api/health`.

## Demo recruiter

The seed script creates this local demo recruiter if it doesn't exist:

- Email: `demo-recruiter@skillbridge.local`
- Password: `DemoRecruiter123!`

Use only for local development. Do not use preset credentials in production.

## API endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/` | Public | API status |
| GET | `/api/health` | Public | API/database health |
| POST | `/api/auth/register` | Public | Register student or recruiter |
| POST | `/api/auth/login` | Public | Login and get JWT |
| GET | `/api/auth/me` | Bearer token | Current profile |
| GET | `/api/jobs` | Public | Search/list open jobs |
| GET | `/api/jobs/:id` | Public | Read an open job |
| POST | `/api/jobs` | Recruiter/admin | Create a job |
| PATCH | `/api/jobs/:id` | Owner/admin | Update a job |
| DELETE | `/api/jobs/:id` | Owner/admin | Delete a job |
| POST | `/api/applications` | Student | Apply to a job |
| GET | `/api/applications/mine` | Student | List own applications |

### Example registration body

```json
{
  "name": "Demo Student",
  "email": "student@example.com",
  "password": "StudentPass123!",
  "role": "student",
  "skills": ["SQL", "Python", "Excel"],
  "education": "BCA"
}
```

### Example job search

`GET http://localhost:5000/api/jobs?search=analyst&location=Bengaluru`

For protected routes, add header:

`Authorization: Bearer YOUR_JWT_TOKEN`

## Matching Engine integration

The Matching Engine can read candidate skills from `/api/auth/me` and job requirements from `/api/jobs`. Job fields `requiredSkills` and `preferredSkills` are arrays of strings. Agree on the response contract with the Matching Engine teammate before changing these field names.

## Notes

- Seeded job listings are fictional demo data, not verified vacancies.
- `.env` is intentionally excluded from Git.
- This is a hackathon MVP foundation, not production-ready security. Before deployment, add request rate limiting, stronger validation, logging, tests, HTTPS, and a secure token-storage strategy.
