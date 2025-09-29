# Quick deploy checklist

1. Provision PostgreSQL and run `server/sql/schema.sql` to set up the database schema.
2. Set environment variables from `server/.env.example` and `client/.env.example` as needed.
3. Build the client application by navigating to the client directory and running:
   ```
   cd client && npm install && npm run build
   ```
4. Serve the static build files behind a reverse proxy (e.g., Nginx) or host on a CDN, ensuring to set the API origin in the CORS whitelist.
5. Start the server by navigating to the server directory and running:
   ```
   cd server && npm install && npm start
   ```
   Ensure the server is running behind the proxy which handles TLS termination.