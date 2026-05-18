/**
 * React Navigation theme bridge.
 *
 * The app is intentionally light-only for the POC: a kitchen app should be
 * bright and high-contrast. Design tokens live in `constants/design.ts`.
 */

import type { Theme } from '@react-navigation/native';
import { DefaultTheme } from '@react-navigation/native';

import { colors } from '@/constants/design';

export const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.canvas,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.urgentHigh,
  },
};

/** Legacy export kept so the original Expo scaffold keeps compiling. */
export const Colors = {
  light: {
    text: colors.text,
    background: colors.canvas,
    tint: colors.primary,
    icon: colors.textMuted,
    tabIconDefault: colors.textSubtle,
    tabIconSelected: colors.primary,
  },
  dark: {
    text: colors.text,
    background: colors.canvas,
    tint: colors.primary,
    icon: colors.textMuted,
    tabIconDefault: colors.textSubtle,
    tabIconSelected: colors.primary,
  },
};
