import { Schema, model } from 'mongoose';

const leaderboardSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

export default model('Leaderboard', leaderboardSchema, 'leaderboard');