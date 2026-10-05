import { Schema, model } from 'mongoose';

const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true, trim: true },
  duration: { type: Number, required: true, min: 1 },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default model('Activity', activitySchema);