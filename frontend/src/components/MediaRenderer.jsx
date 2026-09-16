import React from 'react';
import { Image, PlaySquare, Monitor } from 'lucide-react';

// MediaRenderer conditionally renders the correct media type
const MediaRenderer = ({ media }) => {
  if (!media) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-slate-900/50 rounded-lg text-slate-500">
        <Monitor size={48} className="mb-4 opacity-50" />
        <span className="font-medium">Waiting for signal...</span>
      </div>
    );
  }

  // Render Image
  if (media.type === 'image') {
    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden group">
        <img 
          src={media.url} 
          alt={media.title} 
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 shadow-lg border border-white/10">
          <Image size={12} className="text-primary" /> {media.title}
        </div>
      </div>
    );
  }

  // Render Video
  if (media.type === 'video') {
    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden bg-black group">
        {/* We use autoPlay and loop. Note: position resume would require a ref to standard HTMLVideoElement to set currentTime */}
        <video 
          src={media.url} 
          autoPlay 
          muted 
          loop 
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 shadow-lg border border-white/10">
          <PlaySquare size={12} className="text-accent" /> {media.title}
        </div>
      </div>
    );
  }

  // Render Blank Screen
  return (
    <div className="w-full h-full bg-black rounded-lg flex items-center justify-center border border-slate-800">
      <span className="text-slate-700 font-mono text-sm tracking-widest uppercase">Blank Screen</span>
    </div>
  );
};

export default MediaRenderer;
