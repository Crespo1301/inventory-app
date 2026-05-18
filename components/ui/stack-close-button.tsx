import { router, type Href } from 'expo-router';

import { PressableScale } from '@/components/ui/pressable-scale';
import { AppText } from '@/components/ui/text';

export type StackCloseButtonProps = {
  fallbackHref: Href;
  label?: string;
};

/**
 * Header action for nested stacks that may be entered without in-stack history.
 * Falls back to a known safe route when there is nothing to pop.
 */
export function StackCloseButton({ fallbackHref, label = 'Close' }: StackCloseButtonProps) {
  const dismiss = () => {
    if (router.canGoBack()) router.back();
    else router.replace(fallbackHref);
  };

  return (
    <PressableScale accessibilityRole="button" accessibilityLabel={label} onPress={dismiss} hitSlop={8}>
      <AppText variant="body" tone="primary">
        {label}
      </AppText>
    </PressableScale>
  );
}
