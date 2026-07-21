"use client";
import { motion } from "framer-motion";

/**
 * Ornamento em arte braille (as que ela escolheu). Separado do AsciiAnim porque
 * as exigências de renderização são outras:
 *
 * - fonte: SÓ a BrailleMono tem os glifos (var(--font-braille)); a mono do site
 *   não tem. Sem isso é tofu.
 * - line-height 1: o glifo braille já é desenhado do topo à base da célula, então
 *   qualquer entrelinha extra abre fresta horizontal e o desenho vira listra.
 * - letter-spacing 0: idem na horizontal.
 *
 * Largura = cols * 0.732em (avanço do glifo no DejaVu, 1500/2048).
 */
export default function BrailleDeco({
  art,
  fontSize,
  opacity = 0.5,
  color = "var(--ink)",
  className,
  style,
}: {
  art: string;
  /** número = px; string pra escalar com a viewport (clamp/vw/vh) */
  fontSize: number | string;
  opacity?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.pre
      aria-hidden="true"
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        fontFamily: "var(--font-braille), monospace",
        fontSize,
        lineHeight: 1,
        letterSpacing: 0,
        color,
        whiteSpace: "pre",
        userSelect: "none",
        pointerEvents: "none",
        margin: 0,
        ...style,
      }}
    >
      {art}
    </motion.pre>
  );
}
