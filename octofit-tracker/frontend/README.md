# OctoFit Tracker Presentation Tier

React 19, Vite, React Router, and Bootstrap power the Activities, Leaderboard,
Teams, Users, and Workouts views. Start commands from the repository root:

```bash
npm install --prefix octofit-tracker/frontend
npm run dev --prefix octofit-tracker/frontend
```

The frontend uses port `5173`; the API uses port `8000`.

## API Environment

For Codespaces, `VITE_CODESPACE_NAME` must be defined in
`octofit-tracker/frontend/.env.local`, using the value of the shell's
`CODESPACE_NAME` variable:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

The API base URL is then `https://your-codespace-name-8000.app.github.dev`.
Vite reads the value through `import.meta.env.VITE_CODESPACE_NAME`; it does not
automatically expose `CODESPACE_NAME` to browser code. Restart Vite after changing
the environment file. Production builds also embed the value at build time.
Vite variables are public browser configuration, so never put secrets in them.

For local development, leave `VITE_CODESPACE_NAME` unset or blank. The safe fallback
is `http://localhost:8000`. The API allows frontend requests from localhost port
`5173` and the current Codespaces frontend origin. The backend must also have the
correct `CODESPACE_NAME` in Codespaces.

## Responses

The views request `/api/activities/`, `/api/leaderboard/`, `/api/teams/`,
`/api/users/`, and `/api/workouts/`. They accept plain arrays or paginated objects
with `results`, `count`, `next`, and `previous`; `data` and `total` are also
supported as aliases. Pagination links must stay on the same API origin and
resource path. Search filters the currently loaded page.

## Checks

```bash
node --test octofit-tracker/frontend/src/api.test.mjs
npm run lint --prefix octofit-tracker/frontend
npm run build --prefix octofit-tracker/frontend
```
