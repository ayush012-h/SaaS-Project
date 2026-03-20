import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
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
import CancelGuide from './pages/CancelGuide'
import Budget from './pages/Budget'
import YearlyReport from './pages/YearlyReport'
import DuplicateDetector from './pages/DuplicateDetector'
import CalendarView from './pages/CalendarView'
import Export from './pages/Export'
import PageTransition, { AnimatePresence } from './components/PageTransition'
import { useLocation } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error }) {
  return (
    <div style={{ padding: 20, color: 'white', background: 'red', height: '100vh', width: '100vw' }}>
      <h1>Crash!</h1>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{error.message}</pre>
    </div>
  )
}

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



function AppRoutes() {
  const location = useLocation()
  const { profile } = useAuth()
  const userPlan = profile?.plan || 'free'

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
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
    </ErrorBoundary>
  )
}




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

export default App;
