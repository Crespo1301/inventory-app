/**
 * Subscription tiers.
 *
 * Universal by design: tiers gate *capacity* (locations, team size, history
 * retention) and a couple of premium surfaces — never a specific restaurant's
 * setup. Billing itself is not wired yet; this module is the single source of
 * truth for what each plan includes, how a company's usage measures against
 * its plan, and which plan a company should be on.
 *
 * Persisting the chosen plan needs a `companies.plan` text column in Supabase
 * (default `'starter'`). Until that migration lands, `planFor()` falls back to
 * `'starter'` and the Plan screen runs in preview mode.
 */

import type { Company } from '@/src/domain';

export type PlanId = 'starter' | 'pro' | 'enterprise';

/** Display order, cheapest first. Drives the comparison list and upgrade math. */
export const PLAN_ORDER: PlanId[] = ['starter', 'pro', 'enterprise'];

export type PlanLimits = {
  /** Max locations the company may create. */
  locations: number;
  /** Max team members (admins + managers + members) across the company. */
  teamMembers: number;
  /** How many days of verified order history stay visible. */
  historyDays: number;
};

export type Plan = {
  id: PlanId;
  name: string;
  /** Monthly price in USD. 0 for the free tier. */
  priceMonthly: number;
  /** One-line positioning shown under the plan name. */
  tagline: string;
  limits: PlanLimits;
  /** Premium surfaces unlocked at this tier and above. */
  features: {
    analytics: boolean;
    prioritySupport: boolean;
  };
  /** Plain-language perks for the comparison cards. */
  highlights: string[];
};

/** Unlimited capacity is modeled as Infinity so comparisons stay simple. */
const UNLIMITED = Number.POSITIVE_INFINITY;

export const PLANS: Record<PlanId, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 0,
    tagline: 'One kitchen, ditch the whiteboard.',
    limits: { locations: 1, teamMembers: 8, historyDays: 60 },
    features: { analytics: false, prioritySupport: false },
    highlights: [
      '1 location',
      'Up to 8 team members',
      'Low-stock capture & order planner',
      '60 days of order history',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 24,
    tagline: 'A few locations, with the numbers to back it up.',
    limits: { locations: 4, teamMembers: 30, historyDays: 365 },
    features: { analytics: true, prioritySupport: false },
    highlights: [
      'Up to 4 locations',
      'Up to 30 team members',
      'Order analytics & seasonal watchlists',
      '1 year of order history',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Multi-Location',
    priceMonthly: 59,
    tagline: 'Run ordering across the whole operation.',
    limits: { locations: UNLIMITED, teamMembers: UNLIMITED, historyDays: UNLIMITED },
    features: { analytics: true, prioritySupport: true },
    highlights: [
      'Unlimited locations',
      'Unlimited team members',
      'Unlimited order history',
      'Priority support',
    ],
  },
};

/** True when a limit means "no ceiling". */
export function isUnlimited(limit: number): boolean {
  return !Number.isFinite(limit);
}

/** Renders a limit for the UI — a number, or an infinity glyph for unlimited. */
export function formatLimit(limit: number): string {
  return isUnlimited(limit) ? '∞' : String(limit);
}

/**
 * The plan a company is on. Falls back to `'starter'` until the
 * `companies.plan` column exists and the repo selects it.
 */
export function planFor(company: Pick<Company, 'plan'> | null | undefined): Plan {
  const id = company?.plan;
  return id && PLANS[id] ? PLANS[id] : PLANS.starter;
}

/** A company's current capacity usage — the inputs to every limit check. */
export type CompanyUsage = {
  locations: number;
  teamMembers: number;
};

export type LimitKey = keyof Pick<PlanLimits, 'locations' | 'teamMembers'>;

export type UsageMeter = {
  key: LimitKey;
  label: string;
  used: number;
  limit: number;
  /** False once usage has reached or passed the limit. */
  withinLimit: boolean;
  /** 0–1 fill ratio for a progress meter; 1 when unlimited and unused. */
  ratio: number;
};

/** Usage measured against a plan's limits — one meter per capacity dimension. */
export function usageMeters(plan: Plan, usage: CompanyUsage): UsageMeter[] {
  const meter = (key: LimitKey, label: string, used: number): UsageMeter => {
    const limit = plan.limits[key];
    return {
      key,
      label,
      used,
      limit,
      withinLimit: used < limit || isUnlimited(limit),
      ratio: isUnlimited(limit) ? 0 : Math.min(1, used / limit),
    };
  };
  return [
    meter('locations', 'Locations', usage.locations),
    meter('teamMembers', 'Team members', usage.teamMembers),
  ];
}

/** True when adding one more of `key` would stay inside the plan. */
export function canAddWithinPlan(plan: Plan, key: LimitKey, currentCount: number): boolean {
  return currentCount + 1 <= plan.limits[key] || isUnlimited(plan.limits[key]);
}

/**
 * The cheapest plan that fits the company's current usage. Used to point an
 * over-capacity company at the right upgrade rather than the most expensive one.
 */
export function recommendedPlan(usage: CompanyUsage): Plan {
  const fit = PLAN_ORDER.map((id) => PLANS[id]).find(
    (plan) =>
      (usage.locations <= plan.limits.locations || isUnlimited(plan.limits.locations)) &&
      (usage.teamMembers <= plan.limits.teamMembers || isUnlimited(plan.limits.teamMembers)),
  );
  return fit ?? PLANS.enterprise;
}

/** Position of a plan in the upgrade ladder — higher means more capacity. */
export function planRank(id: PlanId): number {
  return PLAN_ORDER.indexOf(id);
}
