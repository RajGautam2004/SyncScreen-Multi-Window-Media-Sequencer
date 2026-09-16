import { Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Settings } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="glass-panel rounded-none border-t-0 border-x-0 border-b-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <LayoutDashboard size={20} />
              </div>
              Media Sequencer
            </div>
            <div className="flex space-x-4">
              <Link to="/" className="text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-md font-medium flex items-center gap-2">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link to="/admin" className="text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-md font-medium flex items-center gap-2">
                <Settings size={18} />
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
