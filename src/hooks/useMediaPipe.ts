'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import * as Mediapipe from '@mediapipe/tasks-vision';
import { MEME_DATABASE } from '@/constants/memeDatabase';
import { mapExpressionToMeme } from '@/lib/expressionMapper';
import { analyzeHands, extractHandLandmarksFromResult } from '@/lib/handGestureMapper';

interface DetectedMeme {
  id: string;
  name: string;
}

export function useMediaPipe(onMemeChange: (memeId: string | null) => void) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [detectedMeme, setDetectedMeme] = useState<DetectedMeme | null>(null);
  const faceLandmarkerRef = useRef<any>(null);
  const handLandmarkerRef = useRef<any>(null);
  const lastMemeIdRef = useRef<string | null>(null);
  const frameCountRef = useRef(0);
  const isMobileRef = useRef<boolean>(false);

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

        // Initialize Hand Landmarker for up to 2 hands
        try {
          const handLandmarker = await (Mediapipe as any).HandLandmarker.createFromOptions(
            vision,
            {
              baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/vision_hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
              },
              runningMode: 'VIDEO',
              numHands: 2,
            }
          );
          handLandmarkerRef.current = handLandmarker;
        } catch (e) {
          console.warn('Hand Landmarker failed to initialize:', e);
          handLandmarkerRef.current = null;
        }
        setIsInitialized(true);
        // Detect roughly if device is mobile (small viewport)
        if (typeof window !== 'undefined') {
          isMobileRef.current = window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
        }
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
      if (handLandmarkerRef.current) {
        try { handLandmarkerRef.current.close(); } catch(e) { /* ignore */ }
      }
    };
  }, []);

  // Process each video frame
  const processFrame = useCallback((videoElement: HTMLVideoElement) => {
    if (!faceLandmarkerRef.current || !videoElement) return null;

    // Simple frame throttling for mobile devices
    frameCountRef.current += 1;
    const isMobile = isMobileRef.current;
    const throttleFactor = isMobile ? 3 : 1; // process 1/3 frames on mobile
    if (throttleFactor > 1 && frameCountRef.current % throttleFactor !== 0) {
      return null;
    }

    try {
      // Get current timestamp
      const now = performance.now();

      // Run face detection
      const faceResults = faceLandmarkerRef.current.detectForVideo(videoElement, now);
      let faceLandmarks = null;
      if (faceResults && faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0) {
        faceLandmarks = faceResults.faceLandmarks[0];

        // Map landmarks to expression and find matching meme
        const memeId = mapExpressionToMeme(faceLandmarks);
        const meme = MEME_DATABASE.find((m) => m.id === memeId);

        if (meme && meme.id !== lastMemeIdRef.current) {
          lastMemeIdRef.current = meme.id;
          setDetectedMeme({ id: meme.id, name: meme.name });
          onMemeChange(meme.id);
        }
      } else {
        if (lastMemeIdRef.current !== null) {
          lastMemeIdRef.current = null;
          setDetectedMeme(null);
          onMemeChange(null);
        }
      }

      // Run hand detection (if available)
      let handLandmarksArray: any[] | null = null;
      if (handLandmarkerRef.current) {
        try {
          const handResults = handLandmarkerRef.current.detectForVideo(videoElement, now);
          handLandmarksArray = extractHandLandmarksFromResult(handResults?.handLandmarks || handResults);
        } catch (e) {
          // non-fatal: keep going
          handLandmarksArray = null;
        }
      }

      // Analyze hand gestures (simple heuristics)
      const handAnalyses = analyzeHands(faceLandmarks, handLandmarksArray);

      return { faceLandmarks, handLandmarksArray, handAnalyses };
    } catch (error) {
      console.error('Error processing frame:', error);
      return null;
    }
  }, [onMemeChange]);

  return {
    isInitialized,
    detectedMeme,
    processFrame,
  };
}
