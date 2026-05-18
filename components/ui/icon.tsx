/**
 * Cross-platform icon primitive.
 *
 * On iOS: renders native SF Symbols via `expo-symbols` — the most native
 * feel possible on Apple hardware.
 * On Android / Web: falls back to Ionicons from `@expo/vector-icons`.
 *
 * Usage:
 *   <Icon name="cube" size={24} color={colors.text} />
 *
 * Names are Ionicons names (the baseline). The mapping table below translates
 * each name to its SF Symbol equivalent for iOS.
 */

import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SymbolView } from 'expo-symbols';
import type { SFSymbol } from 'sf-symbols-typescript';

// ---------------------------------------------------------------------------
// Name mapping  (Ionicons name → SF Symbol name)
// Add entries here as new icons are needed across the app.
// ---------------------------------------------------------------------------
const SF_MAP: Partial<Record<keyof typeof Ionicons.glyphMap, SFSymbol>> = {
  // Tab bar
  cube: 'cube.fill',
  clipboard: 'clipboard.fill',
  time: 'clock.fill',
  'person-circle': 'person.circle.fill',

  // Navigation / actions
  add: 'plus',
  close: 'xmark',
  'chevron-forward': 'chevron.right',
  'chevron-back': 'chevron.left',
  'chevron-down': 'chevron.down',
  'chevron-up': 'chevron.up',
  search: 'magnifyingglass',
  settings: 'gearshape.fill',
  'settings-outline': 'gearshape',

  // List rows — manage screens
  'person-outline': 'person',
  person: 'person.fill',
  'people-outline': 'person.2',
  people: 'person.2.fill',
  'location-outline': 'mappin',
  location: 'mappin.and.ellipse',
  'storefront-outline': 'building.2',
  storefront: 'building.2.fill',
  'business-outline': 'building.columns',
  business: 'building.columns.fill',
  'cube-outline': 'cube',
  'list-outline': 'list.bullet',
  list: 'list.bullet',
  'flag-outline': 'flag',
  flag: 'flag.fill',
  language: 'globe',
  'trash-outline': 'trash',
  trash: 'trash.fill',
  'pencil-outline': 'pencil',
  pencil: 'pencil',
  'mail-outline': 'envelope',
  mail: 'envelope.fill',
  'link-outline': 'link',
  link: 'link',
  'key-outline': 'key',
  key: 'key.fill',
  'log-out-outline': 'rectangle.portrait.and.arrow.right',
  'alert-circle-outline': 'exclamationmark.circle',
  'alert-circle': 'exclamationmark.circle.fill',
  'checkmark-circle-outline': 'checkmark.circle',
  'checkmark-circle': 'checkmark.circle.fill',
  'information-circle-outline': 'info.circle',
  'information-circle': 'info.circle.fill',
  'warning-outline': 'exclamationmark.triangle',
  warning: 'exclamationmark.triangle.fill',
  'share-outline': 'square.and.arrow.up',
  share: 'square.and.arrow.up.fill',
  'cart-outline': 'cart',
  cart: 'cart.fill',
  'receipt-outline': 'doc.text',
  receipt: 'doc.text.fill',
  'archive-outline': 'archivebox',
  archive: 'archivebox.fill',
};

// ---------------------------------------------------------------------------
// Icon types
// ---------------------------------------------------------------------------

export type IconName = keyof typeof Ionicons.glyphMap;

export type IconWeight =
  | 'ultraLight'
  | 'thin'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'heavy'
  | 'black';

export type IconProps = {
  name: IconName;
  size?: number;
  color: string;
  /**
   * SF Symbol weight. Only meaningful on iOS; ignored on Android/web.
   * Defaults to 'regular'.
   */
  weight?: IconWeight;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Renders an SF Symbol on iOS and an Ionicons glyph on Android/web.
 * Use Ionicons names — the mapping table handles the iOS translation.
 */
export function Icon({ name, size = 24, color, weight = 'regular' }: IconProps) {
  if (Platform.OS === 'ios') {
    const sfName = SF_MAP[name];
    if (sfName) {
      return (
        <SymbolView
          name={sfName}
          size={size}
          tintColor={color}
          weight={weight}
          resizeMode="scaleAspectFit"
          style={{ width: size, height: size }}
        />
      );
    }
  }

  // Fallback: Ionicons (Android, web, or unmapped iOS name)
  return <Ionicons name={name} size={size} color={color} />;
}
