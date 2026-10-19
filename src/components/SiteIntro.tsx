"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LivingLogo } from "./LivingLogo";
import { boundsFor } from "./logoGeometry";

/**
 * Tela de carregamento: a escrita em 2 atos da logo ML (acelerada).
 * No fim, o papel se desfaz em quadradinhos a partir da logo, e a logo
 * voa com precisão até a marca do cabeçalho (.sh__logo).
 *
 * Só na primeira visita da sessão, e nunca com movimento reduzido ou no modo
 * lite. Quem decide é o script do <head> (INTRO_SCRIPT, no layout), antes da
 * primeira pintura: ele põe data-intro="play" ou "skip" no <html>. Assim a
 * tela já vem no HTML e não pisca para quem não vai vê-la. Clique ou tecla
 * pulam direto para o voo. Se o JS falhar, o CSS some com a tela sozinho.
 */

export const INTRO_SEEN_KEY = "mary:intro-seen";

/** roda no <head>, depois do script do modo lite */
export const INTRO_SCRIPT = `(() => {
  const root = document.documentElement;
  try {
    const seen = sessionStorage.getItem("${INTRO_SEEN_KEY}");
    const calm = root.dataset.motion === "lite" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.dataset.intro = !seen && !calm ? "play" : "skip";
  } catch (e) {
    root.dataset.intro = "skip";
  }
})();`;

const SPEED = 1.6; // a escrita em 2 atos leva ~1,8s em vez de ~2,9s
const HOLD_MS = 180; // respiro com a logo pronta antes do voo
const FLY_MS = 760;
const FLY_EASE = "cubic-bezier(.65, 0, .35, 1)"; // ease-in-out: algo que já está na tela indo de A a B
const DISSOLVE_MS = 680;
const DISSOLVE_DELAY_MS = 70;

const styles = `
  .site-intro {
    position: fixed;
    inset: 0;
    z-index: 9000;
    display: grid;
    place-items: center;
    cursor: default;
    background: var(--site-paper, #EDE7DA);
    /* rede de segurança: se o JS não rodar, a tela some sozinha */
    animation: site-intro-failsafe .3s ease-in 7s forwards;
  }
  html:not([data-intro="play"]) .site-intro { display: none; }
  .site-intro__paper {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  .site-intro__logo {
    position: relative;
    width: min(340px, 68vw);
    transform-origin: 0 0;
  }
  @keyframes site-intro-failsafe {
    to { opacity: 0; visibility: hidden; pointer-events: none; }
  }
`;

const hash = (n: number) => {
  n = (n ^ 61) ^ (n >>> 16);
  n = n + (n << 3);
  n = n ^ (n >>> 4);
  n = Math.imul(n, 0x27d4eb2d);
  n = n ^ (n >>> 15);
  return (n >>> 0) / 4294967296;
};

export default function SiteIntro() {
  const [gone, setGone] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [setup, setSetup] = useState<{ ink: string; accent: string } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const flying = useRef(false);
  /** desenha o papel com uma fração dos quadradinhos já desfeita (0 = inteiro) */
  const paintPaper = useRef<(progress: number) => void>(() => undefined);

  useEffect(() => {
    // o <html> já traz a decisão do script do <head>; lida no primeiro quadro
    const frame = requestAnimationFrame(() => {
      const root = document.documentElement;
      if (root.dataset.intro !== "play") {
        setGone(true);
        return;
      }
      const cs = getComputedStyle(root);
      setSetup({
        ink: cs.getPropertyValue("--site-ink").trim() || "#1C1B18",
        accent: cs.getPropertyValue("--site-accent-hot").trim() || "#FF2E9A",
      });
      try {
        sessionStorage.setItem(INTRO_SEEN_KEY, "1");
      } catch {
        /* sem sessionStorage a tela só toca de novo na próxima visita */
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // o papel em canvas: cor + grão do site; no fim, desfeito em quadradinhos a partir da logo
  useEffect(() => {
    if (!setup) return;
    const canvas = paperRef.current;
    const overlay = overlayRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !overlay || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const paper = getComputedStyle(document.documentElement).getPropertyValue("--site-paper").trim() || "#EDE7DA";

    // quadradinhos: abrem do centro (onde está a logo) pra fora, com ruído pra não virar um círculo liso
    const cell = w < 640 ? 12 : 16;
    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);
    const cx = w / 2;
    const cy = h / 2;
    const far = Math.hypot(cx, cy);
    const order = new Float32Array(cols * rows);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const d = Math.hypot(x * cell + cell / 2 - cx, y * cell + cell / 2 - cy) / far;
        order[y * cols + x] = d * 0.72 + hash(y * 7919 + x) * 0.28;
      }
    }

    let noise: CanvasPattern | null = null;
    const paint = (progress: number) => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, w, h);
      if (noise) {
        ctx.globalCompositeOperation = "multiply";
        ctx.globalAlpha = 0.065;
        ctx.fillStyle = noise;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }
      if (progress <= 0) return;
      for (let i = 0; i < order.length; i++) {
        if (order[i] < progress) ctx.clearRect((i % cols) * cell, Math.floor(i / cols) * cell, cell, cell);
      }
    };
    paintPaper.current = paint;
    paint(0);
    // o canvas já cobre a tela: o fundo de segurança do contêiner sai
    overlay.style.background = "transparent";

    const img = new Image();
    img.src = "/img/paper-noise.webp";
    img.onload = () => {
      noise = ctx.createPattern(img, "repeat");
      if (!flying.current) paint(0);
    };
  }, [setup]);

  const finish = useCallback(() => {
    document.documentElement.dataset.intro = "done";
    // um quadro com a marca do cabeçalho já visível antes de tirar a tela, pra não piscar
    requestAnimationFrame(() => setGone(true));
  }, []);

  const fly = useCallback(() => {
    if (flying.current) return;
    flying.current = true;
    const logo = logoRef.current;
    const target = document.querySelector<SVGSVGElement>(".sh__logo");
    if (!logo) return finish();

    // o papel se desfaz enquanto a logo voa
    const dissolveStart = performance.now() + DISSOLVE_DELAY_MS;
    const dissolve = (t: number) => {
      const p = Math.max(0, (t - dissolveStart) / DISSOLVE_MS);
      paintPaper.current(p * p * 1.05); // ease-in: começa devagar perto da logo, acelera pra fora
      if (p < 1) requestAnimationFrame(dissolve);
    };
    requestAnimationFrame(dissolve);

    const tr = target?.getBoundingClientRect();
    if (!tr || !tr.width) {
      // sem cabeçalho na página: só some junto com o papel
      logo.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: FLY_MS * 0.6,
        easing: "ease-in",
        fill: "forwards",
      }).onfinish = finish;
      return;
    }

    const er = logo.getBoundingClientRect();
    const crop = boundsFor("signature");
    const k = er.width / 412;
    const srcX = crop.x * k;
    const srcY = crop.y * k;
    const srcW = crop.width * k;
    const s = tr.width / srcW;
    const tx = tr.left - er.left - s * srcX;
    const ty = tr.top - er.top - s * srcY;

    logo.animate(
      [
        { transform: "translate(0, 0) scale(1)" },
        { transform: `translate(${tx}px, ${ty}px) scale(${s})` },
      ],
      {
        duration: FLY_MS,
        easing: FLY_EASE,
        fill: "forwards",
      }
    ).onfinish = finish;
  }, [finish]);

  const onIntroEnd = useCallback(() => {
    window.setTimeout(fly, skipped ? 0 : HOLD_MS);
  }, [fly, skipped]);

  // pular: a logo aparece pronta e o voo sai em seguida
  useEffect(() => {
    if (gone) return;
    const skip = () => setSkipped(true);
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, [gone]);

  if (gone) return null;

  return (
    <div ref={overlayRef} className="site-intro" aria-hidden="true" onPointerDown={() => setSkipped(true)}>
      <style>{styles}</style>
      <canvas ref={paperRef} className="site-intro__paper" />
      <div ref={logoRef} className="site-intro__logo">
        {setup && (
          <LivingLogo
            size={2000}
            inkColor={setup.ink}
            accentColor={setup.accent}
            distribution="signature"
            intro={skipped ? "none" : "decodeInk"}
            hover="none"
            interactive={false}
            speed={SPEED}
            onIntroEnd={onIntroEnd}
          />
        )}
      </div>
    </div>
  );
}
