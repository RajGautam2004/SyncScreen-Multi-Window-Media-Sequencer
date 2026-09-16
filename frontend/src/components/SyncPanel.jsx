import React, { useState } from 'react';
import { triggerSync } from '../services/api';
import { Zap } from 'lucide-react';

const SyncPanel = ({ mediaList }) => {
  const [syncData, setSyncData] = useState({
    mediaId: '', duration: 15
  });
  const [loading, setLoading] = useState(false);

  const handleSync = async (e) => {
    e.preventDefault();
    if (!syncData.mediaId) return alert("Select media to sync");
    
    setLoading(true);
    try {
      await triggerSync(syncData.mediaId, syncData.duration);
      // We don't alert success here because the WebSocket will instantly show the sync visually
    } catch (error) {
      console.error(error);
      alert('Failed to trigger sync');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 bg-gradient-to-br from-surface to-slate-900 border-yellow-500/30 relative overflow-hidden group">
      <div className="absolute -right-10 -top-10 text-yellow-500/5 group-hover:text-yellow-500/10 transition-colors duration-500">
        <Zap size={150} />
      </div>
      
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-400 relative z-10"><Zap /> Global Sync Override</h2>
      <p className="text-sm text-slate-400 mb-6 relative z-10">
        Instantly interrupt all windows to broadcast a specific media. When the duration expires, all windows will perfectly resume their original sequence.
      </p>

      <form onSubmit={handleSync} className="flex flex-col sm:flex-row items-end gap-4 relative z-10">
        <div className="flex-1 w-full">
          <label className="block text-sm text-slate-400 mb-1">Select Media</label>
          <select required className="input-field w-full border-yellow-500/50 focus:border-yellow-400 focus:ring-yellow-400" value={syncData.mediaId} onChange={e => setSyncData({...syncData, mediaId: e.target.value})}>
            <option value="">-- Choose Media --</option>
            {mediaList.map(m => (
              <option key={m.id} value={m.id}>{m.title} ({m.type}) - ID: {m.id}</option>
            ))}
          </select>
        </div>
        
        <div className="w-full sm:w-32">
          <label className="block text-sm text-slate-400 mb-1">Duration (s)</label>
          <input required type="number" min="1" className="input-field w-full border-yellow-500/50 focus:border-yellow-400 focus:ring-yellow-400" value={syncData.duration} onChange={e => setSyncData({...syncData, duration: e.target.value})} />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-2 px-6 rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:shadow-[0_0_25px_rgba(234,179,8,0.6)] disabled:opacity-50 w-full sm:w-auto"
        >
          {loading ? 'Sending...' : 'FIRE SYNC'}
        </button>
      </form>
    </div>
  );
};

export default SyncPanel;
