"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import AsciiDivider from "./AsciiDivider";
import { useT } from "@/i18n/LanguageContext";
import {
  applyPaperTokensToRoot,
  PAPER_ORDER,
  type PaperMode,
  readStoredPaper,
  subscribeStoredPaper,
  useCreativeStudio,
  writeStoredPaper,
} from "./CreativeStudio";
import cupidosBraille from "../../public/img/cupidos-braille-transparent.webp";

const EMAIL_ADDRESS = "lisita.medeiros@gmail.com";
const SPARK_GLYPHS = ["✦", "✧", "⋆", "✿", "₊", "˚", "⊹", "✭"];

const PAPER_LABELS: Record<"pt" | "en", Record<PaperMode, string>> = {
  pt: {
    cream: "creme",
    cyanotype: "cianótipo",
    vellum: "vellum",
    vinyl: "vinil",
  },
  en: {
    cream: "cream",
    cyanotype: "cyanotype",
    vellum: "vellum",
    vinyl: "vinyl",
  },
};

function spawnEmailSparks(originX: number, originY: number) {
  if (typeof window === "undefined") return;
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.dataset.motion === "lite"
  ) {
    return;
  }

  const count = 8;
  for (let i = 0; i < count; i += 1) {
    const span = document.createElement("span");
    span.textContent = SPARK_GLYPHS[i % SPARK_GLYPHS.length];
    span.setAttribute("aria-hidden", "true");
    span.style.position = "fixed";
    span.style.left = `${originX}px`;
    span.style.top = `${originY}px`;
    span.style.zIndex = "9999";
    span.style.pointerEvents = "none";
    span.style.userSelect = "none";
    span.style.fontFamily = "var(--font-mono), monospace";
    span.style.fontSize = `${0.85 + (i % 3) * 0.22}rem`;
    span.style.color = i % 2 === 0 ? "var(--site-accent)" : "var(--site-ink)";
    span.style.translate = "-50% -50%";
    document.body.appendChild(span);

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.35;
    const dist = 36 + Math.random() * 44;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 14;
    const rot = (Math.random() - 0.5) * 70;

    const anim = span.animate(
      [
        { transform: "translate3d(0, 0, 0) scale(0.5) rotate(0deg)", opacity: 1 },
        {
          transform: `translate3d(${(dx * 0.7).toFixed(1)}px, ${(dy * 0.7).toFixed(1)}px, 0) scale(1.15) rotate(${(rot * 0.6).toFixed(1)}deg)`,
          opacity: 1,
          offset: 0.45,
        },
        {
          transform: `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(0.75) rotate(${rot.toFixed(1)}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 620 + Math.random() * 180,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards",
      }
    );
    anim.onfinish = () => span.remove();
  }
}

/**
 * Rodapé da landing na identidade nova (escuro + lime + linhas pixeladas).
 * Redes sociais como linhas GIGANTES estilo índice — pedido dela: destacar.
 * O GiantFooter antigo segue nas outras páginas até o reset propagar.
 */
const styles = `
  .ef {
    padding: 0 3.8rem 2rem;
    color: var(--ink);
  }
  /* O Primeiro Beijo (Bouguereau) preside a divisória antes do rodapé:
     a obra centralizada, pousada sobre a linha pixelada. */
  .ef__divisa {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 3.5rem;
  }
  .ef__obra {
    position: relative;
    width: min(88%, 44rem);
    /* caixa mais baixa que a razão real da imagem (1441/1091): com object cover
       + ancoragem no topo, os ~10% esmaecidos da base são aparados, então o
       divisor encosta rente ao corpo dos cupidos em vez de flutuar longe. */
    aspect-ratio: 1441 / 985;
    max-width: 100%;
    overflow: hidden;
    user-select: none;
    margin: 0 auto -.35rem;
  }
  .ef__obra-image {
    object-fit: cover;
    object-position: top;
  }
  /* fio fino duplo, como regra de frontispício — o bloco pixelado brigava
     com a delicadeza da voluta que está encostada nele */
  .ef__linha {
    width: 100%;
    border-top: 1px solid var(--ink);
    border-bottom: 1px solid var(--ink);
    height: 4px;
    opacity: .55;
  }
  .ef__credito {
    font-family: var(--font-body);
    font-size: var(--type-micro);
    letter-spacing: .2em;
    text-transform: uppercase;
    /* Mesmo motivo do .tc-credit: crédito precisa passar em AA. */
    opacity: .72;
    margin-top: .9rem;
  }
  .ef__label {
    font-family: var(--font-head); font-style: italic;
    font-size: 1.15rem; letter-spacing: .04em;
    margin-bottom: 1.2rem; display: block;
    text-align: center;
    opacity: .75;
  }
  .ef__mail {
    position: relative;
    font-family: var(--font-pixelscript, cursive);
    font-weight: 400;
    /* O piso de 2.4rem não cabia em tela de celular: o endereço era cortado
       no meio ("lisita.medeiros@g…"). Como a caixa também acompanha a
       largura da tela, o tamanho em vw mantém o endereço numa linha só em
       qualquer celular; o overflow-wrap fica só como rede de segurança. */
    font-size: clamp(1rem, 5.3vw, 5.8rem);
    max-width: 100%;
    overflow-wrap: anywhere;
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--acid);
    text-decoration: none;
    display: block;
    width: 100%;
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
    text-align: center;
    margin-bottom: 4.5rem;
    transition:
      color 0.3s ease,
      transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .ef__mail:hover { color: var(--ink); }
  .ef__mail:active { transform: scale(0.97); }
  .ef__mail:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 6px;
  }
  .ef__mail[data-copied="true"] {
    color: var(--ink);
    transform: scale(1.02);
  }
  .ef__row {
    display: grid;
    grid-template-columns: 4.5rem 1fr auto;
    align-items: baseline;
    gap: 1.5rem;
    padding: 1.3rem 0;
    text-decoration: none;
    color: var(--ink);
    transition: color .3s ease, padding-left .45s cubic-bezier(.16,1,.3,1);
  }
  .ef__row:hover { color: var(--acid); padding-left: 1.2rem; }
  .ef__name {
    font-family: var(--font-head);
    font-weight: 400;
    font-size: clamp(1.5rem, 4.4vw, 3.2rem);
    line-height: 1;
    letter-spacing: -0.01em;
  }
  .ef__num, .ef__arrow {
    font-family: var(--font-body); font-size: var(--type-micro);
    text-transform: uppercase; letter-spacing: .16em; opacity: .6;
  }

  .ef__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
    padding-top: 1.1rem;
    font-family: var(--font-body);
    font-size: var(--type-micro);
    text-transform: uppercase;
    letter-spacing: .16em;
  }
  .ef__meta-text {
    opacity: .55;
  }
  .ef__papers {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: .35rem;
    font-family: var(--font-subtitle), monospace;
    font-size: var(--type-micro);
    letter-spacing: .06em;
    text-transform: lowercase;
  }
  .ef__papers-label {
    opacity: .55;
    margin-right: .2rem;
  }
  .ef__paper-btn {
    display: inline-flex;
    align-items: center;
    gap: .28rem;
    min-height: 32px;
    padding: .25rem .48rem;
    background: transparent;
    border: 1px dashed color-mix(in srgb, var(--ink) 26%, transparent);
    color: var(--ink);
    font: inherit;
    cursor: pointer;
    opacity: .62;
    transition:
      opacity .2s ease,
      color .2s ease,
      background-color .2s ease,
      border-color .2s ease,
      transform .16s cubic-bezier(.16, 1, .3, 1);
  }
  .ef__paper-btn:hover,
  .ef__paper-btn:focus-visible {
    opacity: 1;
    border-color: var(--ink);
  }
  .ef__paper-btn[aria-pressed="true"] {
    opacity: 1;
    color: var(--paper);
    background: var(--ink);
    border-style: solid;
    border-color: var(--ink);
  }
  .ef__paper-btn:active {
    transform: scale(0.96);
  }
  .ef__paper-btn:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 2px;
  }
  .ef__sound {
    display: inline-grid;
    place-items: center;
    min-width: 3rem;
    min-height: var(--tap-min);
    padding: .5rem .65rem;
    color: var(--ink);
    border: 1px solid color-mix(in srgb, var(--ink) 34%, transparent);
    font-family: var(--font-mono), monospace;
    font-size: var(--type-micro);
    font-variant-emoji: text;
    cursor: pointer;
    transition: transform .16s cubic-bezier(.16, 1, .3, 1), background-color .2s ease, color .2s ease;
  }
  .ef__sound:hover,
  .ef__sound[aria-pressed="true"] { color: var(--paper); background: var(--ink); opacity: 1; }
  .ef__sound:active { transform: scale(0.96); }
  .ef__sound:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
  @supports (animation-timeline: view()) {
    html[data-motion="full"] .ef__view-reveal {
      animation: ef-view-reveal linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 48%;
    }
    @keyframes ef-view-reveal {
      from { opacity: 0; transform: translateY(var(--reveal-y, 18px)); }
      to { opacity: var(--reveal-opacity, 1); transform: translateY(0); }
    }
  }
  @media (max-width: 720px) {
    .ef { padding: 4rem 1.8rem 1.5rem; }
    .ef__obra { width: 86%; }
    .ef__row { grid-template-columns: 2.5rem 1fr auto; gap: .8rem; }
    .ef__papers { width: 100%; justify-content: flex-start; }
  }
  @media (prefers-reduced-motion: reduce) {
    .ef__mail,
    .ef__paper-btn,
    .ef__sound {
      transition: none;
    }
    .ef__mail[data-copied="true"] {
      transform: none;
    }
  }
`;

export default function EditorialFooter() {
  const { t, lang } = useT();
  const { studioActive, soundEnabled, toggleSound, playSound } = useCreativeStudio();
  const paper = useSyncExternalStore(subscribeStoredPaper, readStoredPaper, () => "cream" as PaperMode);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (paper !== "cream") {
      applyPaperTokensToRoot(paper);
    }
  }, [paper]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleMailClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const originX = event.clientX || rect.left + rect.width / 2;
    const originY = event.clientY || rect.top + rect.height / 2;

    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      spawnEmailSparks(originX, originY);
      playSound("stamp");
      setCopied(true);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2200);
    } catch {
      window.location.href = `mailto:${EMAIL_ADDRESS}`;
    }
  };

  const handlePaperSelect = (mode: PaperMode) => {
    writeStoredPaper(mode);
    playSound("paper");
  };

  const socials = [
    { num: "01", name: "behance", href: "https://www.behance.net/marylisita" },
    { num: "02", name: "linkedin", href: "https://www.linkedin.com/in/maria-lisita/" },
    { num: "03", name: "whatsapp", href: "https://wa.me/5521936180477" },
    { num: "04", name: t("footer_cv").toLowerCase(), href: "/Curriculo_Maria_Isabel_Lisita.pdf" },
    { num: "05", name: "lattes", href: "/Curriculo_Lattes_Maria_Isabel_Lisita.pdf" },
  ];

  const copiedLabel = lang === "pt" ? "copiado! ✦" : "copied! ✦";
  const paperGroupLabel = lang === "pt" ? "papel:" : "paper:";
  const paperLabels = PAPER_LABELS[lang === "en" ? "en" : "pt"];

  return (
    <footer className="ef">
      <style>{styles}</style>

      <div className="ef__divisa">
        <div
          className="ef__obra ef__view-reveal"
          aria-hidden="true"
          style={{ "--reveal-opacity": .92 } as React.CSSProperties}
        >
          <Image
            className="ef__obra-image"
            src={cupidosBraille}
            alt=""
            fill
            sizes="(max-width: 720px) 74vw, 44rem"
          />
        </div>
        {/* céu de estrelinhas embaixo dos ANJINHOS do beijo (mantidos) */}
        <AsciiDivider pattern=".・。.・゜✭・.・✫・゜・。" size=".85rem" opacity={0.5} style={{ width: "100%" }} />
      </div>

      <a
        className="ef__mail ef__view-reveal hover-trigger"
        href={`mailto:${EMAIL_ADDRESS}`}
        onClick={handleMailClick}
        data-copied={copied ? "true" : "false"}
        aria-live="polite"
        title={lang === "pt" ? "Clique para copiar o e-mail" : "Click to copy email"}
        style={{ "--reveal-y": "30px" } as React.CSSProperties}
      >
        {copied ? copiedLabel : EMAIL_ADDRESS}
      </a>

      <div>
        {socials.map((s) => (
          <div key={s.name}>
            <AsciiDivider opacity={0.42} />
            <a
              className="ef__row hover-trigger"
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={() => playSound("hover")}
            >
              <span className="ef__num">{s.num}</span>
              <span className="ef__name">{s.name}</span>
              <span className="ef__arrow">↗</span>
            </a>
          </div>
        ))}
        <AsciiDivider opacity={0.42} />
      </div>

      <div className="ef__bottom">
        <span className="ef__meta-text">mary lisita © {new Date().getFullYear()}</span>

        <div className="ef__papers" role="group" aria-label={lang === "pt" ? "Amostras de papel" : "Paper swatches"}>
          <span className="ef__papers-label">{paperGroupLabel}</span>
          {PAPER_ORDER.map((mode) => {
            const active = paper === mode;
            return (
              <button
                key={mode}
                type="button"
                className="ef__paper-btn hover-trigger"
                aria-pressed={active}
                onClick={() => handlePaperSelect(mode)}
              >
                <span aria-hidden="true">{active ? "●" : "○"}</span>
                <span>{paperLabels[mode]}</span>
              </button>
            );
          })}
        </div>

        {studioActive ? (
          <button
            type="button"
            className="ef__sound hover-trigger"
            aria-label={soundEnabled ? "Desativar sons" : "Ativar sons"}
            aria-pressed={soundEnabled}
            onClick={toggleSound}
          >
            [ {soundEnabled ? "♪" : "∅"} ]
          </button>
        ) : null}
        <span className="ef__meta-text">{t("rm_footer_made")}</span>
      </div>
    </footer>
  );
}
