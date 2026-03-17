import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const bannerHeight = 40 // Matches the height of the global BetaBanner

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary">
      <div className="flex flex-1 relative">
        <div style={{ width: 256 }}> {/* Sidebar placeholder to push main content */}
          <Sidebar style={{ top: bannerHeight }} />
        </div>
        <main className="flex-1 min-h-screen overflow-auto">
          <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
