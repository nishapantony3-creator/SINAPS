/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create frames directory if it doesn't exist
const framesDir = path.join(__dirname, '..', 'public', 'frames');
if (!fs.existsSync(framesDir)) {
  fs.mkdirSync(framesDir, { recursive: true });
}

// Color interpolation helpers
function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 8, g: 16, b: 38 }; // Default royal Navy
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function interpolateColor(color1, color2, factor) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);
  return rgbToHex(r, g, b);
}

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

// Generate a high-end SVG frame representing a cinematic royal animation
function generateFrameSvg(frameIndex, totalFrames) {
  const p = frameIndex / (totalFrames - 1); // Progress 0 to 1
  
  let bgColor1, bgColor2;
  let state = ""; // hero, separating, exploded, reassembling, stats, final
  let stateProgress = 0;

  if (p <= 0.15) {
    state = "hero";
    stateProgress = p / 0.15;
    bgColor1 = "#081026"; // Deep royal navy
    bgColor2 = "#10214D";
  } else if (p <= 0.32) {
    state = "separating";
    stateProgress = (p - 0.15) / (0.32 - 0.15);
    bgColor1 = interpolateColor("#081026", "#FAF9F6", stateProgress); // Fade to warm linen
    bgColor2 = interpolateColor("#10214D", "#FFF7F0", stateProgress);
  } else if (p <= 0.52) {
    state = "exploded";
    stateProgress = (p - 0.32) / (0.52 - 0.32);
    bgColor1 = "#F3F6FC"; // Sky blue tint
    bgColor2 = "#F3F6FC";
  } else if (p <= 0.68) {
    state = "reassembling";
    stateProgress = (p - 0.52) / (0.68 - 0.52);
    bgColor1 = interpolateColor("#F3F6FC", "#FFF7F0", stateProgress); // Fade to peach
    bgColor2 = interpolateColor("#F3F6FC", "#FFF7F0", stateProgress);
  } else if (p <= 0.80) {
    state = "stats";
    stateProgress = (p - 0.68) / (0.80 - 0.68);
    bgColor1 = interpolateColor("#FFF7F0", "#081026", stateProgress); // Fade back to navy
    bgColor2 = interpolateColor("#FFF7F0", "#10214D", stateProgress);
  } else {
    state = "final";
    stateProgress = (p - 0.80) / 0.20;
    bgColor1 = interpolateColor("#081026", "#FAF9F6", stateProgress); // Fade to warm white
    bgColor2 = interpolateColor("#10214D", "#FAF9F6", stateProgress);
  }

  const width = 1920;
  const height = 1080;

  // Key element coordinates:
  // Final layout sizes
  const finalSunX = width / 2 - 280;
  const finalSunY = height / 2;
  const finalSealX = width / 2 + 280;
  const finalSealY = height / 2;

  let sunX, sunY, sunScale, sunRaysOffset, sunRaysRotation;
  let sealX, sealY, sealScale, sealExplosion, outerRingRotation, innerRingRotation;
  let particleProgress = 0; // Particle drift
  let logoOpacity = 0;
  let goldGlowOpacity = 0.1;

  if (state === "hero") {
    // Hero: Large golden seal on left, glowing sun on right. 
    // Outer rings rotate slowly.
    sunX = width * 0.72;
    sunY = height * 0.5;
    sunScale = 1.05 + Math.sin(stateProgress * Math.PI * 2) * 0.02;
    sunRaysOffset = 0;
    sunRaysRotation = stateProgress * 20;

    sealX = width * 0.28;
    sealY = height * 0.5;
    sealScale = lerp(0.85, 1.0, stateProgress);
    sealExplosion = 0;
    outerRingRotation = stateProgress * 45;
    innerRingRotation = stateProgress * -30;
    particleProgress = stateProgress * 0.1;
    goldGlowOpacity = 0.1 + stateProgress * 0.15;
  }
  else if (state === "separating") {
    // Elements split up: seal parts move away, sun moves left, rings spin faster.
    const t = stateProgress;
    sunX = lerp(width * 0.72, width * 0.25, t);
    sunY = lerp(height * 0.5, height * 0.32, t);
    sunScale = lerp(1.05, 0.82, t);
    sunRaysOffset = lerp(0, 120, t);
    sunRaysRotation = 20 + t * 60;

    sealX = lerp(width * 0.28, width * 0.72, t);
    sealY = lerp(height * 0.5, height * 0.68, t);
    sealScale = lerp(1.0, 0.85, t);
    sealExplosion = lerp(0, 160, t);
    outerRingRotation = 45 + t * 90;
    innerRingRotation = -30 + t * -75;
    particleProgress = 0.1 + t * 0.4;
    goldGlowOpacity = lerp(0.25, 0.05, t);
  }
  else if (state === "exploded") {
    // Peak Exploded state: maximum separation. Everything is floating in zero-G.
    const t = stateProgress;
    const hoverY = Math.sin(t * Math.PI * 2) * 20;
    const hoverX = Math.cos(t * Math.PI * 2) * 15;

    sunX = width * 0.25 + hoverX;
    sunY = height * 0.32 + hoverY;
    sunScale = 0.82;
    sunRaysOffset = 120 + Math.sin(t * Math.PI) * 30;
    sunRaysRotation = 80 + t * 45;

    sealX = width * 0.72 - hoverX;
    sealY = height * 0.68 - hoverY;
    sealScale = 0.85;
    sealExplosion = 160 + Math.sin(t * Math.PI) * 20;
    outerRingRotation = 135 + t * 60;
    innerRingRotation = -105 + t * -45;
    particleProgress = 0.5 + t * 0.3;
    goldGlowOpacity = 0.05;
  }
  else if (state === "reassembling") {
    // Reassembling: heading to final layouts, rings snap back.
    const t = stateProgress;
    sunX = lerp(width * 0.25, finalSunX, t);
    sunY = lerp(height * 0.32, finalSunY, t);
    sunScale = lerp(0.82, 1.1, t);
    sunRaysOffset = lerp(150, 10, t);
    sunRaysRotation = 125 + t * 100;

    sealX = lerp(width * 0.72, finalSealX, t);
    sealY = lerp(height * 0.68, finalSealY, t);
    sealScale = lerp(0.85, 1.1, t);
    sealExplosion = lerp(180, 8, t);
    outerRingRotation = 195 + t * 120;
    innerRingRotation = -150 + t * -90;
    particleProgress = 0.8 - t * 0.5;
    goldGlowOpacity = lerp(0.05, 0.35, t);
  }
  else if (state === "stats") {
    // Assembled and glowing heavy gold/blue on dark navy background
    const t = stateProgress;
    sunX = finalSunX;
    sunY = finalSunY;
    sunScale = 1.1 + Math.sin(t * Math.PI * 2) * 0.03;
    sunRaysOffset = 10;
    sunRaysRotation = 225 + t * 30;

    sealX = finalSealX;
    sealY = finalSealY;
    sealScale = 1.1;
    sealExplosion = 8;
    outerRingRotation = 315 + t * 30;
    innerRingRotation = -240 + t * -20;
    particleProgress = 0.3;
    goldGlowOpacity = 0.35 + Math.sin(t * Math.PI * 2) * 0.15;
    logoOpacity = t;
  }
  else {
    // Final state (Admissions): fully assembled logo and crest side by side on warm cream bg
    const t = stateProgress;
    sunX = finalSunX;
    sunY = finalSunY;
    sunScale = 1.15;
    sunRaysOffset = 0;
    sunRaysRotation = 255 + t * 15;

    sealX = finalSealX;
    sealY = finalSealY;
    sealScale = 1.15;
    sealExplosion = 0;
    outerRingRotation = 345 + t * 15;
    innerRingRotation = -260 + t * -10;
    particleProgress = 0.3 - t * 0.3;
    goldGlowOpacity = 0.5;
    logoOpacity = 1.0;
  }

  // Draw 12 rays for the sun
  let raysHtml = '';
  for (let i = 0; i < 12; i++) {
    const angle = ((i * 30 + sunRaysRotation) * Math.PI) / 180;
    const baseRadius = 140 * sunScale;
    const tipRadius = (205 + sunRaysOffset) * sunScale;
    const rayWidth = 26 * sunScale;

    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const pCos = -sin;
    const pSin = cos;

    const bx1 = sunX + baseRadius * cos - (rayWidth / 2) * pCos;
    const by1 = sunY + baseRadius * sin - (rayWidth / 2) * pSin;
    const bx2 = sunX + baseRadius * cos + (rayWidth / 2) * pCos;
    const by2 = sunY + baseRadius * sin + (rayWidth / 2) * pSin;
    const tx = sunX + tipRadius * cos;
    const ty = sunY + tipRadius * sin;

    raysHtml += `<polygon points="${bx1},${by1} ${bx2},${by2} ${tx},${ty}" fill="url(#goldFoil)" opacity="0.95" />`;
  }

  // Sun core coordinates
  const sunRadius = 120 * sunScale;

  // Crest Exploded Pieces calculation
  const dxSeal = sealExplosion * 0.6;
  const dySeal = sealExplosion * 0.6;

  // Generate vector particle dust (glowing star paths orbiting the seal)
  let particlesHtml = '';
  if (particleProgress > 0) {
    const particleCount = 18;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i * (360 / particleCount) + frameIndex * 2) * (Math.PI / 180);
      const radius = (180 + Math.sin(frameIndex * 0.05 + i) * 60) * sealScale + (particleProgress * 180);
      const px = sealX + radius * Math.cos(angle);
      const py = sealY + radius * Math.sin(angle);
      const size = (6 + Math.sin(i) * 3) * sealScale * (1 - particleProgress * 0.5);

      particlesHtml += `<circle cx="${px}" cy="${py}" r="${size}" fill="url(#goldFoil)" opacity="${0.8 * (1 - particleProgress)}" filter="url(#glowGold)" />`;
    }
  }

  // Render the SVG
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Background Gradients -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgColor1}" />
        <stop offset="100%" stop-color="${bgColor2}" />
      </linearGradient>

      <!-- Premium Gold Foil Gradient -->
      <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFD700" />
        <stop offset="25%" stop-color="#D4AF37" />
        <stop offset="50%" stop-color="#F3E5AB" />
        <stop offset="75%" stop-color="#AA7C11" />
        <stop offset="100%" stop-color="#D4AF37" />
      </linearGradient>

      <!-- Royal Blue Metallic Gradient -->
      <linearGradient id="royalBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2D7BE8" />
        <stop offset="50%" stop-color="#1A5FD4" />
        <stop offset="100%" stop-color="#081026" />
      </linearGradient>

      <!-- Crimson Fire Gradient -->
      <linearGradient id="crimsonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FF4D4D" />
        <stop offset="60%" stop-color="#C8102D" />
        <stop offset="100%" stop-color="#7A0010" />
      </linearGradient>

      <!-- Glow filters -->
      <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="glowHeart" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="15" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Background -->
    <rect width="100%" height="100%" fill="url(#bgGrad)" />

    <!-- Ambient Grid Overlay -->
    <g opacity="0.04" stroke="${bgColor1 === '#FAF9F6' || bgColor1 === '#FFF7F0' ? '#D4AF37' : '#ffffff'}" stroke-width="1.5">
      <line x1="0" y1="270" x2="1920" y2="270" />
      <line x1="0" y1="540" x2="1920" y2="540" />
      <line x1="0" y1="810" x2="1920" y2="810" />
      <line x1="480" y1="0" x2="480" y2="1080" />
      <line x1="960" y1="0" x2="960" y2="1080" />
      <line x1="1440" y1="0" x2="1440" y2="1080" />
    </g>

    <!-- Gold Dust Particles -->
    ${particlesHtml}

    <!-- ================== ELEMENTS: SUN ================== -->
    <g>
      <!-- Sun Rays -->
      ${raysHtml}
      
      <!-- Sun Core with Gold Foil -->
      <g transform="translate(${sunX}, ${sunY})">
        <!-- Gold Glow -->
        <circle r="${sunRadius}" fill="url(#goldFoil)" opacity="${goldGlowOpacity}" filter="url(#glowGold)" />
        
        <!-- Outer Yellow/Gold Ring (10-sided polygon) -->
        <polygon points="
          0,-${125 * sunScale} 73,-${101 * sunScale} 118,-${38 * sunScale} 123,${41 * sunScale} 78,${104 * sunScale}
          0,${128 * sunScale} -73,${101 * sunScale} -118,${38 * sunScale} -123,-${41 * sunScale} -78,-${104 * sunScale}" 
          fill="url(#goldFoil)" />

        <!-- Inner Orange/Crimson Core -->
        <polygon points="
          0,-${112 * sunScale} 65,-${91 * sunScale} 106,-${34 * sunScale} 110,${37 * sunScale} 70,${94 * sunScale}
          0,${115 * sunScale} -65,${91 * sunScale} -106,${34 * sunScale} -110,-${37 * sunScale} -70,-${94 * sunScale}" 
          fill="#FF6B1A" />
          
        <!-- Core Golden Highlight -->
        <polygon points="
          0,-${70 * sunScale} 40,-${57 * sunScale} 66,-${21 * sunScale} 68,${23 * sunScale} 43,${59 * sunScale}
          0,${72 * sunScale} -40,${57 * sunScale} -66,${21 * sunScale} -68,-${23 * sunScale} -43,-${59 * sunScale}" 
          fill="url(#goldFoil)" opacity="0.9" />
      </g>
    </g>

    <!-- ================== ELEMENTS: SCHOOL SEAL / CREST ================== -->
    <!-- Seal Group -->
    <g transform="scale(${sealScale}) translate(${(sealX) / sealScale}, ${(sealY) / sealScale})">
      
      <!-- Outer Ring (Splits up: drifts outwards/upwards, rotates on scroll) -->
      <g transform="rotate(${outerRingRotation}, ${-dxSeal * 0.15}, ${-dySeal * 0.15})">
        <!-- Gold outer rings -->
        <circle cx="${-dxSeal * 0.15}" cy="${-dySeal * 0.15}" r="152" fill="none" stroke="url(#goldFoil)" stroke-width="6" opacity="0.95" />
        <circle cx="${-dxSeal * 0.15}" cy="${-dySeal * 0.15}" r="144" fill="none" stroke="#C8102D" stroke-width="12" opacity="0.95" />
        <circle cx="${-dxSeal * 0.15}" cy="${-dySeal * 0.15}" r="136" fill="none" stroke="url(#goldFoil)" stroke-width="2" opacity="0.9" />
        <circle cx="${-dxSeal * 0.15}" cy="${-dySeal * 0.15}" r="134" fill="#FAF9F6" />

        <!-- Circular text along path -->
        <path id="textPathTop" d="M ${-115 - dxSeal * 0.15},${-dxSeal * 0.15} A 115,115 0 0,1 ${115 - dxSeal * 0.15},${-dxSeal * 0.15}" fill="none" />
        <text font-family="'Nunito', sans-serif" font-size="13" font-weight="900" fill="#081026" letter-spacing="1.8" opacity="${lerp(1.0, 0.1, sealExplosion / 180)}">
          <textPath href="#textPathTop" startOffset="50%" text-anchor="middle">ST. IGNATIUS NURSERY &amp; PRI. SCHOOL</textPath>
        </text>

        <!-- Bottom location/pin text -->
        <path id="textPathBottom" d="M ${-115 - dxSeal * 0.15},${-dxSeal * 0.15} A 115,115 0 0,0 ${115 - dxSeal * 0.15},${-dxSeal * 0.15}" fill="none" />
        <text font-family="'Nunito', sans-serif" font-size="12" font-weight="800" fill="#C8102D" letter-spacing="2.2" opacity="${lerp(1.0, 0.1, sealExplosion / 180)}">
          <textPath href="#textPathBottom" startOffset="50%" text-anchor="middle">* BUDAPADI - 638 311 *</textPath>
        </text>
      </g>

      <!-- Inner Shield (Drifts downwards/left, rotates on opposite direction) -->
      <g transform="translate(${-dxSeal * 0.55}, ${dySeal * 0.25}) rotate(${innerRingRotation}, 0, 0)">
        
        <!-- Gold Glow of the Shield -->
        <path d="M -64,-64 C -64,-64 64,-64 64,-64 C 64,12 52,58 0,84 C -52,58 -64,12 -64,-64 Z" fill="url(#goldFoil)" opacity="0.3" filter="url(#glowGold)" />

        <!-- Shield Outer Border (Gold Foil) -->
        <path d="M -62,-62 C -62,-62 62,-62 62,-62 C 62,10 50,56 0,81 C -50,56 -62,10 -62,-62 Z" fill="url(#goldFoil)" />
        <path d="M -56,-56 C -56,-56 56,-56 56,-56 C 56,8 46,50 0,73 C -46,50 -56,8 -56,-56 Z" fill="#FAF9F6" />
        <!-- Shield Royal Blue Infill -->
        <path d="M -52,-52 C -52,-52 52,-52 52,-52 C 52,6 42,46 0,68 C -42,46 -52,6 -52,-52 Z" fill="url(#royalBlueGrad)" />
        
        <!-- Sacred Heart (Drifts up, glows Crimson/Gold) -->
        <g transform="translate(0, ${-12 - dySeal * 0.45})">
          <!-- Heart Glow -->
          <path d="M 0,-15 C -25,-35 -40,-10 -25,15 C -15,25 0,40 0,40 C 0,40 15,25 25,15 C 40,-10 25,-35 0,-15 Z" fill="url(#crimsonGrad)" opacity="0.6" filter="url(#glowHeart)" />
          
          <!-- Heart Shape with Gold Outline -->
          <path d="M 0,-15 C -25,-35 -40,-10 -25,15 C -15,25 0,40 0,40 C 0,40 15,25 25,15 C 40,-10 25,-35 0,-15 Z" fill="url(#crimsonGrad)" stroke="url(#goldFoil)" stroke-width="2.5" />
          
          <!-- Cross on top of Heart (Gold Foil) -->
          <rect x="-3.5" y="-31" width="7" height="16" fill="url(#goldFoil)" stroke="#081026" stroke-width="1.5" />
          <rect x="-10" y="-26" width="20" height="6" fill="url(#goldFoil)" stroke="#081026" stroke-width="1.5" />
          
          <!-- Flames (Crimson/Yellow) -->
          <path d="M -8,-31 C -12,-37 -4,-44 0,-44 C 4,-44 12,-37 8,-31 Z" fill="url(#goldFoil)" />
          <path d="M -4,-31 C -6,-34 -2,-38 0,-38 C 2,-38 6,-34 4,-31 Z" fill="#C8102D" />
        </g>
        
        <!-- Open Book (Drifts down, gold lines) -->
        <g transform="translate(0, ${28 + dySeal * 0.45})">
          <!-- Book Pages with Gold Outline -->
          <path d="M -36,0 C -26,-8 -10,-8 0,0 L 0,23 C -10,15 -26,15 -36,23 Z" fill="#FAF9F6" stroke="url(#goldFoil)" stroke-width="2.5" />
          <path d="M 36,0 C 26,-8 10,-8 0,0 L 0,23 C 10,15 26,15 36,23 Z" fill="#FAF9F6" stroke="url(#goldFoil)" stroke-width="2.5" />
          
          <!-- Book Lines representing letters (Gold lines) -->
          <line x1="-28" y1="6" x2="-8" y2="6" stroke="#D4AF37" stroke-width="2" />
          <line x1="-28" y1="11" x2="-8" y2="11" stroke="#D4AF37" stroke-width="2" />
          <line x1="-28" y1="16" x2="-8" y2="16" stroke="#D4AF37" stroke-width="2" />
          
          <line x1="8" y1="6" x2="28" y2="6" stroke="#D4AF37" stroke-width="2" />
          <line x1="8" y1="11" x2="28" y2="11" stroke="#D4AF37" stroke-width="2" />
          <line x1="8" y1="16" x2="28" y2="16" stroke="#D4AF37" stroke-width="2" />
        </g>
      </g>
      
      <!-- Logo Title SINAPS inside Seal (Drifts right/up) -->
      <g transform="translate(${dxSeal * 0.35}, ${-dySeal * 0.35})">
        <rect x="-48" y="-13" width="96" height="26" rx="6" fill="url(#goldFoil)" opacity="${lerp(1.0, 0.2, sealExplosion / 180)}" stroke="#081026" stroke-width="1" />
        <text x="0" y="5" font-family="'Nunito', sans-serif" font-size="14" font-weight="900" fill="#081026" text-anchor="middle" letter-spacing="1.2" opacity="${lerp(1.0, 0.2, sealExplosion / 180)}">SINAPS</text>
      </g>

      <!-- Banner Ribbon (Drifts straight down) -->
      <g transform="translate(0, ${100 + dySeal * 0.65})">
        <!-- Ribbon Shape (Gold Foil) -->
        <path d="M -94,-11 L 94,-11 L 84,11 L -84,11 Z" fill="url(#goldFoil)" stroke="#081026" stroke-width="2" filter="url(#glowGold)" />
        <path d="M -94,-11 L 94,-11 L 84,11 L -84,11 Z" fill="url(#goldFoil)" stroke="#081026" stroke-width="2" />
        <path d="M -94,-11 L -84,11 L -104,6 Z" fill="#AA7C11" stroke="#081026" stroke-width="1.5" />
        <path d="M 94,-11 L 84,11 L 104,6 Z" fill="#AA7C11" stroke="#081026" stroke-width="1.5" />
        <!-- Ribbon Text (Crimson / Navy) -->
        <text x="0" y="4" font-family="'Inter', sans-serif" font-size="8" font-weight="800" fill="#081026" text-anchor="middle" letter-spacing="1.8">LIBERATION THROUGH KNOWLEDGE</text>
      </g>
    </g>

    <!-- ================== ELEMENTS: LOGO TEXT ================== -->
    <!-- Brand identity next to sun in stats and final states -->
    <g opacity="${logoOpacity}" transform="translate(${finalSunX + 30}, ${finalSunY + 160})">
      <!-- Slanted text: "sinaps" in Crimson Red with Gold Foil outline -->
      <text x="-40" y="30" font-family="'Nunito', sans-serif" font-size="68" font-weight="900" font-style="italic" fill="url(#goldFoil)" stroke="#C8102D" stroke-width="2" letter-spacing="-1">sinaps</text>
      <!-- "English Medium School" underneath in Gold Foil -->
      <text x="-38" y="72" font-family="'Inter', sans-serif" font-size="20" font-weight="800" font-style="italic" fill="#081026" letter-spacing="0.5">English Medium School</text>
    </g>
  </svg>`;
}

// Write the 100 frames to folder
async function generateAllFrames() {
  const totalFrames = 100;
  console.log(`Starting generation of ${totalFrames} frames...`);
  
  const batchSize = 10;
  for (let i = 0; i < totalFrames; i += batchSize) {
    const promises = [];
    const end = Math.min(i + batchSize, totalFrames);
    
    for (let frameIndex = i; frameIndex < end; frameIndex++) {
      const frameNumStr = String(frameIndex + 1).padStart(4, '0');
      const filename = `frame_${frameNumStr}.jpg`;
      const outputPath = path.join(framesDir, filename);

      const svgContent = generateFrameSvg(frameIndex, totalFrames);
      const svgBuffer = Buffer.from(svgContent);

      const promise = sharp(svgBuffer)
        .jpeg({ quality: 90 })
        .toFile(outputPath)
        .then(() => {
          if ((frameIndex + 1) % 10 === 0) {
            console.log(`Generated ${frameIndex + 1}/${totalFrames} frames...`);
          }
        })
        .catch(err => {
          console.error(`Error generating ${filename}:`, err);
        });

      promises.push(promise);
    }

    await Promise.all(promises);
  }

  console.log("All frames generated successfully!");
}

generateAllFrames();
