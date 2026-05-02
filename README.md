# Tariq ila Al-Jannah - طريق إلى الجنة

An Islamic mobile application for prayer times, athkar (remembrances), and Quran recitation.

## Project Structure

```
tariq-ila-al-jannah/
├── apps/
│   ├── backend/           # NestJS API
│   └── frontend/          # Expo React Native app
├── packages/
│   └── shared/           # Shared TypeScript types and constants
├── docker-compose.yml
├── package.json
├── turbo.json
└── tsconfig.base.json
```

## Tech Stack

### Backend
- **Framework**: NestJS 10
- **Runtime**: Bun 1.1+
- **Database**: PostgreSQL 16
- **ORM**: TypeORM
- **Auth**: JWT + Passport
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React Native (Expo 50)
- **Runtime**: Bun 1.1+
- **Navigation**: Expo Router
- **State**: Zustand
- **Data Fetching**: TanStack Query
- **i18n**: i18next + react-i18next

### Shared
- TypeScript types
- DTOs and constants
- Enums for prayers, athkar categories

## Getting Started

### Prerequisites
- Bun 1.1+
- Docker & Docker Compose

### Setup

1. Install dependencies:
```bash
bun install
```

2. Start database services:
```bash
docker-compose up -d
```

3. Build applications (if using Docker):
To avoid resource exhaustion, network issues, and bandwidth saturation in restricted environments, use the following command to build services sequentially:
```bash
docker compose build --parallel=1
```

This is particularly useful when experiencing "connection reset", memory issues, or timeout errors during installation or build stages.

4. Configure environment:
```bash
cp apps/backend/.env.example apps/backend/.env
```

5. Start development servers:
```bash
bun dev
```

### Backend (http://localhost:3000)
```bash
cd apps/backend
bun run start:dev
```

### Frontend (Expo DevTools)
```bash
cd apps/frontend
bun start
```

## Features

- [ ] Prayer times calculation
- [ ] Athkar (Islamic remembrances)
- [ ] User authentication
- [ ] User preferences
- [ ] RTL support
- [ ] i18n (Arabic/English)

## API Documentation

When running in development mode, Swagger docs are available at:
```
http://localhost:3000/api/docs
```

## License

Private
