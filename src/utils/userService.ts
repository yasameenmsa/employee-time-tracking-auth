import { hash, compare } from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { getUsersCollection } from './mongodb';
import { User, UserResponse } from '@/types/user';

export class UserService {
  static async createUser(username: string, password: string, email?: string, role: 'admin' | 'employees' | 'HR' = 'employees'): Promise<UserResponse> {
    const usersCollection = await getUsersCollection();
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const newUser: Omit<User, '_id'> = {
      username,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(newUser);
    
    return {
      id: result.insertedId.toString(),
      username,
      email,
      role
    };
  }

  static async authenticateUser(username: string, password: string): Promise<UserResponse | null> {
    const usersCollection = await getUsersCollection();
    
    // Find user by username
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return null;
    }

    // Verify password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { updatedAt: new Date() } }
    );

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role
    };
  }

  static async getUserById(id: string): Promise<UserResponse | null> {
    const usersCollection = await getUsersCollection();
    
    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(id) });
      if (!user) {
        return null;
      }

      return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }

  static async getUserByUsername(username: string): Promise<UserResponse | null> {
    const usersCollection = await getUsersCollection();
    
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role
    };
  }

  static async updateUser(id: string, updates: Partial<Pick<User, 'username' | 'email' | 'role'>>): Promise<UserResponse | null> {
    const usersCollection = await getUsersCollection();
    
    try {
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            ...updates,
            updatedAt: new Date()
          }
        }
      );

      if (result.matchedCount === 0) {
        return null;
      }

      return await this.getUserById(id);
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  static async deleteUser(id: string): Promise<boolean> {
    const usersCollection = await getUsersCollection();
    
    try {
      const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}