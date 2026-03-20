// src/hooks/useIsMobile.js
import { useState, useEffect } from 'react'

export function useIsMobile(breakpoint = 768) {
  // Start with false — never access window during initial render
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Safe — only runs after component mounts in browser
    function check() {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Check immediately on mount
    check()

    // Re-check on window resize
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])

  return isMobile
}

export default useIsMobile