/**
 * Authentication via Supabase Auth.
 *
 * Sign-up writes account metadata that a database trigger (`handle_new_user`)
 * reads to provision the company + profile + first location, or to attach the
 * user to an existing company when an invitation code is supplied.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getMyProfile, type AccountUser } from '@/src/data/repo';
import { supabase } from '@/src/supabase/client';

export type SignUpInput = {
  name: string;
  email: string;
  password: string;
  companyName: string;
  firstLocationName: string;
};

export type JoinInput = {
  name: string;
  email: string;
  password: string;
  code: string;
};

type AuthStatus = 'loading' | 'authed' | 'guest';

type AuthContextValue = {
  status: AuthStatus;
  user: AccountUser | null;
  signUp: (input: SignUpInput) => Promise<void>;
  joinCompany: (input: JoinInput) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Signup succeeds but no session means the project still requires email
 *  confirmation — surfaced to the user with a clear next step. */
const NEEDS_CONFIRMATION =
  'Account created. Confirm your email, then log in. (Admins can disable email confirmation in Supabase for testing.)';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AccountUser | null>(null);

  const applySession = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setUser(null);
      setStatus('guest');
      return;
    }
    const profile = await getMyProfile(userId);
    setUser(profile);
    setStatus(profile ? 'authed' : 'guest');
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (active) await applySession(data.session?.user.id);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session?.user.id);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [applySession]);

  const signUp = useCallback(async (input: SignUpInput) => {
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim().toLowerCase(),
      password: input.password,
      options: {
        data: {
          name: input.name.trim(),
          company_name: input.companyName.trim(),
          first_location_name: input.firstLocationName.trim(),
        },
      },
    });
    if (error) throw new Error(error.message);
    if (!data.session) throw new Error(NEEDS_CONFIRMATION);
    await applySession(data.user?.id);
  }, [applySession]);

  const joinCompany = useCallback(async (input: JoinInput) => {
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim().toLowerCase(),
      password: input.password,
      options: {
        data: { name: input.name.trim(), invitation_code: input.code.trim().toUpperCase() },
      },
    });
    if (error) throw new Error(error.message);
    if (!data.session) throw new Error(NEEDS_CONFIRMATION);
    await applySession(data.user?.id);
  }, [applySession]);

  const logIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw new Error(error.message);
    await applySession(data.user?.id);
  }, [applySession]);

  const logOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setStatus('guest');
  }, []);

  const deleteAccount = useCallback(async () => {
    const { error } = await supabase.rpc('delete_my_account');
    if (error) throw new Error(error.message);
    await supabase.auth.signOut();
    setUser(null);
    setStatus('guest');
  }, []);

  const refresh = useCallback(async () => {
    if (user) setUser(await getMyProfile(user.id));
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, signUp, joinCompany, logIn, logOut, deleteAccount, refresh }),
    [status, user, signUp, joinCompany, logIn, logOut, deleteAccount, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
