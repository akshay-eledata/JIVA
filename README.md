# JIVA Health

JIVA is a precision‑wellness web app. A patient fills out an intake
questionnaire, buys a lab panel, and after their blood is drawn the app turns
the results into a **Vitality Map** — biological age, biomarker ranges by body
system, and personalized food / supplement / movement recommendations — plus a
**Vitality Map 2** that compares a second test against the first.

This repo has three parts:

| Folder | What it is |
| --- | --- |
| `JIVA_Node_App` | Backend — Express API + PostgreSQL (Sequelize) |
| `JIVA_React_App` | Frontend — React + Vite |
| `Data` | Reference data: lab panels, ranges, sample patients, the engine prompt |

---

## Run it locally (the easy way — Docker)

This is the recommended path. You do **not** need Node, PostgreSQL, or the ICD
tools installed — Docker runs everything for you.

### 1. Install Docker Desktop

Download and install **Docker Desktop** for your machine, then open it and wait
until it says it's running:

- macOS / Windows: <https://www.docker.com/products/docker-desktop/>
- Linux: install Docker Engine + the Compose plugin.

You can confirm it's installed by running this in a terminal:

```bash
docker --version
```

### 2. Get the code

```bash
git clone https://github.com/akshay-eledata/JIVA.git
cd JIVA
```

### 3. Start everything

From the project folder, run:

```bash
docker compose up
```

That's it. The first run downloads images and builds the app, so **give it a
few minutes** (roughly 3–5). It's ready when the logs settle and you see the
backend print `Server running on port 5001`.

### 4. Open the app

Go to **<http://localhost:5174>** in your browser.

Log in with the demo account:

- **Email:** `test@jiva.com`
- **Password:** `password123`

The demo user is pre‑loaded with a sample patient (two test visits), so the
Vitality Map, Vitality Map 2, and recommendations all have real data to show.

To stop the app, press `Ctrl+C` in that terminal (or run `docker compose down`
from another terminal).

---

## What's running

`docker compose up` starts four services:

| Service | What it does | URL |
| --- | --- | --- |
| `frontend` | The React app (what you look at) | <http://localhost:5174> |
| `backend` | The API + demo data | <http://localhost:5001> |
| `db` | PostgreSQL database | localhost:5433 |
| `icd-api` | WHO ICD‑11 lookup for the condition autocomplete | <http://localhost:8382> |

Make sure nothing else on your machine is already using ports **5174, 5001,
5433, or 8382** before starting (see Troubleshooting).

---

## Handy commands

```bash
docker compose up -d        # start in the background
docker compose logs -f      # follow the logs
docker compose logs backend # logs for one service
docker compose down         # stop and remove the containers
docker compose up --build   # rebuild after you change the code
docker compose down -v      # stop AND wipe the database volume (full reset)
```

> The backend re‑seeds the demo data every time it starts, so a restart always
> gives you a clean, working demo. Any accounts you create are reset on restart.

---

## Notes

- **ICD‑11 condition autocomplete.** In the intake questionnaire, the
  "conditions" fields let a patient type in plain language (e.g. "heart
  attack") and suggest matching ICD‑11 categories with their codes. This is
  powered by the local `icd-api` container — no account or API key required.
  To use WHO's hosted API instead, set `ICD_API_BASE=https://id.who.int` plus
  `ICD_CLIENT_ID` / `ICD_CLIENT_SECRET` on the backend service (get credentials
  at <https://icd.who.int/icdapi>).
- **The "engine."** The clinical analysis is produced from an LLM prompt in
  `Data/Engine`; the app ingests the pre‑computed results (it does not call an
  LLM at runtime). See `Data/plan.md` for the design.

---

## Run it without Docker (for development)

If you're changing the code and want hot‑reload, you can run the pieces
directly. You'll need **Node 20+** and **PostgreSQL** (or just run the `db`
and `icd-api` containers from Docker and the rest with npm).

1. **Database + ICD** — the two things that are annoying to install by hand:

   ```bash
   docker compose up -d db icd-api
   ```

2. **Backend:**

   ```bash
   cd JIVA_Node_App
   npm install
   # .env already points at localhost:5433 (db) and localhost:8382 (icd-api)
   node scripts/seedDemo.js   # create tables + load the demo patient
   npm run dev                # starts the API on http://localhost:5001
   ```

3. **Frontend** (in a second terminal):

   ```bash
   cd JIVA_React_App
   npm install
   npm run dev                # http://localhost:5174
   ```

Then open <http://localhost:5174> and log in with `test@jiva.com` /
`password123`.

Backend config lives in `JIVA_Node_App/.env` (`PORT`, `DATABASE_URL`,
`JWT_SECRET`, `ICD_API_BASE`). The frontend reads `VITE_API_BASE_URL`
(defaults to `http://localhost:5001`).

---

## Troubleshooting

- **"port is already allocated" / a page won't load.** Something else is using
  one of the ports (5174, 5001, 5433, 8382). Stop that program, or stop other
  Docker containers with `docker ps` → `docker stop <name>`.
- **First run seems stuck.** It's downloading/building — watch `docker compose
  logs -f`. The `icd-api` container also takes ~15 seconds to load its data the
  first time.
- **The condition autocomplete shows "lookup unavailable."** The `icd-api`
  container is still starting or was stopped. The form still accepts typed
  text; the suggestions come back once it's up.
- **Start completely fresh.** `docker compose down -v && docker compose up
  --build` removes the database and rebuilds from scratch.
