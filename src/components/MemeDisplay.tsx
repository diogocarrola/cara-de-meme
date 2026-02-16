'use client';

import { useEffect, useState } from 'react';
import { getMemeById } from '@/constants/memeDatabase';

interface MemeDisplayProps {
  memeId: string;
}

export default function MemeDisplay({ memeId }: MemeDisplayProps) {
  const [meme, setMeme] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const memeData = getMemeById(memeId);
    setMeme(memeData);
    setLoading(false);
  }, [memeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!meme) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Meme não encontrado</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      {/* Meme Content */}
      <div className="relative w-full h-full flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden">
        {meme.type === 'image' ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={meme.url}
            alt={meme.name}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).src = '/memes/placeholder.svg';
            }}
          />
        ) : (
          <video
            src={meme.url}
            autoPlay
            loop
            muted
            className="max-w-full max-h-full object-contain"
            onError={() => {
              console.error('Failed to load video:', meme.url);
            }}
          />
        )}
      </div>

      {/* Meme Info */}
      <div className="mt-4 text-center">
        <h2 className="text-xl font-bold text-white">{meme.name}</h2>
        <p className="text-sm text-gray-400 mt-1">{meme.description}</p>
        <div className="flex gap-2 justify-center mt-2">
          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
            {meme.category}
          </span>
        </div>
      </div>
    </div>
  );
}
