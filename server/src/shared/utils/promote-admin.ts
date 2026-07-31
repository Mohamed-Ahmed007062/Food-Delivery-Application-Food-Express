import mongoose from 'mongoose';
import { User } from '../../features/users/user.model.js';
import { env } from '../../config/env.js';

async function promoteUsersToAdmin() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('🍃 Connected to MongoDB...');

    const result = await User.updateMany({}, { role: 'admin', isEmailVerified: true });
    console.log(`✅ Promoted ${result.modifiedCount} user(s) to 'admin' role!`);

    const users = await User.find({}).select('email name role');
    console.log('Users in DB now:', users);

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

promoteUsersToAdmin();
