"use client";

import { useEffect, useRef } from "react";

interface AnimatedWaveBackgroundProps {
  /** Number of stacked ribbon lines */
  lineCount?: number;
  /** Max wave amplitude in px */
  amplitude?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Color stops for the ribbon gradient (left to right) */
  colorStops?: string[];
  /** Extra Tailwind classes for the wrapper */
  className?: string;
  /** Content rendered on top of the waves */
  children?: React.ReactNode;
}

function lerpColor(a: string, b: string, t: number): string {
  const ah = parseInt(a.replace("#", ""), 16);
  const bh = parseInt(b.replace("#", ""), 16);
  const ar = (ah >> 16) & 0xff,
    ag = (ah >> 8) & 0xff,
    ab = ah & 0xff;
  const br = (bh >> 16) & 0xff,
    bg = (bh >> 8) & 0xff,
    bb = bh & 0xff;
  return `rgb(${Math.round(ar + (br - ar) * t)},${Math.round(ag + (bg - ag) * t)},${Math.round(
    ab + (bb - ab) * t,
  )})`;
}

function getColorFromStops(stops: string[], frac: number): string {
  const segments = stops.length - 1;
  const scaled = frac * segments;
  const idx = Math.min(Math.floor(scaled), segments - 1);
  return lerpColor(stops[idx], stops[idx + 1], scaled - idx);
}

export default function AnimatedWaveBackground2({
  lineCount = 30,
  amplitude = 55,
  speed = 0.024,
  colorStops = ["#4a90e2", "#5bc8d8", "#2a2a2a", "#a0a0a0"],
  className = "",
  children,
}: AnimatedWaveBackgroundProps) {
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
      const { offsetWidth: w, offsetHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const t = tRef.current;
      const spread = 6;
      const centerY = h * 0.45;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);

      for (let li = 0; li < lineCount; li++) {
        const frac = li / (lineCount - 1);
        const color = getColorFromStops(colorStops, frac);
        const offset = (li - lineCount / 2) * spread;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.85;
        ctx.globalAlpha = 0.75;

        for (let x = 0; x <= w; x += 2) {
          const nx = x / w;
          const y =
            centerY +
            offset +
            Math.sin(nx * 3.5 * Math.PI + t * speed) * amplitude +
            Math.sin(nx * 6 * Math.PI + t * speed * 1.4 + li * 0.05) *
              (amplitude * 0.35) +
            Math.sin(nx * 2 * Math.PI - t * speed * 0.7) * (amplitude * 0.2);

          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      tRef.current += 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [lineCount, amplitude, speed, colorStops]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-white ${className}`}
    >
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
