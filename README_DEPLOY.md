# Deployment guide

This project contains a React client (Vite) in `client/` and an Express-style Node server in `server/`.

Local Docker deployment

- Build and run with Docker Compose:

```bash
docker-compose build
docker-compose up -d
```

- Client will be available at `http://localhost:3000` and server at `http://localhost:5000`.

Notes

- The server uses the `.env` file in `server/.env` for environment variables; `docker-compose.yml` references it.
- The included GitHub Actions workflow (`.github/workflows/ci.yml`) builds the client and server and uploads the client build as an artifact. Modify the workflow to push images to a registry if you want automated image publishing.

If you want help customizing the workflow to publish Docker images to Docker Hub or GitHub Container Registry, tell me which registry and I will add the required secrets and steps.

Vercel deployment (recommended for the frontend)

- This repo is a monorepo with a Vite React app in `client/` and a separate Node server in `server/`.
- To deploy only the frontend to Vercel (quickest):
	1. Import the repository into Vercel (via GitHub/GitLab/Bitbucket import).
	2. In the project settings set the root to `client` (or use the provided `vercel.json`).
	3. Set the build command to `npm run build` and output directory to `dist` (Vercel usually detects this automatically).
	4. Add an environment variable `BACKEND_URL` pointing to your backend base URL (for example `api.example.com`). The app should use this variable (e.g., `process.env.REACT_APP_BACKEND_URL` or a client config) to call API endpoints.

- If you want the backend served on Vercel as Serverless Functions, note that will require refactoring the Express `server/` code into Vercel-compatible serverless handlers under an `api/` directory; tell me if you want that and I will convert endpoints incrementally.

