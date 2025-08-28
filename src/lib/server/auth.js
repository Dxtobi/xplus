import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { User } from './db/models/index.js';
import { redirect } from '@sveltejs/kit';

export class AuthService {
  static generateToken(user) {
    return jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        username: user.username 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  static async createOrUpdateUser(googleProfile) {
    try {
      let user = await User.findOne({ email: googleProfile.email });
     
      if (user) {
        // Update existing user
        user.avatar = googleProfile.picture;
        user.isActive = true;
        user.googleId=googleProfile.id
        user.name=googleProfile.name
        await user.save();
      } else {
        // Create new user
        user = new User({
          username: googleProfile.email.split('@')[0] + '_' + Date.now().toString().slice(-4),
          email: googleProfile.email,
          password: 'google_oauth_' + Math.random().toString(36).substring(7),
          avatar: googleProfile.picture,
          isActive: true,
          googleId:googleProfile.id,
          name:googleProfile.name
          
        });
        await user.save();
      }
      
      return user;
    } catch (error) {
      console.error('Error creating/updating user:', error.message);
      throw error;
    }
  }

  static async getUserFromToken(token) {
    const payload = this.verifyToken(token);
    if (!payload) return null;
    
    try {
      const user = await User.findById(payload.userId);
      return user && user.isActive ? user : null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }
}