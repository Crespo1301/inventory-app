/**
 * First-run tutorial gate.
 *
 * Tracks whether the signed-in user has seen the welcome tutorial. The flag is
 * stored per user in AsyncStorage (`onboarding:v1:<userId>`), so a new admin
 * *and* an invited team member each see the tutorial once on their first
 * authenticated load. Bump the `v1` key to re-show the tutorial to everyone
 * after a significant workflow change.
 *
 * Fails open: if the read errors, the user is treated as already onboarded so
 * a storage hiccup can never trap someone on the tutorial.
 */

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '@/src/auth/auth-store';

const storageKey = (userId: string) => `onboarding:v1:${userId}`;

/** 'checking' until AsyncStorage answers, then 'needed' or 'done'. */
type OnboardingState = 'checking' | 'needed' | 'done';

type OnboardingValue = {
  state: OnboardingState;
  /** Marks the tutorial complete (used by both Finish and Skip). */
  complete: () => Promise<void>;
  /** Re-opens the tutorial on demand — e.g. a "Replay tutorial" menu item. */
  restart: () => void;
};

const OnboardingContext = createContext<OnboardingValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { status, user } = useAuth();
  const [state, setState] = useState<OnboardingState>('checking');

  useEffect(() => {
    let cancelled = false;
    if (status !== 'authed' || !user) {
      setState('checking');
      return;
    }
    setState('checking');
    AsyncStorage.getItem(storageKey(user.id))
      .then((value) => {
        if (!cancelled) setState(value === 'true' ? 'done' : 'needed');
      })
      .catch(() => {
        if (!cancelled) setState('done');
      });
    return () => {
      cancelled = true;
    };
  }, [status, user]);

  const complete = useCallback(async () => {
    if (user) {
      try {
        await AsyncStorage.setItem(storageKey(user.id), 'true');
      } catch {
        // Non-fatal: the tutorial just shows again next launch.
      }
    }
    setState('done');
  }, [user]);

  const restart = useCallback(() => setState('needed'), []);

  return (
    <OnboardingContext.Provider value={{ state, complete, restart }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingValue {
  const value = useContext(OnboardingContext);
  if (!value) throw new Error('useOnboarding must be used within an OnboardingProvider');
  return value;
}
