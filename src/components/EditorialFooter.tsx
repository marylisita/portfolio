"use client";
import Image from "next/image";
import AsciiDivider from "./AsciiDivider";
import { useT } from "@/i18n/LanguageContext";
import { useCreativeStudio } from "./CreativeStudio";
import cupidosBraille from "../../public/img/cupidos-braille-transparent.webp";

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
    opacity: .4;
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
    text-align: center;
    margin-bottom: 4.5rem;
    transition: color 0.3s ease;
  }
  .ef__mail:hover { color: var(--ink); }
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
    display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
    padding-top: 1rem;
    font-family: var(--font-body); font-size: var(--type-micro);
    text-transform: uppercase; letter-spacing: .16em;
    opacity: .5;
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
  }
  .ef__sound:hover,
  .ef__sound[aria-pressed="true"] { color: var(--paper); background: var(--ink); opacity: 1; }
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
  }
`;

export default function EditorialFooter() {
  const { t } = useT();
  const { studioActive, soundEnabled, toggleSound, playSound } = useCreativeStudio();

  const socials = [
    { num: "01", name: "behance", href: "https://www.behance.net/marylisita" },
    { num: "02", name: "linkedin", href: "https://www.linkedin.com/in/maria-lisita/" },
    { num: "03", name: "whatsapp", href: "https://wa.me/5521936180477" },
    { num: "04", name: t("footer_cv").toLowerCase(), href: "/Curriculo_Maria_Isabel_Lisita.pdf" },
    { num: "05", name: "lattes", href: "/Curriculo_Lattes_Maria_Isabel_Lisita.pdf" },
  ];

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
        href="mailto:lisita.medeiros@gmail.com"
        style={{ "--reveal-y": "30px" } as React.CSSProperties}
      >
        lisita.medeiros@gmail.com
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
        <span>mary lisita © {new Date().getFullYear()}</span>
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
        <span>{t("rm_footer_made")}</span>
      </div>
    </footer>
  );
}
