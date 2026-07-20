"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Imagem com tratamento de câmera de vigilância (referência: barbianaliu.com,
 * e o TCC dela — vigilância/mediação algorítmica):
 * - nasce pixelada grossa e "foca" (blocos diminuem) como uma CFTV detectando;
 * - overlay REC piscando, timestamp ao vivo e cantoneiras.
 * Usa setInterval (não rAF) de propósito: continua funcionando em abas ocultas.
 */

const CCTV_CSS = `
  .spy { position: relative; width: 100%; height: 100%; background: #000; }
  .spy canvas { width: 100%; height: 100%; display: block; image-rendering: pixelated; }
  .spy__hud {
    position: absolute; inset: 0; pointer-events: none;
    font-family: var(--font-mono); font-size: 10px;
    text-transform: uppercase; letter-spacing: .12em; color: var(--acid);
  }
  .spy__rec { position: absolute; top: 8px; left: 10px; display: flex; align-items: center; gap: 6px; }
  .spy__dot {
    width: 8px; height: 8px; border-radius: 50%; background: #ff2222;
    animation: spy-blink 1s step-end infinite;
  }
  @keyframes spy-blink { 50% { opacity: 0; } }
  .spy__time { position: absolute; bottom: 8px; right: 10px; }
  .spy__cam { position: absolute; bottom: 8px; left: 10px; opacity: .8; }
  .spy__corner { position: absolute; width: 14px; height: 14px; border-color: var(--acid); border-style: solid; border-width: 0; }
  .spy__corner--tl { top: 4px; left: 4px; border-top-width: 1px; border-left-width: 1px; }
  .spy__corner--tr { top: 4px; right: 4px; border-top-width: 1px; border-right-width: 1px; }
  .spy__corner--bl { bottom: 4px; left: 4px; border-bottom-width: 1px; border-left-width: 1px; }
  .spy__corner--br { bottom: 4px; right: 4px; border-bottom-width: 1px; border-right-width: 1px; }
  .spy__scan {
    position: absolute; inset: 0;
    background: repeating-linear-gradient(0deg, rgba(0,0,0,.14) 0 1px, transparent 1px 3px);
    mix-blend-mode: multiply;
  }
`;

export default function SpyImage({
  src,
  camLabel = "cam 01",
  width = 300,
  height = 380,
}: {
  src: string;
  camLabel?: string;
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [time, setTime] = useState("");

  // relógio ao vivo (só no client — evita mismatch de hidratação)
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // pixelação que "foca": blocos 26px → 5px quando a imagem troca
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    img.src = src;

    let block = 26;
    let id: ReturnType<typeof setInterval> | undefined;

    const draw = () => {
      if (!img.complete || img.naturalWidth === 0) return;
      // recorte proporcional tipo object-fit: cover
      const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
      const sw = width / scale;
      const sh = height / scale;
      const sx = (img.naturalWidth - sw) / 2;
      const sy = (img.naturalHeight - sh) / 2;

      const cw = Math.max(1, Math.round(width / block));
      const ch = Math.max(1, Math.round(height / block));
      ctx.imageSmoothingEnabled = true;
      ctx.clearRect(0, 0, width, height);
      // desenha pequeno...
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
      // ...e amplia sem suavizar = mosaico
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(canvas, 0, 0, cw, ch, 0, 0, width, height);
    };

    const start = () => {
      draw();
      id = setInterval(() => {
        block = Math.max(5, block - 3);
        draw();
        if (block <= 5 && id) clearInterval(id);
      }, 55);
    };

    if (img.complete) start();
    else img.onload = start;

    return () => {
      if (id) clearInterval(id);
      img.onload = null;
    };
  }, [src, width, height]);

  return (
    <div className="spy">
      <style>{CCTV_CSS}</style>
      <canvas ref={canvasRef} />
      <div className="spy__scan" />
      <div className="spy__hud">
        <span className="spy__rec">
          <span className="spy__dot" /> rec
        </span>
        <span className="spy__cam">{camLabel}</span>
        <span className="spy__time">{time}</span>
        <span className="spy__corner spy__corner--tl" />
        <span className="spy__corner spy__corner--tr" />
        <span className="spy__corner spy__corner--bl" />
        <span className="spy__corner spy__corner--br" />
      </div>
    </div>
  );
}
