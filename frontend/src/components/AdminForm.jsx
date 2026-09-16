import React, { useState } from 'react';
import { createMedia, assignToPlaylist } from '../services/api';
import { PlusCircle, Link as LinkIcon } from 'lucide-react';

const AdminForm = ({ windows }) => {
  const [formData, setFormData] = useState({
    title: '', url: '', type: 'image', durationSeconds: 10
  });
  const [assignData, setAssignData] = useState({
    windowId: '', mediaId: '', sequenceOrder: 1
  });

  const handleCreateMedia = async (e) => {
    e.preventDefault();
    try {
      await createMedia({ ...formData, durationSeconds: parseInt(formData.durationSeconds) });
      alert('Media created successfully!');
      // Reset form
      setFormData({ title: '', url: '', type: 'image', durationSeconds: 10 });
    } catch (error) {
      console.error(error);
      alert('Failed to create media');
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assignData.windowId || !assignData.mediaId) {
      alert("Please enter Window ID and Media ID");
      return;
    }
    try {
      await assignToPlaylist({
        windowId: parseInt(assignData.windowId),
        mediaId: parseInt(assignData.mediaId),
        sequenceOrder: parseInt(assignData.sequenceOrder)
      });
      alert('Assigned successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to assign to playlist');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Create Media Form */}
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><PlusCircle className="text-primary"/> Add New Media</h2>
        <form onSubmit={handleCreateMedia} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Title</label>
            <input required type="text" className="input-field w-full" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Summer Promo" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">URL (empty for blank)</label>
            <input type="text" className="input-field w-full" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Type</label>
              <select className="input-field w-full" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="blank">Blank</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Duration (sec)</label>
              <input required type="number" min="1" className="input-field w-full" value={formData.durationSeconds} onChange={e => setFormData({...formData, durationSeconds: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btn-primary mt-2">Create Media</button>
        </form>
      </div>

      {/* Assign to Playlist Form */}
      <div className="glass-panel p-6 border-accent/30">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><LinkIcon className="text-accent"/> Assign to Window</h2>
        <form onSubmit={handleAssign} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Select Window</label>
            <select required className="input-field w-full" value={assignData.windowId} onChange={e => setAssignData({...assignData, windowId: e.target.value})}>
              <option value="">-- Choose Window --</option>
              {windows.map(w => (
                <option key={w.id} value={w.id}>{w.name} (ID: {w.id})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Media ID</label>
            <input required type="number" className="input-field w-full" value={assignData.mediaId} onChange={e => setAssignData({...assignData, mediaId: e.target.value})} placeholder="e.g. 1" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Sequence Order</label>
            <input required type="number" min="1" className="input-field w-full" value={assignData.sequenceOrder} onChange={e => setAssignData({...assignData, sequenceOrder: e.target.value})} />
          </div>
          <button type="submit" className="btn-primary bg-accent hover:bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.5)] mt-2">Add to Playlist</button>
        </form>
      </div>
    </div>
  );
};

export default AdminForm;
