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
