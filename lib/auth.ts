// Simple in-memory authentication system
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'officer' | 'handler';
  createdAt: Date;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
}

// Mock users - in production, use a real database
const MOCK_USERS: { [key: string]: User & { password: string } } = {
  'admin@sagbama.gov': {
    id: '1',
    email: 'admin@sagbama.gov',
    name: 'Administrator',
    role: 'admin',
    password: 'admin123',
    createdAt: new Date(),
  },
  'officer@sagbama.gov': {
    id: '2',
    email: 'officer@sagbama.gov',
    name: 'Verification Officer',
    role: 'officer',
    password: 'officer123',
    createdAt: new Date(),
  },
  'handler@sagbama.gov': {
    id: '3',
    email: 'handler@sagbama.gov',
    name: 'Document Handler',
    role: 'handler',
    password: 'handler123',
    createdAt: new Date(),
  },
};

export function validateCredentials(email: string, password: string): User | null {
  const user = MOCK_USERS[email];
  if (user && user.password === password) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}

export function getUser(userId: string): User | null {
  for (const user of Object.values(MOCK_USERS)) {
    if (user.id === userId) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
  }
  return null;
}

export function getAllUsers(): User[] {
  return Object.values(MOCK_USERS).map(({ password: _, ...user }) => user);
}
