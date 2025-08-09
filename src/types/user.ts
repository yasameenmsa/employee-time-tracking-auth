import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  id?: string;
  username: string;
  email?: string;
  password: string;
  role: 'admin' | 'employees' | 'HR';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserResponse {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'employees' | 'HR';
}
