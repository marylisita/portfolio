"use client";

import { useEffect, useState, type RefObject } from "react";

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
 *
 * Só a direção não bastava. Subindo, a regra manda a navegação voltar — e é
 * exatamente subindo que o título da seção cruza a faixa dela. "Trabalhos
 * Selecionados" reaparecia com quase metade da altura escondida atrás do halo
 * de papel da assinatura. Por isso, quem passa por `collideSelector` também
 * recolhe a navegação enquanto estiver dentro da faixa, em qualquer direção.
 */
export function useNavTucked(
  enabled = true,
  navRef?: RefObject<HTMLElement | null>,
  collideSelector?: string,
) {
  const [tucked, setTucked] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let lastY = window.scrollY;
    let frame = 0;

    // A faixa sai de offsetTop/offsetHeight, não de getBoundingClientRect:
    // recolhida, a navegação sobe .85rem, e medir o retângulo já deslocado
    // desfaria a própria colisão que a recolheu — ela piscaria sem parar.
    // offset* é medida de layout e ignora o translate.
    const colide = () => {
      const nav = navRef?.current;
      if (!nav || !collideSelector) return false;
      // 4px de respiro: encostar já conta como atrapalhar.
      const topo = nav.offsetTop - 4;
      const base = nav.offsetTop + nav.offsetHeight + 4;
      const esq = nav.offsetLeft;
      const dir = nav.offsetLeft + nav.offsetWidth;
      const alvos = document.querySelectorAll(collideSelector);
      for (let i = 0; i < alvos.length; i++) {
        const r = alvos[i].getBoundingClientRect();
        if (r.bottom > topo && r.top < base && r.right > esq && r.left < dir) {
          return true;
        }
      }
      return false;
    };

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      // Folga de 6px: tremida de trackpad e ajuste de âncora não contam como
      // mudança de direção.
      if (Math.abs(delta) < 6) return;
      lastY = y;
      setTucked((y > 240 && delta > 0) || colide());
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [enabled, navRef, collideSelector]);

  // Desligado, o valor sai falso na leitura — sem setState dentro do efeito.
  return enabled && tucked;
}
