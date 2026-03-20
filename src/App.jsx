import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useLocation } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import PageTransition, { AnimatePresence } from './components/PageTransition'

// Always loaded (structural / first-paint critical)
import AppLayout   from './components/Layout/AppLayout'
import AuthPage    from './pages/Auth/AuthPage'
import NotFound    from './pages/NotFound'
import LandingPage from './pages/Home/LandingPage'

// Lazy loaded — only downloads when user visits
const FeaturesPage    = lazy(() => import('./pages/Home/FeaturesPage'))
const HowItWorksPage  = lazy(() => import('./pages/Home/HowItWorksPage'))
const PricingPage     = lazy(() => import('./pages/Home/PricingPage'))
const AboutPage       = lazy(() => import('./pages/Home/AboutPage'))
const PrivacyPage     = lazy(() => import('./pages/Legal/PrivacyPage'))
const TermsPage       = lazy(() => import('./pages/Legal/TermsPage'))

// Dashboard pages
const DashboardPage     = lazy(() => import('./pages/Dashboard/DashboardPage'))
const SubscriptionsPage = lazy(() => import('./pages/Subscriptions/SubscriptionsPage'))
const AnalyticsPage     = lazy(() => import('./pages/Analytics/AnalyticsPage'))
const AlertsPage        = lazy(() => import('./pages/Alerts/AlertsPage'))
const SettingsPage      = lazy(() => import('./pages/Settings/SettingsPage'))
const EmailScannerPage  = lazy(() => import('./pages/Scanner/EmailScannerPage'))

// Pro feature pages — heaviest, load only when needed
const CancelGuide       = lazy(() => import('./pages/CancelGuide'))
const Budget            = lazy(() => import('./pages/Budget'))
const YearlyReport      = lazy(() => import('./pages/YearlyReport'))
const DuplicateDetector = lazy(() => import('./pages/DuplicateDetector'))
const CalendarView      = lazy(() => import('./pages/CalendarView'))
const Export            = lazy(() => import('./pages/Export'))

// Spinner shown while lazy page loads
function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0A0A0F',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{
          width: 36,
          height: 36,
          border: '3px solid rgba(108,99,255,0.2)',
          borderTop: '3px solid #6C63FF',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <span style={{ fontSize: 13, color: '#666680', fontWeight: 500 }}>
          Loading...
        </span>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// Error boundary — nicer than the red crash screen
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div style={{
      padding: 40,
      color: 'white',
      background: '#0A0A0F',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
      <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800 }}>
        Something went wrong
      </h2>
      <p style={{ color: '#666680', margin: '0 0 24px', fontSize: 14 }}>
        The app encountered an error. Try refreshing.
      </p>
      <div style={{
        background: '#1A1A2A',
        border: '1px solid rgba(255,99,99,0.3)',
        borderRadius: 10,
        padding: '12px 16px',
        maxWidth: 500,
        width: '100%',
        marginBottom: 24,
      }}>
        <code style={{
          color: '#FF6363',
          fontSize: 12,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}>
          {error?.message}
        </code>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={resetErrorBoundary}
          style={{
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)',
            border: 'none', borderRadius: 10,
            color: '#fff', fontWeight: 700,
            cursor: 'pointer', fontSize: 14,
          }}
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '10px 24px',
            background: 'transparent',
            border: '1px solid #1E1E2E',
            borderRadius: 10, color: '#9999BB',
            fontWeight: 700, cursor: 'pointer', fontSize: 14,
          }}
        >
          Go Home
        </button>
      </div>
    </div>
  )
}

// Protected route
function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  if (loading) return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="w-8 h-8 border-2 border-border border-t-brand-teal rounded-full animate-spin" />
      </div>
    </PageTransition>
  )
  return session ? children : <Navigate to="/login" replace />
}

// Public route
function PublicRoute({ children }) {
  const { session, loading } = useAuth()
  if (loading) return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="w-8 h-8 border-2 border-border border-t-brand-teal rounded-full animate-spin" />
      </div>
    </PageTransition>
  )
  return session ? <Navigate to="/dashboard" replace /> : children
}

// Routes
function AppRoutes() {
  const location = useLocation()
  const { profile } = useAuth()
  const userPlan = profile?.plan || 'free'

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.href = '/'}
    >
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/features" element={<PageTransition><FeaturesPage /></PageTransition>} />
            <Route path="/how-it-works" element={<PageTransition><HowItWorksPage /></PageTransition>} />
            <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="/privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />
            <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />

            <Route path="/login" element={<PublicRoute><PageTransition><AuthPage initialMode="login" /></PageTransition></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><PageTransition><AuthPage initialMode="register" /></PageTransition></PublicRoute>} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
              <Route path="/subscriptions" element={<PageTransition><SubscriptionsPage /></PageTransition>} />
              <Route path="/analytics" element={<PageTransition><AnalyticsPage /></PageTransition>} />
              <Route path="/alerts" element={<PageTransition><AlertsPage /></PageTransition>} />
              <Route path="/scanner" element={<PageTransition><EmailScannerPage /></PageTransition>} />
              <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
              <Route path="/cancel-guide" element={<PageTransition><CancelGuide userPlan={userPlan} /></PageTransition>} />
              <Route path="/budget" element={<PageTransition><Budget userPlan={userPlan} /></PageTransition>} />
              <Route path="/yearly-report" element={<PageTransition><YearlyReport userPlan={userPlan} /></PageTransition>} />
              <Route path="/duplicate-detector" element={<PageTransition><DuplicateDetector userPlan={userPlan} /></PageTransition>} />
              <Route path="/calendar-view" element={<PageTransition><CalendarView userPlan={userPlan} /></PageTransition>} />
              <Route path="/export" element={<PageTransition><Export userPlan={userPlan} /></PageTransition>} />
            </Route>

            <Route path="*" element={<NotFound />} />

          </Routes>
        </AnimatePresence>
      </Suspense>
    </ErrorBoundary>
  )
}

// Root
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <div style={{ color: 'white' }}>
            <Toaster position="top-right" />
            <AppRoutes />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App