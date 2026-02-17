// Simple heuristics to detect basic hand gestures from MediaPipe hand landmarks
// Assumes hand landmarks follow MediaPipe hand 21-point model:
// 0: wrist, 4: thumb_tip, 8: index_tip, 12: middle_tip, 16: ring_tip, 20: pinky_tip

function dist(a: {x:number,y:number}, b: {x:number,y:number}){
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function avgTipDistanceToWrist(landmarks: any[]){
  const wrist = landmarks[0];
  const tips = [4,8,12,16,20];
  let s = 0;
  for (const i of tips){ s += dist(wrist, landmarks[i]); }
  return s / tips.length;
}

export type HandAnalysis = {
  landmarks: any[];
  gesture: 'open'|'fist'|'index_up'|'on_chin'|'unknown';
  handedness?: string;
}

export function analyzeHands(faceLandmarks: any[] | null, handLandmarksArray: any[] | null): HandAnalysis[] {
  if (!handLandmarksArray || handLandmarksArray.length === 0) return [];

  // approximate chin point from face landmarks (largest y)
  let chinPoint: {x:number,y:number} | null = null;
  if (faceLandmarks && faceLandmarks.length > 0) {
    let maxY = -Infinity;
    for (const p of faceLandmarks){ if (p.y > maxY){ maxY = p.y; chinPoint = { x: p.x, y: p.y }; }}
  }

  const results: HandAnalysis[] = [];
  for (const landmarks of handLandmarksArray) {
    const avg = avgTipDistanceToWrist(landmarks);

    // heuristics thresholds (normalized coordinates): tuned conservatively
    const OPEN_THRESHOLD = 0.12; // larger distances -> open
    const FIST_THRESHOLD = 0.06; // small distances -> fist

    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    const wrist = landmarks[0];

    let gesture: HandAnalysis['gesture'] = 'unknown';

    if (avg > OPEN_THRESHOLD) {
      gesture = 'open';
    } else if (avg < FIST_THRESHOLD) {
      gesture = 'fist';
    } else {
      // check index_up: index extended significantly more than others
      const idxDist = dist(wrist, indexTip);
      const midDist = dist(wrist, middleTip);
      const otherAvg = (midDist + dist(wrist, ringTip) + dist(wrist, pinkyTip)) / 3;
      if (idxDist > otherAvg * 1.35 && idxDist > 0.08) {
        gesture = 'index_up';
      }
    }

    // hand on chin: check wrist proximity to chin (if face available)
    if (chinPoint) {
      const wristToChin = dist(wrist, chinPoint);
      // relative threshold: compare to face height approx (distance between chin and forehead)
      // approximate face height using range of face landmarks y
      let faceMinY = Infinity, faceMaxY = -Infinity;
      for (const p of faceLandmarks!){ if (p.y < faceMinY) faceMinY = p.y; if (p.y > faceMaxY) faceMaxY = p.y; }
      const faceHeight = faceMaxY - faceMinY;
      if (faceHeight > 0 && wristToChin < Math.max(0.08, faceHeight * 0.25)) {
        gesture = 'on_chin';
      }
    }

    results.push({ landmarks, gesture });
  }

  return results;
}

export function extractHandLandmarksFromResult(handResult: any) {
  // handResult may be an object from MediaPipe Tasks API; try common fields
  if (!handResult) return null;
  if (Array.isArray(handResult)) return handResult; // already array
  if ((handResult as any).handLandmarks) return (handResult as any).handLandmarks;
  return null;
}
