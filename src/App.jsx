import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AppLayout from './components/Layout/AppLayout'
import LandingPage from './pages/Home/LandingPage'
import FeaturesPage from './pages/Home/FeaturesPage'
import HowItWorksPage from './pages/Home/HowItWorksPage'
import PricingPage from './pages/Home/PricingPage'
import AboutPage from './pages/Home/AboutPage'
import PrivacyPage from './pages/Legal/PrivacyPage'
import TermsPage from './pages/Legal/TermsPage'
import AuthPage from './pages/Auth/AuthPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import SubscriptionsPage from './pages/Subscriptions/SubscriptionsPage'
import AnalyticsPage from './pages/Analytics/AnalyticsPage'
import AlertsPage from './pages/Alerts/AlertsPage'
import SettingsPage from './pages/Settings/SettingsPage'
import EmailScannerPage from './pages/Scanner/EmailScannerPage'
import NotFound from './pages/NotFound'
import BetaBanner from './components/BetaBanner'
import FeedbackWidget from './components/FeedbackWidget'
import OnboardingModal from './components/OnboardingModal'
import PageTransition, { AnimatePresence } from './components/PageTransition'
import { useLocation } from 'react-router-dom'

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

function HomeRoute() {
  const { session, loading } = useAuth()
  if (loading) return (
    <PageTransition>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-primary)' }}>
        <div className="w-8 h-8 border-2 border-border border-t-brand-teal rounded-full animate-spin" />
      </div>
    </PageTransition>
  )
  return session ? <Navigate to="/dashboard" replace /> : <LandingPage />
}

function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomeRoute />} />
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
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BetaBanner />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1A1A2A',
              color: '#E8E8F0',
              border: '1px solid #2A2A3A',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600',
              padding: '12px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
            success: {
              icon: '✓',
              iconTheme: { primary: '#4CFF8F', secondary: '#1A1A2A' },
            },
            error: {
              icon: '✕',
              iconTheme: { primary: '#FF6363', secondary: '#1A1A2A' },
            },
            loading: {
              iconTheme: { primary: '#6C63FF', secondary: '#1A1A2A' },
            },
          }}
        />
        <AppRoutes />
        <OnboardingModal />
        <FeedbackWidget darkMode={true} />
      </AuthProvider>
    </BrowserRouter>
  )
}
