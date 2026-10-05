import { Schema, model } from 'mongoose';

const workoutSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  duration: { type: Number, required: true, min: 1 },
}, { timestamps: true });

export default model('Workout', workoutSchema);