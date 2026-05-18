import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, touchTarget, typography } from '@/constants/design';
import { AppText } from '@/components/ui/text';

export type TextFieldProps = TextInputProps & {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
};

export function TextField({ label, icon, error, style, onFocus, onBlur, ...rest }: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.urgentHigh : focused ? colors.primary : colors.border;

  return (
    <View style={{ gap: spacing.xs + 2 }}>
      {label ? <AppText variant="label">{label}</AppText> : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          minHeight: touchTarget.comfortable,
          borderRadius: radius.md,
          borderWidth: 2,
          borderColor,
          backgroundColor: colors.surface,
          paddingHorizontal: spacing.md,
        }}>
        {icon ? <Ionicons name={icon} size={20} color={focused ? colors.primary : colors.textSubtle} /> : null}
        <TextInput
          style={[{ flex: 1, color: colors.text, paddingVertical: spacing.md }, typography.body, style]}
          placeholderTextColor={colors.textSubtle}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
      </View>
      {error ? (
        <AppText variant="caption" tone="danger">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
