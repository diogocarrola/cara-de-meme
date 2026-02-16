'use client';

import { useState } from 'react';
import CameraFeed from '@/components/CameraFeed';
import MemeDisplay from '@/components/MemeDisplay';
import Controls from '@/components/Controls';
import InfoModal from '@/components/InfoModal';

export default function Home() {
  const [cameraActive, setCameraActive] = useState(false);
  const [currentMeme, setCurrentMeme] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="flex flex-col w-screen h-screen bg-black overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Cara de Meme 🇵🇹</h1>
        <p className="text-sm opacity-90">Descobre que meme português és!</p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-2 p-2 overflow-hidden">
        {/* Camera Feed - Top (Mobile) / Left (Desktop) */}
        <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
          {cameraActive ? (
            <CameraFeed onMemeChange={setCurrentMeme} />
          ) : (
            <div className="text-center">
              <p className="text-gray-400 mb-4">Clica em &quot;Abrir Câmara&quot; para começar</p>
              <button
                onClick={() => setCameraActive(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                Abrir Câmara 📹
              </button>
            </div>
          )}
        </div>

        {/* Meme Display - Bottom (Mobile) / Right (Desktop) */}
        <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
          {cameraActive && currentMeme ? (
            <MemeDisplay memeId={currentMeme} />
          ) : (
            <div className="text-center text-gray-400">
              <p>Aqui aparecerá o meme correspondente à tua expressão</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      {cameraActive && (
        <Controls
          isRecording={isRecording}
          onRecordingChange={setIsRecording}
          onClose={() => setCameraActive(false)}
        />
      )}

      {/* Info Modal */}
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}

      {/* Footer Stats */}
      <footer className="bg-gray-900 text-gray-400 text-center py-2 text-xs">
        <p>Feito com ❤️ em Portugal | Partilha com os teus amigos!</p>
      </footer>
    </div>
  );
}
