import { useRef } from 'react';
import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { motion } from '@/constants/design';

export type PressableScaleProps = PressableProps & {
  /** How far to shrink on press. 1 = no scale. */
  activeScale?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Pressable with a quick spring scale-down on touch. Used for every tappable
 * surface so interactions feel physical and seamless without being slow.
 */
export function PressableScale({
  activeScale = 0.97,
  style,
  onPressIn,
  onPressOut,
  children,
  ...rest
}: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPressIn={(e) => {
        Animated.spring(scale, { toValue: activeScale, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
        onPressOut?.(e);
      }}
      {...rest}>
      {(state) => (
        <Animated.View style={[style, { transform: [{ scale }], opacity: state.pressed ? 0.96 : 1 }]}>
          {typeof children === 'function' ? children(state) : children}
        </Animated.View>
      )}
    </Pressable>
  );
}

export { motion };
