# JIVA frontend (Vite dev server).
# Serves the React app and proxies API calls to the backend via the browser
# (VITE_API_BASE_URL, set in docker-compose.yml).
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite serves on 5174 (vite.config.ts).
EXPOSE 5174

# --host makes the dev server reachable from outside the container.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
