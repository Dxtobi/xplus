import { AuthService } from '$lib/server/auth.js';
import { sequence } from '@sveltejs/kit/hooks';
import { connectDB } from '$lib/server/db/database.js';
import mongoose from 'mongoose';
import { MONGODB_URI } from '$env/static/private';
import { User } from '$lib/server/db/models';

// Initialize database connection
connectDB();

const authHandler = async ({ event, resolve }) => { 
  const token = event.cookies.get('auth_token');
  
  if (token) {
    const user = await AuthService.getUserFromToken(token);
    const muser_ = await User.findOne({_id:user._id})
    event.locals.user = muser_;
    // console.log('hit hook', event.locals.user?'yes': 'no')
  }

  return resolve(event);
};

export const handle = sequence(authHandler);

// src/lib/server/database.js


// export async function connectDB() {
//   if (mongoose.connection.readyState === 0) {
//     try {
//       await mongoose.connect(MONGODB_URI);
//       console.log('Connected to MongoDB');
//     } catch (error) {
//       console.error('MongoDB connection error:', error);
//       throw error;
//     }
//   }
// }
