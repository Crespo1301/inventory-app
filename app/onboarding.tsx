/**
 * First-run tutorial.
 *
 * Shown once, right after a user's first sign-in (new admin or invited team
 * member alike — see `src/onboarding/onboarding-store.tsx`). Built for staff
 * who are not tech-savvy: one idea per screen, big icon, large plain-language
 * text, large buttons, and a always-available Skip. Fully bilingual — the
 * EN/ES choice also sets the app's Spanish-item-name preference so a
 * Spanish-speaking user lands in a Spanish-friendly app.
 */

import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing, touchTarget, typography } from '@/constants/design';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { AppText } from '@/components/ui/text';
import { useApp } from '@/src/store/app-store';
import { useOnboarding } from '@/src/onboarding/onboarding-store';

/**
 * Tutorial languages. This is the extension point for more languages later:
 * add the code here, then add the matching key to every `SLIDES` entry and to
 * `COPY`. (App-wide multi-language — locale setting, item-name translations —
 * is a separate, larger effort tracked in HANDOFF.)
 */
type Lang = 'en' | 'es';

type Slide = {
  icon: IconName;
  iconBg: string;
  iconColor: string;
  en: { title: string; body: string };
  es: { title: string; body: string };
};

const SLIDES: Slide[] = [
  {
    icon: 'clipboard',
    iconBg: colors.primarySoft,
    iconColor: colors.primary,
    en: {
      title: 'Welcome to Kitchen Inventory',
      body: 'A simple way to track what is running low and turn it into an order — no whiteboard, no guesswork.',
    },
    es: {
      title: 'Bienvenido a Kitchen Inventory',
      body: 'Una forma sencilla de anotar lo que se está acabando y convertirlo en un pedido — sin pizarrón y sin adivinar.',
    },
  },
  {
    icon: 'flag',
    iconBg: colors.urgentHighSoft,
    iconColor: colors.urgentHigh,
    en: {
      title: 'See something low? Tap it.',
      body: 'On the Stock screen, tap Low or Out next to an item. That is the whole job — it takes one second.',
    },
    es: {
      title: '¿Algo se está acabando? Tócalo.',
      body: 'En la pantalla de Inventario, toca Bajo o Agotado junto al artículo. Eso es todo — toma un segundo.',
    },
  },
  {
    icon: 'cart',
    iconBg: colors.infoSoft,
    iconColor: colors.info,
    en: {
      title: 'The app builds the order',
      body: 'It suggests how much to order and shows you the reason behind every amount.',
    },
    es: {
      title: 'La app arma el pedido',
      body: 'Sugiere cuánto pedir y te muestra el motivo de cada cantidad.',
    },
  },
  {
    icon: 'checkmark-circle',
    iconBg: colors.primarySoft,
    iconColor: colors.primary,
    en: {
      title: 'A manager checks and sends',
      body: 'A manager reviews the list, adjusts anything, verifies it, and sends it to the vendor.',
    },
    es: {
      title: 'Un gerente revisa y envía',
      body: 'Un gerente revisa la lista, ajusta lo que haga falta, la confirma y la envía al proveedor.',
    },
  },
  {
    icon: 'language',
    iconBg: colors.surfaceSunken,
    iconColor: colors.textMuted,
    en: {
      title: 'You are all set',
      body: 'You can switch between English and Spanish anytime from the Account screen. Let us get started.',
    },
    es: {
      title: 'Todo listo',
      body: 'Puedes cambiar entre inglés y español cuando quieras desde la pantalla de Cuenta. Empecemos.',
    },
  },
];

const COPY = {
  en: { skip: 'Skip', next: 'Next', back: 'Back', done: 'Get Started' },
  es: { skip: 'Saltar', next: 'Siguiente', back: 'Atrás', done: 'Empezar' },
};

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { complete } = useOnboarding();
  const { showSpanish, toggleSpanish } = useApp();

  const [lang, setLang] = useState<Lang>(showSpanish ? 'es' : 'en');
  const [index, setIndex] = useState(0);

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;
  const t = COPY[lang];
  const text = slide[lang];

  /** Finish: persist the tutorial flag and align the app's language preference. */
  const finish = async () => {
    if ((lang === 'es') !== showSpanish) toggleSpanish();
    await complete();
  };

  const dots = useMemo(
    () =>
      SLIDES.map((_, i) => (
        <View
          key={i}
          style={{
            width: i === index ? 22 : 8,
            height: 8,
            borderRadius: radius.pill,
            backgroundColor: i === index ? colors.primary : colors.borderStrong,
          }}
        />
      )),
    [index],
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.canvas,
        paddingTop: insets.top + spacing.sm,
        paddingBottom: insets.bottom + spacing.lg,
        paddingHorizontal: spacing.xl,
      }}>
      {/* Top bar: language toggle + Skip */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <LangToggle lang={lang} onChange={setLang} />
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t.skip}
          onPress={finish}
          style={{
            minHeight: touchTarget.min,
            justifyContent: 'center',
            paddingHorizontal: spacing.sm,
          }}>
          <AppText variant="label" tone="muted">
            {t.skip}
          </AppText>
        </PressableScale>
      </View>

      {/* Slide body */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xl }}>
        <View
          style={{
            width: 112,
            height: 112,
            borderRadius: radius.xl,
            backgroundColor: slide.iconBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name={slide.icon} size={56} color={slide.iconColor} />
        </View>
        <View style={{ gap: spacing.md, alignItems: 'center' }}>
          <AppText variant="display" style={{ textAlign: 'center' }}>
            {text.title}
          </AppText>
          <AppText
            variant="body"
            tone="muted"
            style={{ textAlign: 'center', fontSize: 17, lineHeight: 25 }}>
            {text.body}
          </AppText>
        </View>
      </View>

      {/* Footer: dots + actions */}
      <View style={{ gap: spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.sm }}>{dots}</View>
        <Button
          label={isLast ? t.done : t.next}
          size="lg"
          icon={isLast ? 'checkmark-circle' : undefined}
          onPress={isLast ? finish : () => setIndex((i) => i + 1)}
        />
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t.back}
          disabled={index === 0}
          onPress={() => setIndex((i) => Math.max(0, i - 1))}
          style={{
            minHeight: touchTarget.min,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: index === 0 ? 0 : 1,
          }}>
          <AppText variant="label" tone="muted">
            {t.back}
          </AppText>
        </PressableScale>
      </View>
    </View>
  );
}

/** Compact EN / ES segmented toggle. */
function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surfaceSunken,
        borderRadius: radius.pill,
        padding: 3,
      }}>
      {(['en', 'es'] as const).map((l) => {
        const active = l === lang;
        return (
          <PressableScale
            key={l}
            accessibilityRole="button"
            accessibilityLabel={l === 'en' ? 'English' : 'Español'}
            accessibilityState={{ selected: active }}
            onPress={() => onChange(l)}
            style={{
              minHeight: touchTarget.min - 12,
              paddingHorizontal: spacing.lg,
              justifyContent: 'center',
              borderRadius: radius.pill,
              backgroundColor: active ? colors.surface : 'transparent',
            }}>
            <AppText
              style={[
                typography.label,
                { color: active ? colors.text : colors.textMuted },
              ]}>
              {l === 'en' ? 'English' : 'Español'}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}
