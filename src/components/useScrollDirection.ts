"use client";

import { useEffect, useState } from "react";

/**
 * Diz se a navegação fixa deve sair da frente.
 *
 * O site tem assinatura fixa no topo e um molho de etiquetas fixo no canto.
 * Durante a leitura de um case eles passam por cima de texto e imagem: a
 * navegação atrapalha justamente o que ela deveria ajudar a ler. A regra aqui é
 * a de sempre: descendo, o conteúdo manda; subindo — ou perto do topo — a
 * navegação volta.
 *
 * O limiar de 240px existe para o herói da home e a abertura dos cases
 * continuarem com a assinatura no lugar, que lá ela faz parte da composição.
 */
export function useNavTucked(enabled = true) {
  const [tucked, setTucked] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let lastY = window.scrollY;
    let frame = 0;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      // Folga de 6px: tremida de trackpad e ajuste de âncora não contam como
      // mudança de direção.
      if (Math.abs(delta) < 6) return;
      lastY = y;
      setTucked(y > 240 && delta > 0);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  // Desligado, o valor sai falso na leitura — sem setState dentro do efeito.
  return enabled && tucked;
}
