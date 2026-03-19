import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
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
import BetaBanner from './components/BetaBanner'
import FeedbackWidget from './components/FeedbackWidget'
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
  
  console.log('HomeRoute: rendering', { session: !!session, loading })
  
  // Temporary test - show simple content instead of LandingPage
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0F', color: 'white', fontSize: '24px' }}>
        Loading app...
      </div>
    )
  }
  
  // Show simple test page instead of LandingPage for now
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: 'white', padding: '50px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>SubTrackr is Working!</h1>
      <p style={{ fontSize: '20px', marginBottom: '30px' }}>The app loaded successfully.</p>
      <div style={{ background: '#1A1A2E', padding: '20px', borderRadius: '10px', margin: '20px auto', maxWidth: '500px' }}>
        <p>Session: {session ? 'Logged In' : 'Not Logged In'}</p>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
      </div>
      <button 
        onClick={() => window.location.href = '/register'}
        style={{ background: '#6C63FF', color: 'white', padding: '15px 30px', border: 'none', borderRadius: '8px', fontSize: '18px', cursor: 'pointer' }}
      >
        Get Started
      </button>
    </div>
  )
}

function AppRoutes() {
  const location = useLocation()
  const { profile } = useAuth()
  const userPlan = profile?.plan || 'free'

  return (
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
  )
}


import { ThemeProvider } from './contexts/ThemeContext'
import { UserProvider } from './context/UserContext'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <div style={{ color: 'white' }}>
              <BetaBanner />
              <AppRoutes />
              <FeedbackWidget />
            </div>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
