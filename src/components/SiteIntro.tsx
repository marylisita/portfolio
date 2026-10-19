"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LivingLogo } from "./LivingLogo";
import { boundsFor } from "./logoGeometry";

/**
 * Tela de carregamento: a escrita em 2 atos da logo, acelerada, e então a
 * logo encolhe e voa até a marca do cabeçalho (.sh__logo) enquanto o papel
 * some. Só na primeira visita da sessão, e nunca com movimento reduzido ou no
 * modo lite.
 *
 * Quem decide se toca é o script do <head> (INTRO_SCRIPT, no layout), antes
 * da primeira pintura: ele põe data-intro="play" ou "skip" no <html>. Assim a
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
const HOLD_MS = 160; // respiro com a logo pronta antes do voo
const FLY_MS = 720;
const FLY_EASE = "cubic-bezier(.65, 0, .35, 1)"; // ease-in-out: algo que já está na tela indo de A a B

const styles = `
  .site-intro {
    position: fixed;
    inset: 0;
    z-index: 9000;
    display: grid;
    place-items: center;
    cursor: default;
    /* rede de segurança: se o JS não rodar, a tela some sozinha */
    animation: site-intro-failsafe .3s ease-in 7s forwards;
  }
  html:not([data-intro="play"]) .site-intro { display: none; }
  .site-intro__paper {
    position: absolute;
    inset: 0;
    background: var(--site-paper, #EDE7DA);
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

export default function SiteIntro() {
  const [gone, setGone] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [colors, setColors] = useState<{ ink: string; accent: string } | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const flying = useRef(false);

  useEffect(() => {
    // o <html> já traz a decisão do script do <head>; lida no primeiro quadro
    const frame = requestAnimationFrame(() => {
      const root = document.documentElement;
      if (root.dataset.intro !== "play") {
        setGone(true);
        return;
      }
      const cs = getComputedStyle(root);
      setColors({
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

  const finish = useCallback(() => {
    document.documentElement.dataset.intro = "done";
    // um quadro com a marca do cabeçalho já visível antes de tirar a tela, pra não piscar
    requestAnimationFrame(() => setGone(true));
  }, []);

  const fly = useCallback(() => {
    if (flying.current) return;
    flying.current = true;
    const overlay = overlayRef.current;
    const paper = paperRef.current;
    const logo = logoRef.current;
    const target = document.querySelector<SVGSVGElement>(".sh__logo");
    if (!overlay || !paper || !logo) return finish();

    const tr = target?.getBoundingClientRect();
    paper.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: FLY_MS * 0.7,
      delay: FLY_MS * 0.3,
      easing: "ease-out",
      fill: "forwards",
    });
    if (!tr || !tr.width) {
      // sem cabeçalho na página: a logo só some junto com o papel
      logo.animate([{ opacity: 1 }, { opacity: 0 }], { duration: FLY_MS * 0.6, easing: "ease-in", fill: "forwards" }).onfinish =
        finish;
      return;
    }

    // a caixa do desenho dentro da área da logo animada (412x320 unidades)
    const wr = logo.getBoundingClientRect();
    const b = boundsFor("signature");
    const k = wr.width / 412;
    const s = tr.width / (b.width * k);
    const tx = tr.left - wr.left - s * b.x * k;
    const ty = tr.top - wr.top - s * b.y * k;
    logo.animate([{ transform: "translate(0, 0) scale(1)" }, { transform: `translate(${tx}px, ${ty}px) scale(${s})` }], {
      duration: FLY_MS,
      easing: FLY_EASE,
      fill: "forwards",
    }).onfinish = finish;
  }, [finish]);

  const onIntroEnd = useCallback(() => {
    window.setTimeout(fly, skipped ? 0 : HOLD_MS);
  }, [fly, skipped]);

  // pular: a logo aparece pronta (sem entrada) e o voo sai em seguida
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
      <div ref={paperRef} className="site-intro__paper" />
      <div ref={logoRef} className="site-intro__logo">
        {colors && (
          <LivingLogo
            size={2000}
            inkColor={colors.ink}
            accentColor={colors.accent}
            distribution="signature"
            intro={skipped ? "none" : "decodeInk"}
            hover="none"
            speed={SPEED}
            onIntroEnd={onIntroEnd}
          />
        )}
      </div>
    </div>
  );
}
