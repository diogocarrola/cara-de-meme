'use client';

import { useEffect, useRef, useState } from 'react';
import { useMediaPipe } from '@/hooks/useMediaPipe';
import { useDebug } from '@/context/DebugContext';

interface CameraFeedProps {
  onMemeChange: (memeId: string | null) => void;
}

export default function CameraFeed({ onMemeChange }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { isInitialized, detectedMeme, processFrame } = useMediaPipe(onMemeChange);

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        setLoading(true);
        setCameraError(null);

        // Request camera permissions
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Wait for video to be ready
          videoRef.current.onloadedmetadata = () => {
            setLoading(false);
          };
        }
      } catch (error) {
        setCameraError(
          error instanceof Error
            ? error.message
            : 'Não foi possível aceder à câmara. Verifica as permissões.'
        );
        setLoading(false);
      }
    };

    initializeCamera();

    return () => {
      const video = videoRef.current;
      if (video?.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const { debug } = useDebug();

  // Draw landmarks onto canvas
  const drawLandmarks = (landmarks: any[], video: HTMLVideoElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !landmarks || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match video
    const vw = video.videoWidth || video.clientWidth;
    const vh = video.videoHeight || video.clientHeight;
    if (canvas.width !== vw || canvas.height !== vh) {
      canvas.width = vw;
      canvas.height = vh;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each landmark as a small circle
    ctx.fillStyle = 'rgba(0, 200, 255, 0.9)';
    for (let i = 0; i < landmarks.length; i++) {
      const p = landmarks[i];
      const x = p.x * canvas.width;
      const y = p.y * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Process frames for MediaPipe detection and draw landmarks
  useEffect(() => {
    if (!videoRef.current || !isInitialized || loading) return;

    const processVideoFrame = () => {
      const landmarks = processFrame(videoRef.current!);
      if (debug && landmarks && canvasRef.current) {
        drawLandmarks(landmarks, videoRef.current!);
      } else if (canvasRef.current) {
        // Clear canvas if debug is off or no landmarks
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      requestAnimationFrame(processVideoFrame);
    };

    processVideoFrame();
  }, [isInitialized, loading, processFrame, debug]);

  if (cameraError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-red-400 p-4">
        <p className="text-lg font-bold mb-2">❌ Erro de Câmara</p>
        <p className="text-sm text-center">{cameraError}</p>
        <p className="text-xs text-gray-500 mt-4">
          Certifica-te de que deste permissão à câmara no navegador.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* Canvas for drawing landmarks */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-white">Iniciando câmara...</p>
          </div>
        </div>
      )}

      {/* Status Badge */}
      {isInitialized && !loading && (
        <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          ✓ Ativo
        </div>
      )}

      {/* Current Meme Detection Display */}
      {detectedMeme && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-xs max-w-xs">
          <p className="font-bold">{detectedMeme.name}</p>
        </div>
      )}
    </div>
  );
}
