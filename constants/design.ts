/**
 * Design system for Inventory App.
 *
 * Direction: kitchen-speed UI. Bright, high-contrast, flat surfaces.
 * No gradients, no glassmorphism, no translucency. Large touch targets,
 * clear status color, fast and legible at arm's length on a greasy phone.
 */

import { Platform } from 'react-native';

/** Raw color ramp. Use semantic `colors` below in app code, not these. */
const palette = {
  white: '#FFFFFF',
  ink: '#16181D',
  inkMuted: '#5B6170',
  inkSubtle: '#8A909E',

  // App chrome
  canvas: '#F3F4F6',
  surface: '#FFFFFF',
  surfaceSunken: '#ECEEF1',
  border: '#E2E4E9',
  borderStrong: '#CDD0D8',

  // Brand / primary action — fresh kitchen green
  green: '#15A150',
  greenPressed: '#10833F',
  greenSoft: '#E4F6EA',

  // Status
  red: '#E5443F',
  redPressed: '#C8332E',
  redSoft: '#FCE7E6',
  amber: '#EE9A14',
  amberSoft: '#FCEFD4',
  blue: '#2F6BFF',
  bluePressed: '#2152D6',
  blueSoft: '#E3EBFF',

  // Front of house / back of house accents
  foh: '#2F6BFF',
  fohSoft: '#E3EBFF',
  boh: '#F2641C',
  bohSoft: '#FCE7D8',
} as const;

export const colors = {
  /** App background behind all screens. */
  canvas: palette.canvas,
  /** Cards, sheets, raised content. */
  surface: palette.surface,
  /** Inset wells, secondary fills. */
  surfaceSunken: palette.surfaceSunken,
  border: palette.border,
  borderStrong: palette.borderStrong,

  text: palette.ink,
  textMuted: palette.inkMuted,
  textSubtle: palette.inkSubtle,
  textOnColor: palette.white,

  primary: palette.green,
  primaryPressed: palette.greenPressed,
  primarySoft: palette.greenSoft,

  // Stock urgency — also used by status badges
  urgentHigh: palette.red,
  urgentHighPressed: palette.redPressed,
  urgentHighSoft: palette.redSoft,
  urgentMedium: palette.amber,
  urgentMediumSoft: palette.amberSoft,
  urgentLow: palette.green,
  urgentLowSoft: palette.greenSoft,

  info: palette.blue,
  infoPressed: palette.bluePressed,
  infoSoft: palette.blueSoft,

  foh: palette.foh,
  fohSoft: palette.fohSoft,
  boh: palette.boh,
  bohSoft: palette.bohSoft,
} as const;

/** 4pt spacing scale. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

/**
 * Minimum interactive size. Kitchen use means cold/wet hands and quick taps —
 * never go below this for anything tappable.
 */
export const touchTarget = {
  min: 48,
  comfortable: 56,
  large: 64,
} as const;

const fontFamily = Platform.select({
  ios: 'system-ui',
  android: 'sans-serif',
  default: 'system-ui',
}) as string;

const fontFamilyMedium = Platform.select({
  ios: 'system-ui',
  android: 'sans-serif-medium',
  default: 'system-ui',
}) as string;

export const typography = {
  /** Screen titles. */
  display: { fontFamily: fontFamilyMedium, fontSize: 28, lineHeight: 34, fontWeight: '800' as const },
  title: { fontFamily: fontFamilyMedium, fontSize: 22, lineHeight: 28, fontWeight: '700' as const },
  heading: { fontFamily: fontFamilyMedium, fontSize: 18, lineHeight: 24, fontWeight: '700' as const },
  body: { fontFamily, fontSize: 16, lineHeight: 23, fontWeight: '400' as const },
  bodyStrong: { fontFamily: fontFamilyMedium, fontSize: 16, lineHeight: 23, fontWeight: '600' as const },
  label: { fontFamily: fontFamilyMedium, fontSize: 14, lineHeight: 18, fontWeight: '600' as const },
  caption: { fontFamily, fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
} as const;

/** Subtle, single-direction elevation. No heavy or colored shadows. */
export const shadow = {
  card: {
    shadowColor: '#0B1220',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  raised: {
    shadowColor: '#0B1220',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

/** Micro-interaction timings. Snappy, never sluggish. */
export const motion = {
  fast: 120,
  base: 180,
  slow: 260,
} as const;
