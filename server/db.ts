// Import necessary modules
import * as schema from '@shared/schema';
import { config } from './config';

// For development/testing, we'll use a dummy db object
// This allows the app to run without an actual database connection
export const db = {
  select: () => ({
    from: () => ({
      where: () => Promise.resolve([]),
    }),
  }),
  insert: () => ({
    values: () => ({
      returning: () => Promise.resolve([{ id: 1, username: 'demo', password: 'password', fullName: 'Demo User', title: 'Doctor', profileImage: '', createdAt: new Date() }]),
      onConflictDoNothing: () => Promise.resolve([]),
    }),
  }),
  update: () => ({
    set: () => ({
      where: () => ({
        returning: () => Promise.resolve([]),
      }),
    }),
  }),
};

// Export a dummy pool for compatibility
export const pool = {
  end: () => Promise.resolve()
};