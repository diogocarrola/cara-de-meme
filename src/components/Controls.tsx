'use client';

import { useState } from 'react';

interface ControlsProps {
  isRecording: boolean;
  onRecordingChange: (recording: boolean) => void;
  onClose: () => void;
}

export default function Controls({
  isRecording,
  onRecordingChange,
  onClose,
}: ControlsProps) {
  const [recordingTime, setRecordingTime] = useState(0);

  const handleRecord = () => {
    if (!isRecording) {
      setRecordingTime(0);
      onRecordingChange(true);
    } else {
      onRecordingChange(false);
    }
  };

  const handleDownload = () => {
    // TODO: Implement video download
    alert('Download será implementado na Fase 4');
  };

  const handleShare = () => {
    // TODO: Implement sharing
    alert('Partilha será implementada na Fase 5');
  };

  return (
    <div className="bg-gradient-to-t from-gray-900 to-gray-800 border-t border-gray-700 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {/* Record Button */}
          <button
            onClick={handleRecord}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isRecording ? '⏹️ Parar Gravação' : '⏺️ Gravar (5s)'}
            {isRecording && (
              <span className="text-sm">({recordingTime}s)</span>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={true}
            className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold bg-gray-600 text-gray-300 cursor-not-allowed opacity-50"
          >
            📥 Download
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            disabled={true}
            className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold bg-gray-600 text-gray-300 cursor-not-allowed opacity-50"
          >
            📤 Partilhar
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2 rounded-lg font-bold bg-gray-600 hover:bg-gray-700 text-white transition"
          >
            ❌ Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
