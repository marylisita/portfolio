import React from "react";
import { LETTER_L, LETTER_M, accentsFor, boundsFor, Distribution } from "./logoGeometry";

/**
 * O monograma parado, em SVG, recortado no desenho (sem sobra em volta). É a
 * marca do cabeçalho e o ponto de chegada da tela de carregamento. As cores
 * vêm do tema: M em --site-ink, L e elementos em --site-accent-hot.
 */
export default function MonogramMark({
  distribution = "signature",
  className,
  style,
}: {
  distribution?: Distribution;
  className?: string;
  style?: React.CSSProperties;
}) {
  const b = boundsFor(distribution);
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
        {accentsFor(distribution).map((a) => (
          <path key={a.id} d={a.pathSolid} transform={`translate(${a.x} ${a.y})`} fill={a.color} />
        ))}
      </g>
    </svg>
  );
}
