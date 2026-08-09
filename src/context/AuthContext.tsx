import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { adminLogout as svcAdminLogout } from '../services/jobService';
import type { UserInfo } from '../types';

interface AuthCtx {
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

function mapUser(user: import('@supabase/supabase-js').User): UserInfo {
  const meta = user.user_metadata || {};
  const appMeta = user.app_metadata || {};
  return {
    id: user.id,
    email: user.email || '',
    name: meta.name || meta.full_name || user.email?.split('@')[0] || 'User',
    username: (meta.username as string) || (appMeta.username as string) || '',
    role: appMeta.role || 'user',
    avatarUrl: meta.avatar_url || '',
    avatarColor: (meta.avatar_color as string) || '#58a6ff',
  };
}

/** The role in public.users is authoritative (app_metadata only carries 'admin'). */
async function fetchUserRole(userId: string): Promise<string | null> {
  const { data } = await supabase.from('users').select('role').eq('id', userId).maybeSingle();
  return data?.role ?? null;
}

async function resolveUser(authUser: import('@supabase/supabase-js').User): Promise<UserInfo> {
  const info = mapUser(authUser);
  const role = await fetchUserRole(authUser.id);
  return role ? { ...info, role } : info;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setUser(await resolveUser(session.user));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        resolveUser(session.user).then(setUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login failed:', error.message);
      return false;
    }
    if (data.user) {
      setIsAuthenticated(true);
      setUser(await resolveUser(data.user));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    supabase.auth.signOut();
    svcAdminLogout();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
