'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import * as Mediapipe from '@mediapipe/tasks-vision';
import { MEME_DATABASE } from '@/constants/memeDatabase';
import { mapExpressionToMeme } from '@/lib/expressionMapper';

interface DetectedMeme {
  id: string;
  name: string;
}

export function useMediaPipe(onMemeChange: (memeId: string | null) => void) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [detectedMeme, setDetectedMeme] = useState<DetectedMeme | null>(null);
  const faceLandmarkerRef = useRef<any>(null);
  const lastMemeIdRef = useRef<string | null>(null);

  // Initialize MediaPipe
  useEffect(() => {
    const initializeMediaPipe = async () => {
      try {
        const vision = await (Mediapipe as any).FilesetResolver.forVisionOnWeb({
          locateFileHandler: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm/${file}`;
          },
        });

        const faceLandmarker = await (Mediapipe as any).FaceLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath: `https://storage.googleapis.com/mediapipe-models/vision_face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            },
            runningMode: 'VIDEO',
            numFaces: 1,
          }
        );

        faceLandmarkerRef.current = faceLandmarker;
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize MediaPipe:', error);
        setIsInitialized(false);
      }
    };

    initializeMediaPipe();

    return () => {
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
      }
    };
  }, []);

  // Process each video frame
  const processFrame = useCallback((videoElement: HTMLVideoElement) => {
    if (!faceLandmarkerRef.current || !videoElement) return;

    try {
      // Get current timestamp
      const now = performance.now();

      // Run face detection
      const results = faceLandmarkerRef.current.detectForVideo(
        videoElement,
        now
      );

      if (results.faceLandmarks.length > 0) {
        // Get the first face
        const landmarks = results.faceLandmarks[0];

        // Map landmarks to expression and find matching meme
        const memeId = mapExpressionToMeme(landmarks);
        const meme = MEME_DATABASE.find((m) => m.id === memeId);

        if (meme && meme.id !== lastMemeIdRef.current) {
          lastMemeIdRef.current = meme.id;
          setDetectedMeme({
            id: meme.id,
            name: meme.name,
          });
          onMemeChange(meme.id);
        }
      } else {
        // No face detected
        if (lastMemeIdRef.current !== null) {
          lastMemeIdRef.current = null;
          setDetectedMeme(null);
          onMemeChange(null);
        }
      }
    } catch (error) {
      console.error('Error processing frame:', error);
    }
  }, [onMemeChange]);

  return {
    isInitialized,
    detectedMeme,
    processFrame,
  };
}
