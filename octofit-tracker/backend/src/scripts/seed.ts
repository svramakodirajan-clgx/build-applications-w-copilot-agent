import mongoose from 'mongoose';
import User from '../models/User';
import Team from '../models/Team';
import Activity from '../models/Activity';
import Leaderboard from '../models/Leaderboard';
import Workout from '../models/Workout';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Seed the octofit_db database with test data');

    const profiles = [
      { name: 'Mona Rivera', email: 'mona.rivera@example.test' },
      { name: 'Alex Chen', email: 'alex.chen@example.test' },
      { name: 'Sam Patel', email: 'sam.patel@example.test' },
      { name: 'Jordan Lee', email: 'jordan.lee@example.test' },
    ];
    const users = [];
    for (const profile of profiles) {
      const user = await User.findOne({ email: profile.email }) ?? await User.create(profile);
      users.push(user);
    }

    const teams = [
      {
        _id: new mongoose.Types.ObjectId('0cf170000000000000000101'),
        name: 'OctoRunners',
        members: [users[0]._id, users[1]._id],
      },
      {
        _id: new mongoose.Types.ObjectId('0cf170000000000000000102'),
        name: 'Mighty Movers',
        members: [users[2]._id, users[3]._id],
      },
    ];
    for (const team of teams) {
      if (!await Team.exists({ _id: team._id })) {
        await Team.create(team);
      }
    }

    const activities = [
      { _id: new mongoose.Types.ObjectId('0cf170000000000000000201'), user: users[0]._id, type: 'running', duration: 30, date: new Date('2026-10-01T16:00:00Z') },
      { _id: new mongoose.Types.ObjectId('0cf170000000000000000202'), user: users[1]._id, type: 'walking', duration: 45, date: new Date('2026-10-01T16:30:00Z') },
      { _id: new mongoose.Types.ObjectId('0cf170000000000000000203'), user: users[2]._id, type: 'strength training', duration: 25, date: new Date('2026-10-02T15:30:00Z') },
      { _id: new mongoose.Types.ObjectId('0cf170000000000000000204'), user: users[3]._id, type: 'cycling', duration: 40, date: new Date('2026-10-02T16:00:00Z') },
      { _id: new mongoose.Types.ObjectId('0cf170000000000000000205'), user: users[0]._id, type: 'walking', duration: 20, date: new Date('2026-10-03T10:00:00Z') },
      { _id: new mongoose.Types.ObjectId('0cf170000000000000000206'), user: users[2]._id, type: 'running', duration: 30, date: new Date('2026-10-03T10:30:00Z') },
    ];
    for (const activity of activities) {
      if (!await Activity.exists({ _id: activity._id })) {
        await Activity.create(activity);
      }
    }

    const rankings = [
      { _id: new mongoose.Types.ObjectId('0cf170000000000000000301'), user: users[0]._id, points: 100 },
      { _id: new mongoose.Types.ObjectId('0cf170000000000000000302'), user: users[1]._id, points: 90 },
      { _id: new mongoose.Types.ObjectId('0cf170000000000000000303'), user: users[2]._id, points: 110 },
      { _id: new mongoose.Types.ObjectId('0cf170000000000000000304'), user: users[3]._id, points: 80 },
    ];
    for (const ranking of rankings) {
      if (!await Leaderboard.exists({ _id: ranking._id })) {
        await Leaderboard.create(ranking);
      }
    }

    const workouts = [
      { _id: new mongoose.Types.ObjectId('0cf170000000000000000401'), name: 'Beginner Run-Walk', description: 'Alternate one minute of jogging with two minutes of walking, including a warm-up and cool-down.', duration: 30 },
      { _id: new mongoose.Types.ObjectId('0cf170000000000000000402'), name: 'After-School Walking Club', description: 'A steady group walk around the school track at a comfortable conversational pace.', duration: 45 },
      { _id: new mongoose.Types.ObjectId('0cf170000000000000000403'), name: 'Bodyweight Basics', description: 'Practice squats, wall push-ups, and short planks with rest between each set.', duration: 25 },
      { _id: new mongoose.Types.ObjectId('0cf170000000000000000404'), name: 'Weekend Bike Ride', description: 'A relaxed ride on a safe bike path, with a helmet and regular water breaks.', duration: 40 },
    ];
    for (const workout of workouts) {
      if (!await Workout.exists({ _id: workout._id })) {
        await Workout.create(workout);
      }
    }

    console.log(`Database seeding complete: ${users.length} users, ${teams.length} teams, ${activities.length} activities, ${rankings.length} leaderboard entries, ${workouts.length} workouts.`);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
