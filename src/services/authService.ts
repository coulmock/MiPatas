import { AuthUser, PlanTier } from '../types';

const AUTH_USER_KEY = 'mipatas_auth_user_v1';
const AUTH_USERS_DB_KEY = 'mipatas_registered_users_v1';

type AuthListener = (user: AuthUser | null) => void;
const listeners: Set<AuthListener> = new Set();

function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setStoredUser(user: AuthUser | null): void {
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
  notifyListeners(user);
}

function notifyListeners(user: AuthUser | null) {
  listeners.forEach((fn) => {
    try {
      fn(user);
    } catch (e) {
      console.error('Error in auth listener:', e);
    }
  });
}

export const authService = {
  /**
   * Retrieves the current authenticated user session from local storage.
   */
  getCurrentUser(): AuthUser | null {
    return getStoredUser();
  },

  /**
   * Simulates a Supabase Auth signUp flow with email and password.
   * Creates a clean account with plan: 'free' by default.
   */
  async signUp(
    email: string,
    _password: string,
    name: string
  ): Promise<{ user: AuthUser | null; error: string | null }> {
    // Artificial slight latency to mimic network/Supabase roundtrip
    await new Promise((res) => setTimeout(res, 350));

    if (!email || !email.includes('@')) {
      return { user: null, error: 'Por favor, introduce un correo electrónico válido.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || cleanEmail.split('@')[0];

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      name: cleanName,
      plan: 'free',
      createdAt: new Date().toISOString(),
    };

    setStoredUser(newUser);

    // Save in simulated registry
    try {
      const existing = JSON.parse(localStorage.getItem(AUTH_USERS_DB_KEY) || '[]');
      existing.push(newUser);
      localStorage.setItem(AUTH_USERS_DB_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error('Error saving user to registry:', e);
    }

    return { user: newUser, error: null };
  },

  /**
   * Simulates a Supabase Auth signIn flow.
   */
  async signIn(
    email: string,
    _password: string
  ): Promise<{ user: AuthUser | null; error: string | null }> {
    await new Promise((res) => setTimeout(res, 350));

    if (!email || !email.includes('@')) {
      return { user: null, error: 'Por favor, introduce un correo electrónico válido.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    
    // Check if user previously signed up in simulated registry
    let foundUser: AuthUser | null = null;
    try {
      const existing: AuthUser[] = JSON.parse(localStorage.getItem(AUTH_USERS_DB_KEY) || '[]');
      foundUser = existing.find((u) => u.email.toLowerCase() === cleanEmail) || null;
    } catch {
      foundUser = null;
    }

    const user: AuthUser = foundUser || {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      plan: 'free',
      createdAt: new Date().toISOString(),
    };

    setStoredUser(user);
    return { user, error: null };
  },

  /**
   * Simulates signing out.
   */
  async signOut(): Promise<{ error: string | null }> {
    await new Promise((res) => setTimeout(res, 150));
    setStoredUser(null);
    return { error: null };
  },

  /**
   * Updates the user's plan tier (e.g. Free -> Pro or Pro -> Free).
   * Ready to be replaced by Stripe webhook in the future.
   */
  updatePlan(plan: PlanTier): AuthUser | null {
    const current = getStoredUser();
    if (!current) return null;
    const updated: AuthUser = { ...current, plan };
    setStoredUser(updated);
    return updated;
  },

  /**
   * Subscribe to auth state changes (Supabase onAuthStateChange signature).
   */
  onAuthStateChange(callback: AuthListener): () => void {
    listeners.add(callback);
    // Trigger initial callback
    callback(getStoredUser());
    return () => {
      listeners.delete(callback);
    };
  },
};
