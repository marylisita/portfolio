"use client";
import { useEffect, useRef } from "react";

/**
 * Imagem que NASCE NÍTIDA e vai se desfazendo em pixels conforme sobe na tela
 * (referência: barbianaliu.com — pedido dela: "começa nítida e depois os pixels
 * vão se formando").
 *
 * Mapeamento: enquanto o elemento está abaixo do centro da viewport → nítido.
 * Depois que passa do centro rumo ao topo → o mosaico cresce progressivamente.
 * É puramente reativo ao scroll: nada trava, nada prende a página.
 */
export default function PixelScrollImage({
  src,
  alt = "",
  maxBlock = 26,
  className,
  style,
}: {
  src: string;
  alt?: string;
  maxBlock?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = src;

    let lastBlock = -1;
    let raf = 0;
    let ready = false;

    const sizeCanvas = () => {
      const r = wrap.getBoundingClientRect();
      if (!r.width) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      lastBlock = -1;
    };

    const draw = (block: number) => {
      if (!ready || !canvas.width) return;
      const b = Math.max(1, Math.round(block));
      if (b === lastBlock) return;
      lastBlock = b;

      const W = canvas.width;
      const H = canvas.height;
      // recorte proporcional (object-fit: cover)
      const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const sw = W / scale;
      const sh = H / scale;
      const sx = (img.naturalWidth - sw) / 2;
      const sy = (img.naturalHeight - sh) / 2;

      ctx.clearRect(0, 0, W, H);
      if (b <= 1) {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
        return;
      }
      const cw = Math.max(1, Math.round(W / b));
      const ch = Math.max(1, Math.round(H / b));
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(canvas, 0, 0, cw, ch, 0, 0, W, H);
    };

    const update = () => {
      raf = 0;
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = r.top + r.height / 2;
      // 1 quando o centro do elemento está no meio da tela; 0 quando saiu por cima
      const p = 1 - Math.min(1, Math.max(0, center / (vh * 0.5)));
      draw(1 + p * (maxBlock - 1));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const start = () => {
      ready = true;
      sizeCanvas();
      update();
    };

    if (img.complete && img.naturalWidth) start();
    else img.onload = start;

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { sizeCanvas(); update(); });
    const ro = new ResizeObserver(() => { sizeCanvas(); update(); });
    ro.observe(wrap);

    return () => {
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      img.onload = null;
    };
  }, [src, maxBlock]);

  return (
    <div ref={wrapRef} className={className} style={{ position: "relative", ...style }}>
      <canvas
        ref={canvasRef}
        aria-label={alt}
        role="img"
        style={{ width: "100%", height: "100%", display: "block", imageRendering: "pixelated" }}
      />
    </div>
  );
}
