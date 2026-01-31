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

	Important: do not rely on trying to proxy `/api/*` using `vercel.json` with an env var (for example `https://$BACKEND_URL`). Vercel does not expand environment variables inside `vercel.json` routes and rewrites; that causes 404s for `/api/*` (the deployment has no matching route).

	Fix options:
	- Recommended (simpler): Remove proxy routes from `vercel.json` (already done) and set a Vite runtime env `VITE_BACKEND_URL` in Vercel project settings. In your client API code use `import.meta.env.VITE_BACKEND_URL` (or create a small wrapper) so requests go directly to `https://<your-backend>`.
	- Alternative: implement a serverless proxy under `/api/*` in `api/` (Vercel Functions) that forwards requests to your external backend using `process.env.BACKEND_URL`.

	To debug the 404 you saw on Vercel:
	1. Open the Vercel dashboard, go to the project → Deployments → the failing deployment and check the Logs panel. Search the deployment ID shown in the error for details.
	2. Curl the deployed URL to reproduce locally: `curl -i https://your-vercel-domain.vercel.app/api/some-endpoint` and compare the response.


- If you want the backend served on Vercel as Serverless Functions, note that will require refactoring the Express `server/` code into Vercel-compatible serverless handlers under an `api/` directory; tell me if you want that and I will convert endpoints incrementally.

