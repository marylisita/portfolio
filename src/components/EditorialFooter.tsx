"use client";
import { motion } from "framer-motion";
import { useT } from "@/i18n/LanguageContext";
import { PUTTI } from "./asciiOrnamentos";

/**
 * Rodapé da landing na identidade nova (escuro + lime + linhas pixeladas).
 * Redes sociais como linhas GIGANTES estilo índice — pedido dela: destacar.
 * O GiantFooter antigo segue nas outras páginas até o reset propagar.
 */
const styles = `
  .ef {
    padding: 0 2rem 2rem;
    color: var(--ink);
  }
  /* os dois putti escorados na balaustrada: a balaustrada É a divisória
     que separa a página do rodapé (referência: Madona Sistina, Rafael) */
  .ef__putti {
    display: block;
    width: 100%;
    margin: 0 0 3.5rem;
    font-family: var(--font-mono);
    /* dimensionado pra largura da tela: 118 colunas de ~0.6em cada */
    font-size: clamp(3px, 1.34vw, 20px);
    line-height: 1.02;
    white-space: pre;
    overflow: hidden;
    color: var(--ink);
    opacity: .8;
    user-select: none;
  }
  .ef__label {
    font-family: var(--font-body); font-size: .8rem;
    text-transform: lowercase; letter-spacing: .12em;
    margin-bottom: 2.5rem; display: block;
  }
  .ef__talk {
    font-family: var(--font-grotesk);
    font-weight: 700;
    font-size: clamp(2.4rem, 8vw, 7rem);
    line-height: .92;
    letter-spacing: -0.04em;
    text-transform: lowercase;
    margin: 0 0 1rem;
  }
  .ef__mail {
    font-family: var(--font-head);
    font-style: italic;
    font-size: clamp(1.2rem, 3vw, 2.2rem);
    color: var(--acid);
    text-decoration: none;
    display: inline-block;
    margin-bottom: 4rem;
  }
  .ef__mail:hover { text-decoration: underline; }
  .ef__row {
    display: grid;
    grid-template-columns: 4.5rem 1fr auto;
    align-items: baseline;
    gap: 1.5rem;
    padding: 1.2rem 0;
    background-image: repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px);
    background-size: 100% 2px;
    background-position: top left;
    background-repeat: no-repeat;
    text-decoration: none;
    color: var(--ink);
    transition: color .3s ease, padding-left .45s cubic-bezier(.16,1,.3,1);
  }
  .ef__row:hover { color: var(--acid); padding-left: 1.2rem; }
  .ef__row:last-of-type {
    background-image:
      repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px),
      repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 12px);
    background-size: 100% 2px, 100% 2px;
    background-position: top left, bottom left;
    background-repeat: no-repeat, no-repeat;
  }
  .ef__name {
    font-family: var(--font-grotesk);
    font-weight: 700;
    font-size: clamp(1.6rem, 5vw, 3.6rem);
    line-height: .95;
    letter-spacing: -0.035em;
    text-transform: lowercase;
  }
  .ef__num, .ef__arrow {
    font-family: var(--font-body); font-size: .8rem;
    text-transform: lowercase; letter-spacing: .08em;
  }
  .ef__bottom {
    display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
    padding-top: 1.4rem; margin-top: 4rem;
    font-family: var(--font-body); font-size: .76rem;
    text-transform: lowercase; letter-spacing: .06em;
    opacity: .65;
  }
  @media (max-width: 720px) {
    .ef { padding: 4rem 1.25rem 1.5rem; }
    .ef__row { grid-template-columns: 2.5rem 1fr auto; gap: .8rem; }
  }
`;

export default function EditorialFooter() {
  const { t } = useT();

  const socials = [
    { num: "01", name: "behance", href: "https://www.behance.net/marylisita" },
    { num: "02", name: "linkedin", href: "https://www.linkedin.com/in/maria-lisita/" },
    { num: "03", name: "whatsapp", href: "https://wa.me/5521936180477" },
    { num: "04", name: t("footer_cv").toLowerCase(), href: "/Curriculo_Maria_Isabel_Lisita.pdf" },
  ];

  return (
    <footer className="ef">
      <style>{styles}</style>

      <motion.pre
        className="ef__putti"
        aria-hidden="true"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 0.8, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {PUTTI}
      </motion.pre>

      <span className="ef__label">{t("rm_footer_label")}</span>

      <motion.h2
        className="ef__talk"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {t("rm_footer_talk")}
      </motion.h2>

      <a className="ef__mail hover-trigger" href="mailto:lisita.medeiros@gmail.com">
        lisita.medeiros@gmail.com ↗
      </a>

      <div>
        {socials.map((s) => (
          <a
            key={s.name}
            className="ef__row hover-trigger"
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="ef__num">{s.num}</span>
            <span className="ef__name">{s.name}</span>
            <span className="ef__arrow">↗</span>
          </a>
        ))}
      </div>

      <div className="ef__bottom">
        <span>mary lisita © {new Date().getFullYear()}</span>
        <span>{t("rm_footer_made")}</span>
      </div>
    </footer>
  );
}
