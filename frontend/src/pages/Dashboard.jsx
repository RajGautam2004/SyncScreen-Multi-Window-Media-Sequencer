import React, { useEffect, useState, useMemo } from 'react';
import { getWindows } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import WindowCard from '../components/WindowCard';
import { Activity } from 'lucide-react';

const Dashboard = () => {
  const [windows, setWindows] = useState([]);
  
  // Determine WebSocket URL based on environment API URL
  const wsUrl = useMemo(() => {
    const apiBase = import.meta.env.VITE_API_URL || 'https://syncscreen-multi-window-media-sequencer.onrender.com';
    return apiBase.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws';
  }, []);

  // Initialize WebSocket connection to backend
  const { messages, isConnected } = useWebSocket(wsUrl);

  const fetchWindows = async () => {
    try {
      const res = await getWindows();
      setWindows(res.data);
    } catch (error) {
      console.error("Failed to fetch windows:", error);
    }
  };

  useEffect(() => {
    fetchWindows();
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Live Dashboard</h1>
          <p className="text-slate-400 mt-1">Real-time media sequence monitoring</p>
        </div>
        
        {/* Connection Status */}
        <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border ${isConnected ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          <Activity size={16} className={isConnected ? "animate-pulse" : ""} />
          {isConnected ? 'WS Connected' : 'WS Disconnected'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {windows.map((win) => (
          <WindowCard 
            key={win.id} 
            windowInfo={win} 
            wsMessages={messages} 
          />
        ))}
        {windows.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 glass-panel">
            <p className="text-lg">No windows available.</p>
            <p className="text-sm">Please make sure the backend seed data ran successfully.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
