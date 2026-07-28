"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useT } from "@/i18n/LanguageContext";
import type { IndexItem } from "./EditorialIndex";

type DragState = {
  active: boolean;
  moved: boolean;
  pointerId: number;
  startX: number;
  startScrollLeft: number;
};

const styles = `
  .sw-gallery {
    position: relative;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
  }
  .sw__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.25rem;
    padding: 0 0 1.15rem;
  }
  .sw__hint {
    display: inline-flex;
    align-items: center;
    gap: .65rem;
    margin: 0;
    color: var(--ink);
    font-family: var(--font-subtitle), monospace;
    font-size: clamp(1rem, .92rem + .35vw, 1.2rem);
    font-weight: var(--offbit-weight);
    letter-spacing: var(--offbit-letter-spacing);
    text-transform: lowercase;
    opacity: .7;
  }
  .sw__hint-mark {
    display: inline-block;
    font-family: var(--font-mono), monospace;
    transition: transform var(--duration-normal) var(--ease-out);
  }
  .sw-gallery:hover .sw__hint-mark {
    transform: translateX(4px);
  }
  .sw__controls {
    display: flex;
    gap: .45rem;
    flex: 0 0 auto;
  }
  .sw__button {
    position: relative;
    isolation: isolate;
    display: inline-flex;
    min-width: var(--tap-min);
    min-height: var(--tap-min);
    align-items: center;
    justify-content: center;
    padding: .62rem .82rem;
    border: 1px solid var(--ink);
    background: var(--ink);
    color: var(--paper);
    font-family: var(--font-body);
    font-size: var(--type-label);
    font-weight: 600;
    line-height: 1;
    letter-spacing: .04em;
    text-decoration: none;
    text-transform: lowercase;
    cursor: pointer;
    transition:
      transform var(--duration-fast) var(--ease-out),
      opacity var(--duration-fast) var(--ease-out);
  }
  .sw__button:hover,
  .sw__button:focus-visible {
    transform: translateY(-2px);
  }
  .sw__button:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 3px;
  }
  .sw__button:disabled {
    opacity: .28;
    cursor: default;
    transform: none;
  }
  .sw__viewport {
    position: relative;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior-inline: contain;
    scroll-snap-type: inline mandatory;
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, var(--ink) 72%, transparent) transparent;
    padding: .85rem 0 1.55rem;
    cursor: grab;
    -webkit-overflow-scrolling: touch;
  }
  .sw__viewport::-webkit-scrollbar {
    height: 6px;
  }
  .sw__viewport::-webkit-scrollbar-track {
    background: transparent;
  }
  .sw__viewport::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--ink) 72%, transparent);
    border-radius: 0;
  }
  .sw__viewport[data-dragging="true"] {
    cursor: grabbing;
    scroll-snap-type: none;
    user-select: none;
  }
  .sw__viewport:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: -2px;
  }
  .sw__track {
    display: flex;
    width: max-content;
    align-items: flex-start;
    gap: clamp(1.15rem, 2.1vw, 2.25rem);
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .sw__item {
    flex: 0 0 clamp(18.5rem, 34vw, 31rem);
    min-width: 0;
    scroll-snap-align: start;
    scroll-snap-stop: normal;
  }
  .sw__link {
    position: relative;
    display: block;
    color: var(--ink);
    text-decoration: none;
    transform: translateY(0);
    transition: transform var(--duration-slow) var(--ease-out);
  }
  .sw__link::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    box-shadow: 0 18px 38px rgba(24, 22, 18, .2);
    opacity: 0;
    transition: opacity var(--duration-slow) var(--ease-out);
  }
  .sw__media {
    position: relative;
    display: block;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--ink) 32%, transparent);
    background: color-mix(in srgb, var(--paper) 90%, var(--ink));
  }
  .sw__media::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background:
      linear-gradient(180deg, transparent 68%, rgba(18, 17, 14, .18)),
      url("/img/paper-noise.webp");
    background-size: 100% 100%, 150px 150px;
    mix-blend-mode: multiply;
    opacity: .22;
    transition: opacity var(--duration-normal) var(--ease-out);
  }
  .sw__image {
    object-fit: cover;
    transform: scale(1.001);
    transition: transform var(--duration-slow) var(--ease-out);
  }
  .sw__caption {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: .75rem;
    padding: .9rem 0 .2rem;
    border-top: 1px solid color-mix(in srgb, var(--ink) 32%, transparent);
  }
  .sw__num {
    font-family: var(--font-subtitle), monospace;
    font-size: clamp(1.25rem, 2vw, 1.75rem);
    font-weight: var(--offbit-weight-active);
    line-height: 1;
    letter-spacing: var(--offbit-letter-spacing);
    opacity: .62;
  }
  .sw__copy {
    min-width: 0;
  }
  .sw__title {
    display: block;
    overflow: hidden;
    font-family: var(--font-head);
    font-size: clamp(1.05rem, 1.5vw, 1.35rem);
    font-weight: 600;
    line-height: 1.08;
    letter-spacing: -.02em;
    text-overflow: ellipsis;
    text-transform: lowercase;
    white-space: nowrap;
  }
  .sw__tags {
    display: block;
    overflow: hidden;
    margin-top: .24rem;
    font-family: var(--font-body);
    font-size: var(--type-micro);
    line-height: 1.25;
    letter-spacing: .035em;
    opacity: .58;
    text-overflow: ellipsis;
    text-transform: lowercase;
    white-space: nowrap;
  }
  .sw__cta {
    gap: .3rem;
    min-height: 2.35rem;
    padding: .55rem .7rem;
    white-space: nowrap;
  }
  .sw__cta-arrow {
    display: inline-block;
    transition: transform var(--duration-normal) var(--ease-out);
  }
  @media (hover: hover) and (pointer: fine) {
    .sw__link:hover,
    .sw__link:focus-visible {
      transform: translateY(-6px);
    }
    .sw__link:hover::after,
    .sw__link:focus-visible::after {
      opacity: 1;
    }
    .sw__link:hover .sw__image,
    .sw__link:focus-visible .sw__image {
      transform: scale(1.018);
    }
    .sw__link:hover .sw__media::after,
    .sw__link:focus-visible .sw__media::after {
      opacity: .1;
    }
    .sw__link:hover .sw__cta-arrow,
    .sw__link:focus-visible .sw__cta-arrow {
      transform: translate(2px, -2px);
    }
  }
  .sw__link:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 6px;
  }
  .sw__endcap {
    display: flex;
    align-self: stretch;
    flex: 0 0 clamp(9rem, 16vw, 14rem);
    align-items: center;
    justify-content: center;
    border: 1px dashed color-mix(in srgb, var(--ink) 38%, transparent);
    color: var(--ink);
    font-family: var(--font-subtitle), monospace;
    font-size: clamp(1.1rem, 2vw, 1.6rem);
    letter-spacing: var(--offbit-letter-spacing);
    opacity: .58;
    text-align: center;
    text-transform: lowercase;
  }
  @media (max-width: 720px) {
    .sw__toolbar {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: flex-end;
    }
    .sw__hint {
      max-width: 12rem;
      line-height: 1.15;
    }
    .sw__item {
      flex-basis: min(80vw, 22rem);
    }
    .sw__viewport {
      padding-bottom: 1.55rem;
    }
    .sw__caption {
      grid-template-columns: auto minmax(0, 1fr);
    }
    .sw__cta {
      grid-column: 1 / -1;
      justify-self: start;
      margin-top: .15rem;
    }
    .sw__tags {
      white-space: normal;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .sw__viewport {
      scroll-behavior: auto;
    }
    .sw__hint-mark,
    .sw__button,
    .sw__link,
    .sw__link::after,
    .sw__media::after,
    .sw__image,
    .sw__cta-arrow {
      transition: none;
    }
    .sw-gallery:hover .sw__hint-mark,
    .sw__button:hover,
    .sw__button:focus-visible,
    .sw__link:hover,
    .sw__link:focus-visible,
    .sw__link:hover .sw__image,
    .sw__link:focus-visible .sw__image,
    .sw__link:hover .sw__cta-arrow,
    .sw__link:focus-visible .sw__cta-arrow {
      transform: none;
    }
  }
`;

export default function ScatteredWorks({ items }: { items: IndexItem[] }) {
  const { lang } = useT();
  const viewportRef = useRef<HTMLDivElement>(null);
  const controlsRafRef = useRef(0);
  const suppressClickRef = useRef(false);
  const dragRef = useRef<DragState>({
    active: false,
    moved: false,
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
  });
  const [dragging, setDragging] = useState(false);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(items.length > 1);

  const labels = lang === "pt"
    ? {
        region: "galeria horizontal de trabalhos selecionados",
        hint: "arraste para explorar",
        previous: "trabalhos anteriores",
        next: "próximos trabalhos",
        open: "ver projeto",
        end: "fim da seleção",
      }
    : {
        region: "horizontal gallery of selected work",
        hint: "drag to explore",
        previous: "previous projects",
        next: "next projects",
        open: "view project",
        end: "end of selection",
      };

  const updateControls = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const end = viewport.scrollWidth - viewport.clientWidth;
    setCanPrevious(viewport.scrollLeft > 2);
    setCanNext(viewport.scrollLeft < end - 2);
  }, []);

  const scheduleControlsUpdate = useCallback(() => {
    if (controlsRafRef.current) return;
    controlsRafRef.current = requestAnimationFrame(() => {
      controlsRafRef.current = 0;
      updateControls();
    });
  }, [updateControls]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(updateControls);
    observer.observe(viewport);
    updateControls();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(controlsRafRef.current);
    };
  }, [items.length, updateControls]);

  const scrollGallery = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    viewport.scrollBy({
      left: direction * Math.min(viewport.clientWidth * .78, 620),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const viewport = event.currentTarget;
    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: viewport.scrollLeft,
    };
    viewport.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > 5) drag.moved = true;
    if (!drag.moved) return;
    event.preventDefault();
    event.currentTarget.scrollLeft = drag.startScrollLeft - delta;
  };

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>, cancelled = false) => {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;
    const viewport = event.currentTarget;
    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
    drag.active = false;
    setDragging(false);
    scheduleControlsUpdate();

    if (!cancelled && drag.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  };

  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    scrollGallery(event.key === "ArrowLeft" ? -1 : 1);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sw-gallery">
        <div className="sw__toolbar">
          <p className="sw__hint" id="sw-drag-hint">
            <span>{labels.hint}</span>
            <span className="sw__hint-mark" aria-hidden="true">↔</span>
          </p>
          <div className="sw__controls">
            <button
              className="sw__button"
              type="button"
              aria-label={labels.previous}
              disabled={!canPrevious}
              onClick={() => scrollGallery(-1)}
            >
              <span aria-hidden="true">[ ← ]</span>
            </button>
            <button
              className="sw__button"
              type="button"
              aria-label={labels.next}
              disabled={!canNext}
              onClick={() => scrollGallery(1)}
            >
              <span aria-hidden="true">[ → ]</span>
            </button>
          </div>
        </div>

        <div
          className="sw__viewport"
          ref={viewportRef}
          role="region"
          aria-label={labels.region}
          aria-describedby="sw-drag-hint"
          tabIndex={0}
          data-dragging={dragging ? "true" : "false"}
          onScroll={scheduleControlsUpdate}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(event) => finishDrag(event)}
          onPointerCancel={(event) => finishDrag(event, true)}
          onClickCapture={handleClickCapture}
          onKeyDown={handleKeyDown}
          onDragStart={(event) => event.preventDefault()}
        >
          <ul className="sw__track">
            {items.map((item) => (
              <li className="sw__item" key={item.href}>
                <Link
                  className="sw__link hover-trigger"
                  href={item.href}
                  draggable={false}
                  data-cursor-label={`↗ ${item.num}`}
                >
                  <span className="sw__media">
                    <Image
                      className="sw__image"
                      src={item.img}
                      alt={item.title}
                      fill
                      sizes="(max-width: 720px) 82vw, (max-width: 1200px) 48vw, 528px"
                    />
                  </span>
                  <span className="sw__caption">
                    <span className="sw__num">{item.num}</span>
                    <span className="sw__copy">
                      <span className="sw__title">{item.title}</span>
                      <span className="sw__tags">{item.tags}</span>
                    </span>
                    <span className="sw__button sw__cta">
                      <span>{labels.open}</span>
                      <span className="sw__cta-arrow" aria-hidden="true">↗</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
            <li className="sw__endcap" aria-hidden="true">
              [ {labels.end} ]
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
