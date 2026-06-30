/**
 * CFOPilot Zustand Store
 * Central state for the financial profile — shared across all pages.
 * Persisted to localStorage so data survives navigation.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CompanyFinancialProfile } from '@/types/financial'

interface FinancialState {
  profile: CompanyFinancialProfile | null
  setFinancialData: (data: CompanyFinancialProfile) => void
  clearFinancialData: () => void
}

export const useFinancialStore = create<FinancialState>()(
  persist(
    (set) => ({
      profile: null,

      setFinancialData: (data: CompanyFinancialProfile) => {
        set({ profile: data })
      },

      clearFinancialData: () => {
        set({ profile: null })
      },
    }),
    {
      name: 'cfopilot-financial-store', // localStorage key
    }
  )
)
