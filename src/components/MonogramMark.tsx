import React from "react";
import { LETTER_L, LETTER_M, accentsFor, boundsFor, Distribution } from "./logoGeometry";

/**
 * O monograma parado, em SVG, recortado no desenho (sem sobra em volta). É a
 * marca do cabeçalho e o ponto de chegada da tela de carregamento. As cores
 * vêm do tema: M em --site-ink, L e elementos em --site-accent-hot.
 *
 * Com `hoverReveal=true`, exibe a versão limpa (signature_clean) por padrão
 * e guarda os detalhes extras em .sh__extra-accents para desabrocharem no hover.
 */
export default function MonogramMark({
  distribution = "signature",
  hoverReveal = false,
  className,
  style,
}: {
  distribution?: Distribution;
  hoverReveal?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const b = boundsFor(distribution);
  const accents = accentsFor(distribution);

  if (hoverReveal) {
    const cleanAccents = accentsFor("signature_clean");
    const cleanIds = new Set(cleanAccents.map((a) => a.id));
    const extraAccents = accents.filter((a) => !cleanIds.has(a.id));

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`${b.x} ${b.y} ${b.width} ${b.height}`}
        className={className}
        style={{ display: "inline-block", overflow: "visible", shapeRendering: "crispEdges", ...style }}
        aria-hidden="true"
        focusable="false"
      >
        {/* L por baixo, M por cima */}
        <path d={LETTER_L} fill="var(--site-accent-hot, #FF2E9A)" />
        <path d={LETTER_M} fill="var(--site-ink, #1C1B18)" />
        
        {/* Elementos base limpos (sempre visíveis) */}
        <g fill="var(--site-accent-hot, #FF2E9A)">
          {cleanAccents.map((a) => (
            <path key={a.id} d={a.pathSolid} transform={`translate(${a.x} ${a.y})`} fill={a.color} />
          ))}
        </g>

        {/* Detalhes extras que florescem no hover */}
        <g className="sh__extra-accents" fill="var(--site-accent-hot, #FF2E9A)">
          {extraAccents.map((a) => (
            <path key={a.id} d={a.pathSolid} transform={`translate(${a.x} ${a.y})`} fill={a.color} />
          ))}
        </g>
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${b.x} ${b.y} ${b.width} ${b.height}`}
      className={className}
      style={{ display: "inline-block", overflow: "visible", shapeRendering: "crispEdges", ...style }}
      aria-hidden="true"
      focusable="false"
    >
      {/* L por baixo, M por cima: o M passa por dentro do L */}
      <path d={LETTER_L} fill="var(--site-accent-hot, #FF2E9A)" />
      <path d={LETTER_M} fill="var(--site-ink, #1C1B18)" />
      <g fill="var(--site-accent-hot, #FF2E9A)">
        {accents.map((a) => (
          <path key={a.id} d={a.pathSolid} transform={`translate(${a.x} ${a.y})`} fill={a.color} />
        ))}
      </g>
    </svg>
  );
}
