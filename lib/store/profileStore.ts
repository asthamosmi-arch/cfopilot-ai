/**
 * CFOPilot profile store
 * Persists the financial profile across page navigations using localStorage.
 * Simple and explicit — no magic, no dependencies.
 */

import type { CompanyFinancialProfile } from '@/types/financial'

const STORAGE_KEY = 'cfopilot_profile'

export function saveProfile(profile: CompanyFinancialProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch (e) {
    console.error('[profileStore] Failed to save profile:', e)
  }
}

export function loadProfile(): CompanyFinancialProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CompanyFinancialProfile
  } catch (e) {
    console.error('[profileStore] Failed to load profile:', e)
    return null
  }
}

export function clearProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error('[profileStore] Failed to clear profile:', e)
  }
}
