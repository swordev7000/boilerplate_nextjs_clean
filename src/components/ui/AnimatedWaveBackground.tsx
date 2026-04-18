"use client";

import { useEffect, useRef } from "react";

interface WaveConfig {
  hue: number;
  amplitude: number;
  frequency: number;
  speed: number;
  opacity: number;
  lineWidth: number;
}

const WAVES: WaveConfig[] = [
  {
    hue: 200,
    amplitude: 40,
    frequency: 0.058,
    speed: 0.03,
    opacity: 0.7,
    lineWidth: 1.5,
  },
  {
    hue: 220,
    amplitude: 55,
    frequency: 0.022,
    speed: 0.022,
    opacity: 0.6,
    lineWidth: 1.2,
  },
  {
    hue: 250,
    amplitude: 30,
    frequency: 0.03,
    speed: 0.038,
    opacity: 0.5,
    lineWidth: 1.0,
  },
  {
    hue: 180,
    amplitude: 65,
    frequency: 0.014,
    speed: 0.018,
    opacity: 0.4,
    lineWidth: 1.8,
  },
  {
    hue: 270,
    amplitude: 45,
    frequency: 0.025,
    speed: 0.028,
    opacity: 0.55,
    lineWidth: 1.3,
  },
  {
    hue: 190,
    amplitude: 25,
    frequency: 0.035,
    speed: 0.04,
    opacity: 1,
    lineWidth: 10,
  },
];

interface AnimatedWaveBackgroundProps {
  /** Background color of the canvas */
  bgColor?: string;
  /** Extra Tailwind classes for the wrapper div */
  className?: string;
  /** Content rendered on top of the waves */
  children?: React.ReactNode;
}

export default function AnimatedWaveBackground({
  bgColor = "#0a0a1a",
  className = "",
  children,
}: AnimatedWaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      const { width: w, height: h } = canvas;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      const t = tRef.current;

      WAVES.forEach((wave, i) => {
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${wave.hue}, 100%, 65%, ${wave.opacity})`;
        ctx.lineWidth = wave.lineWidth;
        ctx.shadowColor = `hsla(${wave.hue}, 100%, 70%, 0.4)`;
        ctx.shadowBlur = 8;

        const baseY = (h / (WAVES.length + 1)) * (i + 1);

        for (let x = 0; x <= w; x += 2) {
          const y =
            baseY +
            Math.sin(x * wave.frequency + t * wave.speed) * wave.amplitude +
            Math.sin(x * wave.frequency * 1.7 + t * wave.speed * 0.6) *
              (wave.amplitude * 0.4);

          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      tRef.current += 1;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [bgColor]);

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
