"use client";

import { useEffect, useRef } from "react";

export interface WaveRibbonConfig {
  /** Number of lines in the ribbon */
  lineCount?: number;
  /** Gap in px between each line */
  lineGap?: number;
  /** Line thickness in px */
  lineWidth?: number;
  /** Max wave amplitude in px */
  amplitude?: number;
  /** Animation speed (1–12 recommended) */
  speed?: number;
  /** Base frequency of the wave (higher = more waves) */
  frequency?: number;
  /** How much frequency varies across the wave (0–1) */
  frequencyChaos?: number;
  /** Max opacity of lines (0–1) */
  opacity?: number;
  /** Background color */
  bgColor?: string;
  /** Vertical center of ribbon (0 = top, 1 = bottom) */
  centerY?: number;
  className?: string;
  children?: React.ReactNode;
}

const COLOR_STOPS: [number, number, number][] = [
  [60, 130, 230],
  [80, 190, 220],
  [30, 30, 30],
  [170, 170, 175],
];

function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function getColor(norm: number): [number, number, number] {
  const scaled = norm * (COLOR_STOPS.length - 1);
  const idx = Math.min(Math.floor(scaled), COLOR_STOPS.length - 2);
  return lerpColor(COLOR_STOPS[idx], COLOR_STOPS[idx + 1], scaled - idx);
}

export default function WaveRibbonBackground({
  lineCount = 1,
  lineGap = 12,
  lineWidth = 3,
  amplitude = 120,
  speed = 6,
  frequency = 0.25,
  frequencyChaos = 10.2,
  opacity = 0.7,
  bgColor = "#fbfcff",
  centerY = 0.42,
  className = "",
  children,
}: WaveRibbonConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const animSpeed = speed * 0.007;
    const freq = frequency * 0.001;

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const t = tRef.current;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);

      const cy = H * centerY;
      const totalHeight = (lineCount - 1) * lineGap;

      for (let i = 0; i < lineCount; i++) {
        const norm = i / Math.max(lineCount - 1, 1);
        const vertOffset = -totalHeight / 2 + i * lineGap;

        const [r, g, b] = getColor(norm);
        const alpha = opacity * (0.35 + Math.sin(norm * Math.PI) * 0.65);
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        for (let x = 0; x <= W; x += 2) {
          const nx = x / W;
          const freqMod =
            freq * (1 + Math.sin(nx * Math.PI * 2.5 + norm) * frequencyChaos);
          const ampMod =
            amplitude * (0.55 + Math.sin(nx * Math.PI + norm * 0.8) * 0.45);

          const y =
            cy +
            vertOffset +
            Math.sin(x * freqMod + t * animSpeed + norm * 1.8) * ampMod +
            Math.sin(x * freqMod * 2.1 + t * animSpeed * 1.3 + norm * 0.9) *
              (ampMod * 0.28);

          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      tRef.current += 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [
    lineCount,
    lineGap,
    lineWidth,
    amplitude,
    speed,
    frequency,
    frequencyChaos,
    opacity,
    bgColor,
    centerY,
  ]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />
      {children && (
        <div className="relative z-10 w-full h-full">{children}</div>
      )}
    </div>
  );
}
