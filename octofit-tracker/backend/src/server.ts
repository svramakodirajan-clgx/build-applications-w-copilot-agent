import express, { type ErrorRequestHandler } from 'express';
import db from './config/database';
import User from './models/User';
import Team from './models/Team';
import Activity from './models/Activity';
import Leaderboard from './models/Leaderboard';
import Workout from './models/Workout';

const app = express();
const port = 8000;
const baseUrl = process.env.CODESPACE_NAME
  ? `https://${process.env.CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());

app.get('/api/health', (_request, response) => {
  const connected = db.readyState === 1;
  response.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'unavailable',
    database: connected ? 'connected' : 'disconnected',
  });
});

app.get('/api/users/', async (_request, response) => {
  response.json(await User.find().select('-email').lean());
});

app.get('/api/teams/', async (_request, response) => {
  response.json(await Team.find().lean());
});

app.get('/api/activities/', async (_request, response) => {
  response.json(await Activity.find().sort({ date: -1 }).lean());
});

app.get('/api/leaderboard/', async (_request, response) => {
  response.json(await Leaderboard.find().sort({ points: -1 }).lean());
});

app.get('/api/workouts/', async (_request, response) => {
  response.json(await Workout.find().lean());
});

const handleError: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error('API request failed:', error);
  response.status(500).json({ error: 'Unable to complete the request.' });
};

app.use(handleError);

db.once('open', () => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit Tracker API listening at ${baseUrl}`);
  });
});