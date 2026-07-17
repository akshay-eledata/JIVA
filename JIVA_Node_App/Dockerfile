# JIVA backend (Express API).
# NOTE: build context is the repository ROOT (see docker-compose.yml) so we can
# also copy the shared Data/ folder that the seed script reads.
FROM node:20-alpine

WORKDIR /app/JIVA_Node_App

# Install dependencies first for better layer caching.
COPY JIVA_Node_App/package*.json ./
RUN npm install --omit=dev

# App source + the shared reference data (patients, lab ranges, packages).
COPY JIVA_Node_App ./
COPY Data /app/Data

EXPOSE 5001

# Seed the demo data (creates the tables and the female_29 demo patient) and
# then start the API. Seeding runs on every start, so the demo always works;
# it resets to the demo dataset each time the container starts.
CMD ["sh", "-c", "node scripts/seedDemo.js && node server.js"]
