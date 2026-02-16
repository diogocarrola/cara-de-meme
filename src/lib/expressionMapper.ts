/**
 * Expression Mapper - Converts facial landmarks to expressions
 * 
 * MediaPipe Face Landmarks Reference (478 points):
 * - Key indices:
 *   0: Head position
 *   1-10: Face contour (left)
 *   33: Left eye outer corner
 *   133: Left eye inner corner
 *   263: Right eye outer corner
 *   362: Right eye inner corner
 *   7: Mouth left
 *   10: Mouth right
 *   14: Mouth center bottom
 *   13: Mouth center top
 *   33: Left eyebrow
 *   263: Right eyebrow
 */

export interface FacialExpression {
  mouthOpen: number; // 0-100
  smile: number; // 0-100
  eyesWide: number; // 0-100
  leftEyebrowRaised: number; // 0-100
  rightEyebrowRaised: number; // 0-100
  headTilt: number; // -90 to 90 (left to right)
}

/**
 * Calculate distance between two 3D points
 */
function distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

/**
 * Extract expression metrics from face landmarks
 */
export function extractExpression(landmarks: any[]): FacialExpression {
  if (landmarks.length < 478) {
    return {
      mouthOpen: 0,
      smile: 0,
      eyesWide: 0,
      leftEyebrowRaised: 0,
      rightEyebrowRaised: 0,
      headTilt: 0,
    };
  }

  // Mouth opening detection
  // Distance between upper and lower lips
  const mouthTop = landmarks[13]; // Upper middle
  const mouthBottom = landmarks[14]; // Lower middle
  const mouthLeft = landmarks[7];
  const mouthRight = landmarks[10];
  const mouthWidth = distance(mouthLeft, mouthRight);
  const mouthHeight = distance(mouthTop, mouthBottom);
  const mouthOpen = Math.min(100, (mouthHeight / mouthWidth) * 100);

  // Smile detection
  // Use mouth corners elevation
  const mouthLeftCorner = landmarks[88];
  const mouthRightCorner = landmarks[318];
  const noseTip = landmarks[1];
  
  const leftCornerAboveNose = Math.max(0, noseTip.y - mouthLeftCorner.y);
  const rightCornerAboveNose = Math.max(0, noseTip.y - mouthRightCorner.y);
  const smile = Math.min(100, (leftCornerAboveNose + rightCornerAboveNose) * 200);

  // Eyes wide detection
  // Distance between upper and lower eyelids
  const leftEyeTop = landmarks[159];
  const leftEyeBottom = landmarks[145];
  const rightEyeTop = landmarks[386];
  const rightEyeBottom = landmarks[374];
  
  const leftEyeHeight = distance(leftEyeTop, leftEyeBottom);
  const rightEyeHeight = distance(rightEyeTop, rightEyeBottom);
  const eyesWide = Math.min(100, (leftEyeHeight + rightEyeHeight) * 200);

  // Eyebrow raising detection
  const leftEyebrow = landmarks[36];
  const rightEyebrow = landmarks[266];
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];
  
  const leftEyebrowRaised = Math.min(100, Math.max(0, (leftEye.y - leftEyebrow.y) * 300));
  const rightEyebrowRaised = Math.min(100, Math.max(0, (rightEye.y - rightEyebrow.y) * 300));

  // Head tilt detection
  // Use line between eyes to detect tilt
  const leftEyePos = landmarks[33];
  const rightEyePos = landmarks[263];
  const eyeAngle = Math.atan2(rightEyePos.y - leftEyePos.y, rightEyePos.x - leftEyePos.x);
  const headTilt = (eyeAngle * 180) / Math.PI;

  return {
    mouthOpen: Math.round(mouthOpen),
    smile: Math.round(smile),
    eyesWide: Math.round(eyesWide),
    leftEyebrowRaised: Math.round(leftEyebrowRaised),
    rightEyebrowRaised: Math.round(rightEyebrowRaised),
    headTilt: Math.round(headTilt),
  };
}

/**
 * Map facial expression to a meme ID
 * Uses simple heuristics to match expressions to memes
 */
export function mapExpressionToMeme(landmarks: any[]): string {
  const expression = extractExpression(landmarks);

  // Decision tree for meme matching
  // This is a simple heuristic-based approach

  // Wide smile with normal eyes = Happy/Cachorro
  if (expression.smile > 60 && expression.eyesWide > 30 && expression.mouthOpen < 40) {
    return 'cachorro_piada';
  }

  // Mouth wide open, eyes wide = Surprise
  if (expression.mouthOpen > 70 && expression.eyesWide > 70) {
    return 'nazare_confusa';
  }

  // Head tilted significantly, eyebrows raised = Confused
  if (Math.abs(expression.headTilt) > 15 && expression.leftEyebrowRaised > 50) {
    return 'confused';
  }

  // Mouth open but not smiling = Speaking/Shocked
  if (expression.mouthOpen > 60 && expression.smile < 30) {
    return 'shocked';
  }

  // Eyebrows raised = Surprised
  if (expression.leftEyebrowRaised > 60 || expression.rightEyebrowRaised > 60) {
    return 'surprised';
  }

  // Slight smile = Natural
  if (expression.smile > 30 && expression.smile < 60) {
    return 'neutral_smile';
  }

  // Default to neutral
  return 'neutral';
}
