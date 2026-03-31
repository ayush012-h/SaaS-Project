import { useState, useEffect, useCallback } from 'react'

const CACHE_KEY = 'subtrackr_fx_rates'
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

export const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
]

export function getCurrencySymbol(code) {
  return SUPPORTED_CURRENCIES.find(c => c.code === code)?.symbol || code
}

export function useCurrencyRates(baseCurrency = 'INR') {
  const [rates, setRates] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchRates() {
      // Check cache
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const { timestamp, data } = JSON.parse(cached)
          if (Date.now() - timestamp < CACHE_TTL) {
            setRates(data)
            return
          }
        }
      } catch { /* ignore cache errors */ }

      setLoading(true)
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/INR')
        if (!res.ok) throw new Error('Failed to fetch rates')
        const json = await res.json()
        const fetchedRates = json.rates || {}
        setRates(fetchedRates)
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          data: fetchedRates
        }))
      } catch (err) {
        setError(err.message)
        // Fallback approximate rates from INR
        setRates({ INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0094, JPY: 1.78, AUD: 0.018, CAD: 0.016, SGD: 0.016 })
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
  }, [])

  /**
   * Convert an amount from a source currency to the display currency.
   * All subscription amounts are stored in their own currency (e.g. ₹ or $).
   * We first convert to INR (base), then to the target.
   */
  const convert = useCallback((amount, fromCurrencySymbol, toCurrencyCode) => {
    if (!amount) return 0
    // Attempt to map symbol → code
    const fromCode = SUPPORTED_CURRENCIES.find(c => c.symbol === fromCurrencySymbol)?.code || 'INR'
    if (fromCode === toCurrencyCode) return amount
    if (!rates[fromCode] || !rates[toCurrencyCode]) return amount

    // Convert: amount → INR → target
    const inINR = amount / rates[fromCode]
    return inINR * rates[toCurrencyCode]
  }, [rates])

  return { rates, loading, error, convert, baseCurrency }
}
