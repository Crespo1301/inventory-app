/**
 * Role capability checks. One source of truth for "what can this role do",
 * used to gate both navigation and individual actions.
 */

import type { Membership, UserRole } from '@/src/domain';

export type Capability =
  | 'flagLowStock' // mark an item low / out
  | 'viewOrders' // see the order planner
  | 'editOrderQuantities' // override suggested quantities
  | 'verifyOrder' // confirm + finalize an order list
  | 'manageItems' // edit catalog, par levels, vendors
  | 'manageLocations' // add/edit locations, hours, images
  | 'managePeople' // invite users, assign roles + location access
  | 'manageCompany'; // company-level settings, billing

const capabilitiesByRole: Record<UserRole, Capability[]> = {
  member: ['flagLowStock'],
  manager: ['flagLowStock', 'viewOrders', 'editOrderQuantities', 'verifyOrder', 'manageItems'],
  admin: [
    'flagLowStock',
    'viewOrders',
    'editOrderQuantities',
    'verifyOrder',
    'manageItems',
    'manageLocations',
    'managePeople',
    'manageCompany',
  ],
};

export function can(role: UserRole, capability: Capability): boolean {
  return capabilitiesByRole[role].includes(capability);
}

/** Locations a membership may act on. Admins see everything; others are scoped. */
export function visibleLocationIds(membership: Membership, allLocationIds: string[]): string[] {
  return membership.role === 'admin' ? allLocationIds : membership.locationIds;
}

export const roleLabel: Record<UserRole, string> = {
  admin: 'Admin',
  manager: 'Manager',
  member: 'Team Member',
};
