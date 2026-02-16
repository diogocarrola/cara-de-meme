'use client';

import { useEffect, useState } from 'react';

interface InfoModalProps {
  onClose: () => void;
}

export default function InfoModal({ onClose }: InfoModalProps) {
  const [showModal, setShowModal] = useState(true);

  const handleDisableAutoShow = () => {
    localStorage.setItem('cara-de-meme-info-shown', 'true');
    setShowModal(false);
    onClose();
  };

  useEffect(() => {
    const shown = localStorage.getItem('cara-de-meme-info-shown');
    if (shown) {
      setShowModal(false);
      onClose();
    }
  }, [onClose]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 border border-purple-600">
        {/* Header */}
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          📋 Como Funciona
        </h2>

        {/* Content */}
        <div className="space-y-4 text-gray-200 text-sm mb-6">
          <div>
            <h3 className="font-bold text-purple-400 mb-1">📹 Acesso à Câmara</h3>
            <p>Clica em &quot;Abrir Câmara&quot; e autoriza o acesso. Vamos usar a tua câmara frontal.</p>
          </div>

          <div>
            <h3 className="font-bold text-purple-400 mb-1">😊 Detecta Expressões</h3>
            <p>A app vai analisar em tempo real as tuas expressões faciais (sorriso, surpresa, etc.).</p>
          </div>

          <div>
            <h3 className="font-bold text-purple-400 mb-1">😂 Vê o Teu Meme</h3>
            <p>Cada expressão corresponde a um meme português viral! Experimenta diferentes expressões.</p>
          </div>

          <div>
            <h3 className="font-bold text-purple-400 mb-1">📥 Grava e Partilha</h3>
            <p>Grava um clip de 5 segundos e partilha no Instagram, TikTok ou WhatsApp!</p>
          </div>

          <div className="bg-yellow-900 border border-yellow-600 rounded p-3 mt-4">
            <p className="text-xs">
              <strong>⚠️ Privacidade:</strong> A tua câmara funciona apenas no teu dispositivo. Nenhum vídeo é enviado aos nossos servidores.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDisableAutoShow}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Não Mostrar Novamente
          </button>
          <button
            onClick={() => {
              setShowModal(false);
              onClose();
            }}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Começar! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
