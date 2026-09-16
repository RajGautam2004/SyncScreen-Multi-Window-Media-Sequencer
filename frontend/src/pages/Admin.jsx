import React, { useState, useEffect } from 'react';
import { getWindows, getMedia } from '../services/api';
import AdminForm from '../components/AdminForm';
import SyncPanel from '../components/SyncPanel';

const Admin = () => {
  const [windows, setWindows] = useState([]);
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    // Fetch data for the dropdowns
    getWindows().then(res => setWindows(res.data)).catch(console.error);
    getMedia().then(res => setMediaList(res.data)).catch(console.error);
  }, []);

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Administration</h1>
        <p className="text-slate-400 mt-1">Manage media, playlists, and trigger global syncs.</p>
      </div>

      {/* Sync Panel Section */}
      <SyncPanel mediaList={mediaList} />

      <hr className="border-slate-700/50" />

      {/* Standard Management Section */}
      <AdminForm windows={windows} />
      
    </div>
  );
};

export default Admin;
