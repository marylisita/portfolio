"use client";
import { motion } from "framer-motion";
import { useT } from "@/i18n/LanguageContext";
import { BEIJO_GRANDE } from "./asciiOrnamentos";

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
    font-family: var(--font-mono);
    font-size: clamp(2.5px, 0.62vw, 9px);
    line-height: 1.04;
    white-space: pre;
    color: var(--ink);
    opacity: .85;
    user-select: none;
    margin: 0 0 -0.4rem;
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
    font-size: .62rem;
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
  .ef__talk {
    font-family: var(--font-head);
    font-weight: 400;
    font-size: clamp(2.6rem, 8.5vw, 7.5rem);
    line-height: .95;
    letter-spacing: -0.015em;
    margin: 0 0 1.4rem;
    text-align: center;
  }
  .ef__mail {
    font-family: var(--font-body);
    font-size: clamp(.85rem, 1.3vw, 1rem);
    letter-spacing: .16em;
    text-transform: uppercase;
    color: var(--acid);
    text-decoration: none;
    display: block;
    text-align: center;
    margin-bottom: 4.5rem;
  }
  .ef__mail:hover { text-decoration: underline; }
  .ef__row {
    display: grid;
    grid-template-columns: 4.5rem 1fr auto;
    align-items: baseline;
    gap: 1.5rem;
    padding: 1.3rem 0;
    border-top: 1px solid rgba(28,27,24,.28);
    text-decoration: none;
    color: var(--ink);
    transition: color .3s ease, padding-left .45s cubic-bezier(.16,1,.3,1);
  }
  .ef__row:hover { color: var(--acid); padding-left: 1.2rem; }
  .ef__row:last-of-type { border-bottom: 1px solid rgba(28,27,24,.28); }
  .ef__name {
    font-family: var(--font-head);
    font-weight: 400;
    font-size: clamp(1.5rem, 4.4vw, 3.2rem);
    line-height: 1;
    letter-spacing: -0.01em;
  }
  .ef__num, .ef__arrow {
    font-family: var(--font-body); font-size: .7rem;
    text-transform: uppercase; letter-spacing: .16em; opacity: .6;
  }
  .ef__bottom {
    display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
    padding-top: 1.4rem; margin-top: 4rem;
    border-top: 1px solid rgba(28,27,24,.2);
    font-family: var(--font-body); font-size: .68rem;
    text-transform: uppercase; letter-spacing: .16em;
    opacity: .5;
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

      <div className="ef__divisa">
        <motion.pre
          className="ef__obra"
          aria-hidden="true"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 0.85, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {BEIJO_GRANDE}
        </motion.pre>
        <div className="ef__linha" />
        <span className="ef__credito">bouguereau, o primeiro beijo (1890)</span>
      </div>

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
