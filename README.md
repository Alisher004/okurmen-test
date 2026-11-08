<div align="center">

# Test Okurmen

### Online entrance testing for students and administrators

A bilingual assessment platform for managing entrance tests, guiding students through test attempts, and reviewing results from an administrator workspace.

[![Live app](https://img.shields.io/badge/Live%20App-Open-1D4ED8?style=for-the-badge&logo=vercel&logoColor=white)](https://test-okurmen.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-111111?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[Open the application](https://test-okurmen.vercel.app) · [Report an issue](https://github.com/Alisher004/okurmen-test/issues)

</div>

---

## Overview

**Test Okurmen** is an online testing application built to support entrance assessments for the Okurmen educational organization. Students can create an account, access available tests, submit answers, and review their results. Administrators can manage tests and review student attempts.

The interface supports **Russian and Kyrgyz**. The project uses Next.js App Router, a PostgreSQL database accessed through Prisma, and credential-based authentication with role-aware student and administrator areas.

## Capabilities

### Student experience

- Register and sign in with an email and password
- View available tests in a student dashboard
- Take tests with multiple-choice and written-response questions
- Submit answers and review test results
- See scores for automatically evaluated multiple-choice answers; written responses can be reviewed by an administrator

### Administration

- Access a protected administrator area
- Create, update, activate, and deactivate tests
- Organize questions and answer options
- Review student attempts and submitted answers

### Platform

- Russian and Kyrgyz interface translations
- Role-based access for students and administrators
- Relational data model for users, tests, questions, attempts, and answers
- Responsive interface built with Tailwind CSS

## Technology

| Area | Technologies |
| --- | --- |
| Application framework | Next.js 16 App Router, React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Authentication | NextAuth.js 5 (beta), Credentials |
| Database | PostgreSQL, Prisma ORM |
| Password hashing | bcryptjs |
| UI utilities | Lucide React, React Markdown |
| Deployment | Vercel |

## Getting started

### Prerequisites

- Node.js (20 or later recommended)
- npm
- A PostgreSQL database (local or hosted)

### 1. Clone and install

```bash
git clone https://github.com/Alisher004/okurmen-test.git
cd okurmen-test
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
AUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

Use your own database connection and a securely generated secret. Do not commit `.env` files, production credentials, or database passwords. For Vercel-specific setup, see [`VERCEL_SETUP.md`](./VERCEL_SETUP.md).

### 3. Prepare the database

For a local development database with migrations:

```bash
npx prisma migrate dev
npx prisma generate
```

For an already-provisioned production database, apply committed migrations with:

```bash
npx prisma migrate deploy
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create the production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Generate the Prisma Client |
| `npx prisma migrate dev` | Create/apply development migrations |
| `npx prisma migrate deploy` | Apply migrations in deployment environments |

## Project structure

```text
okurmen-test/
├── prisma/                  # Prisma schema and database migrations
├── public/                  # Static assets
├── scripts/                 # Project utility scripts
└── src/
    ├── app/                 # Next.js App Router pages and API routes
    │   ├── admin/           # Administrator workspace
    │   ├── api/              # Server API endpoints
    │   ├── dashboard/        # Student dashboard
    │   ├── login/            # Student sign-in
    │   ├── register/         # Student registration
    │   ├── test/             # Test-taking flow
    │   └── my-results/       # Student results
    ├── components/          # Shared UI and feature components
    ├── contexts/            # React contexts, including language state
    ├── lib/                 # Authentication, database, and translations
    └── types/               # Shared TypeScript types
```

## Deployment

The application is deployed on [Vercel](https://test-okurmen.vercel.app). Configure the production environment variables and PostgreSQL database before deploying. Apply database migrations during release with `npx prisma migrate deploy`.

See [`VERCEL_SETUP.md`](./VERCEL_SETUP.md) for the repository's deployment notes.

## Contributing

Bug reports and focused improvements are welcome. Open an issue to describe a larger change, then submit a pull request with a concise summary and relevant verification steps.

Before opening a pull request, run:

```bash
npm run lint
npm run build
```

## Security and privacy

Never commit passwords, database connection strings, authentication secrets, or real student records. Use environment variables for secrets and restrict production database access to trusted services. Since this application handles student accounts and assessment results, review access controls and applicable privacy requirements before using it with real student data.

## License

No license file is currently included. Unless a license is added, all rights remain with the copyright holder and reuse is not automatically permitted.
