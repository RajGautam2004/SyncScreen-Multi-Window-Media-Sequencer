import React, { useState, useEffect } from 'react';
import { Clock, Monitor, Play, AlertTriangle } from 'lucide-react';
import MediaRenderer from './MediaRenderer';

const WindowCard = ({ windowInfo, wsMessages }) => {
  const [currentMedia, setCurrentMedia] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Process incoming WebSocket messages to update this specific window
  useEffect(() => {
    if (wsMessages.length === 0) return;

    // Look at the most recent message
    const latestMsg = wsMessages[0];

    // Handle Window State update (regular playback)
    if (latestMsg.type === 'window_state' && latestMsg.windowId === windowInfo.id) {
      setCurrentMedia(latestMsg.media);
      // Calculate remaining time based on duration and position offset
      const remaining = latestMsg.media.durationSeconds - latestMsg.position;
      setTimeLeft(remaining > 0 ? remaining : 0);
    }

    // Handle global sync events
    if (latestMsg.type === 'sync_started') {
      setIsSyncing(true);
      setCurrentMedia(latestMsg.media);
      setTimeLeft(latestMsg.duration);
    }

    if (latestMsg.type === 'sync_ended') {
      setIsSyncing(false);
    }
  }, [wsMessages, windowInfo.id]);

  // Local countdown timer for visual feedback
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="glass-panel p-5 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 hover:shadow-primary/20">
      
      {/* Decorative Glow if Syncing */}
      {isSyncing && (
        <div className="absolute inset-0 bg-accent/10 animate-pulse pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Monitor className="text-primary" />
          {windowInfo.name}
        </h2>
        
        {/* Timer Badge */}
        {currentMedia && (
          <div className={`px-3 py-1 rounded-full text-sm font-mono flex items-center gap-2 border ${isSyncing ? 'bg-accent/20 border-accent text-accent-100 shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'bg-slate-800 border-slate-600 text-slate-300'}`}>
            <Clock size={14} className={isSyncing ? "animate-spin-slow" : ""} />
            00:{timeLeft.toString().padStart(2, '0')}
          </div>
        )}
      </div>

      {/* Media Display Area */}
      <div className="aspect-video w-full rounded-lg shadow-inner bg-black overflow-hidden border border-slate-700/50 z-10">
        <MediaRenderer media={currentMedia} />
      </div>

      {/* Status Bar */}
      <div className="z-10 flex items-center justify-between text-sm text-slate-400 mt-2">
        <div className="flex items-center gap-2">
          {isSyncing ? (
            <span className="flex items-center gap-1 text-accent font-medium">
              <AlertTriangle size={14} /> Global Sync Active
            </span>
          ) : currentMedia ? (
            <span className="flex items-center gap-1 text-primary">
              <Play size={14} /> Playing Sequence
            </span>
          ) : (
            <span>No Media</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WindowCard;
