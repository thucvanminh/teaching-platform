# TeachFlow

Learning program management app for teachers and students. ASP.NET Core 10 API + React + Supabase.

## Setup

### 1. Backend
Copy env example and fill in your Supabase credentials:
```bash
cp backend/TeachFlow.Api/.env.example backend/TeachFlow.Api/.env
cp backend/TeachFlow.Api/appsettings.Development.example.json backend/TeachFlow.Api/appsettings.Development.json
# Edit both files with your Supabase project URL, keys, and DB password
```

Required env vars:
- `ConnectionStrings__DefaultConnection` — Supabase Postgres connection string
- `Supabase__JwtSecret` — from Supabase Dashboard → Settings → API → JWT Secret
- `Supabase__Url` — your project URL
- `Supabase__AnonKey` — `sb_publishable_...` key
- `Supabase__ServiceRoleKey` — `sb_secret_...` key (server-side only)
- `FrontendUrl` — frontend origin for CORS

### 2. Frontend
```bash
cp frontend/.env.example frontend/.env.local
# Edit with your Supabase URL and anon key
```

Run:
```bash
cd backend/TeachFlow.Api && dotnet run
cd frontend && npm install && npm run dev
```

## Deployment
See `render.yaml` for Render infrastructure-as-code. Set all env vars in Render dashboard (do NOT commit them).
