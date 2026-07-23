"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useId, useRef, useState } from "react";
import { useT } from "@/i18n/LanguageContext";

export type ConstellationNode = {
  label: string;
  detail: string;
};

type Point = {
  x: number;
  y: number;
  rotation: number;
  glyph: string;
};

type StitchSegment = {
  connection: number;
  from: number;
  to: number;
};

type StitchRun = {
  id: number;
  segments: StitchSegment[];
  step: number;
};

type Impact = {
  node: number;
  from: number;
  version: number;
};

/*
 * A ordem dos pontos segue a ordem recebida da home:
 * identidade, web, direção, estratégia, movimento, tecnologia.
 */
const positions: Point[] = [
  { x: 18, y: 22, rotation: 1.5, glyph: "✦" },
  { x: 50, y: 19, rotation: 2.1, glyph: "✧" },
  { x: 82, y: 22, rotation: 1.2, glyph: "✦" },
  { x: 73, y: 59, rotation: -1.8, glyph: "⋆" },
  { x: 14, y: 63, rotation: -2.4, glyph: "⋆" },
  { x: 43, y: 61, rotation: -1.2, glyph: "✧" },
];

/* Um único fio contínuo em zigue-zague entre as duas fileiras. */
const connections: Array<[number, number]> = [
  [4, 0],
  [0, 5],
  [5, 1],
  [1, 3],
  [3, 2],
];

const allConnectionIndexes = connections.map((_, index) => index);
const stitchDuration = 0.46;

const styles = `
  .sc {
    position: relative;
    min-height: 27rem;
    overflow: hidden;
    isolation: isolate;
    background:
      radial-gradient(circle at 48% 42%, color-mix(in srgb, var(--ink) 4%, transparent), transparent 64%),
      url("/img/paper-noise.png");
    background-size: 100% 100%, 170px 170px;
    padding-bottom: 5.5rem;
  }
  .sc::before {
    content: "";
    position: absolute;
    inset: 1rem;
    z-index: -1;
    border: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
    pointer-events: none;
  }
  .sc__hint {
    position: absolute;
    z-index: 6;
    top: .9rem;
    left: 1rem;
    margin: 0;
    color: var(--ink);
    font-family: var(--font-head);
    font-size: var(--type-micro);
    font-style: italic;
    letter-spacing: .01em;
    opacity: .58;
    rotate: -1.4deg;
    transition: opacity .35s ease;
    pointer-events: none;
  }
  .sc[data-touched="true"] .sc__hint { opacity: .22; }
  .sc__lines,
  .sc__nodes {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .sc__lines {
    z-index: 1;
    overflow: visible;
    pointer-events: none;
  }
  .sc__nodes { z-index: 3; }
  .sc__thread {
    color: var(--ink);
    opacity: 0;
    transition: opacity .25s ease;
  }
  .sc__thread[data-sewn="true"] { opacity: .46; }
  .sc__thread[data-sewn="true"][data-related="true"] { opacity: .76; }
  .sc__thread-indent {
    opacity: .08;
    filter: blur(.25px);
  }
  .sc__thread-shadow {
    opacity: .68;
    filter: drop-shadow(.7px 1px .3px color-mix(in srgb, var(--ink) 22%, transparent));
  }
  .sc__thread-fibre {
    color: color-mix(in srgb, var(--paper) 72%, white);
    opacity: .6;
  }
  .sc__puncture {
    color: var(--ink);
    opacity: .55;
  }
  .sc__thread--active {
    color: var(--ink);
    opacity: .92;
  }
  .sc__needle {
    color: var(--ink);
    filter:
      drop-shadow(.8px 1px .35px color-mix(in srgb, var(--ink) 25%, transparent))
      drop-shadow(-.5px -.5px 0 color-mix(in srgb, white 48%, transparent));
  }
  .sc__node {
    position: absolute;
    left: var(--sc-x);
    top: var(--sc-y);
    translate: -50% -.42rem;
    border: 0;
    min-width: var(--tap-min);
    min-height: var(--tap-min);
    padding: 0;
    background: transparent;
    color: var(--ink);
    cursor: pointer;
    white-space: nowrap;
  }
  .sc__strip {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: .52rem;
    min-height: 3.35rem;
    padding: .95rem .9rem .68rem;
    border: 1px solid color-mix(in srgb, var(--ink) 24%, transparent);
    background:
      linear-gradient(112deg, color-mix(in srgb, white 38%, transparent), transparent 46%, color-mix(in srgb, var(--ink) 5%, transparent)),
      repeating-linear-gradient(0deg, transparent 0 2px, color-mix(in srgb, var(--ink) 3%, transparent) 2px 3px),
      repeating-linear-gradient(90deg, transparent 0 3px, color-mix(in srgb, white 15%, transparent) 3px 4px),
      url("/img/paper-noise.png"),
      color-mix(in srgb, var(--paper) 94%, white);
    background-size: 100% 100%, 100% 100%, 100% 100%, 145px 145px, 100% 100%;
    box-shadow:
      0 7px 12px color-mix(in srgb, var(--ink) 13%, transparent),
      inset 0 0 0 1px color-mix(in srgb, white 18%, transparent);
    rotate: var(--sc-rotation);
    transform-origin: 50% .42rem;
    transition:
      border-color .25s ease,
      box-shadow .3s cubic-bezier(.16,1,.3,1),
      filter .3s cubic-bezier(.16,1,.3,1),
      translate .3s cubic-bezier(.16,1,.3,1);
  }
  .sc__strip::before {
    content: "";
    position: absolute;
    top: .26rem;
    left: 50%;
    width: .38rem;
    height: .38rem;
    translate: -50% 0;
    border: 1px solid color-mix(in srgb, var(--ink) 38%, transparent);
    border-radius: 50%;
    background:
      radial-gradient(circle, var(--paper) 0 34%, color-mix(in srgb, var(--ink) 18%, transparent) 37% 48%, var(--paper) 52%);
    box-shadow:
      inset 1px 1px 1px color-mix(in srgb, var(--ink) 11%, transparent),
      0 0 0 1px color-mix(in srgb, white 22%, transparent);
  }
  .sc__node:hover .sc__strip {
    translate: 0 -3px;
    rotate: 0deg;
    border-color: color-mix(in srgb, var(--ink) 42%, transparent);
    box-shadow:
      0 11px 16px color-mix(in srgb, var(--ink) 16%, transparent),
      inset 0 0 0 1px color-mix(in srgb, white 22%, transparent);
  }
  .sc__node[data-active="true"] .sc__strip {
    border-color: color-mix(in srgb, var(--ink) 46%, transparent);
    box-shadow:
      0 9px 15px color-mix(in srgb, var(--ink) 17%, transparent),
      inset 0 -2px 0 color-mix(in srgb, var(--ink) 8%, transparent);
  }
  .sc__node:focus-visible { outline: none; }
  .sc__node:focus-visible .sc__strip {
    outline: 2px dotted var(--ink);
    outline-offset: 4px;
  }
  .sc__glyph {
    display: inline-block;
    font-family: var(--font-mono), monospace;
    font-size: 1rem;
    line-height: 1;
    transition: rotate .28s cubic-bezier(.16,1,.3,1), scale .28s cubic-bezier(.16,1,.3,1);
  }
  .sc__node:hover .sc__glyph,
  .sc__node[data-active="true"] .sc__glyph {
    rotate: 18deg;
    scale: 1.14;
  }
  .sc__name {
    font-family: var(--font-mono), monospace;
    font-size: var(--type-micro);
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: lowercase;
  }
  .sc__node[data-active="true"] .sc__name { letter-spacing: .145em; }
  .sc__detail {
    position: absolute;
    z-index: 5;
    left: 50%;
    bottom: 1rem;
    translate: -50% 0;
    width: min(88%, 40rem);
    min-height: 3.8rem;
    display: grid;
    grid-template-columns: minmax(7rem, auto) 1fr;
    align-items: center;
    gap: 1.1rem;
    margin: 0;
    padding: .78rem 1.2rem .82rem;
    border: 1px solid color-mix(in srgb, var(--ink) 20%, transparent);
    background:
      linear-gradient(96deg, color-mix(in srgb, white 24%, transparent), transparent 52%),
      url("/img/paper-noise.png"),
      color-mix(in srgb, var(--paper) 95%, white);
    background-size: 100% 100%, 145px 145px, 100% 100%;
    box-shadow: 5px 6px 0 color-mix(in srgb, var(--ink) 8%, transparent);
    rotate: -.45deg;
    font-family: var(--font-head);
    font-size: var(--type-body);
    font-style: italic;
    text-align: left;
  }
  .sc__detail-key {
    font-family: var(--font-mono), monospace;
    font-size: var(--type-micro);
    font-style: normal;
    font-weight: 700;
    letter-spacing: .13em;
    text-transform: lowercase;
    opacity: .62;
    white-space: nowrap;
  }
  @media (max-width: 720px) {
    .sc { min-height: 25rem; padding-bottom: 5.3rem; }
    .sc::before { inset: .5rem; }
    .sc__hint { top: .65rem; left: .75rem; font-size: var(--type-micro); }
    .sc__strip {
      min-height: var(--tap-min);
      gap: .33rem;
      padding: .83rem .48rem .52rem;
    }
    .sc__name { font-size: var(--type-micro); letter-spacing: .055em; }
    .sc__glyph { font-size: .77rem; }
    .sc__detail {
      width: calc(100% - 1.25rem);
      min-height: 4rem;
      grid-template-columns: 1fr;
      gap: .18rem;
      padding: .62rem .8rem .68rem;
      text-align: center;
      font-size: var(--type-body);
    }
    .sc__detail-key { font-size: var(--type-micro); }
  }
  @media (prefers-reduced-motion: reduce) {
    .sc__hint,
    .sc__thread,
    .sc__strip,
    .sc__glyph { transition: none; }
    .sc__thread { opacity: .46; }
    .sc__thread[data-related="true"] { opacity: .76; }
    .sc__node:hover .sc__strip { translate: none; }
  }
`;

function stitchPoints(from: Point, to: Point) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const px = -dy / length;
  const py = dx / length;
  const steps = 12;

  return Array.from({ length: steps + 1 }, (_, index) => {
    const progress = index / steps;
    const edge = index === 0 || index === steps;
    const tension = edge ? 0 : (index % 2 === 0 ? 0.24 : -0.24);
    return {
      x: from.x + dx * progress + px * tension,
      y: from.y + dy * progress + py * tension,
    };
  });
}

function connectionPath(from: Point, to: Point) {
  return stitchPoints(from, to)
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
}

function visibleStitches(from: Point, to: Point) {
  const points = stitchPoints(from, to);
  return points.slice(0, -1).flatMap((point, index) => {
    if (index % 2 !== 0) return [];
    const end = points[index + 1];
    const dx = end.x - point.x;
    const dy = end.y - point.y;
    const length = Math.hypot(dx, dy) || 1;
    const bend = index % 4 === 0 ? 0.14 : -0.14;
    const middleX = (point.x + end.x) / 2 + (-dy / length) * bend;
    const middleY = (point.y + end.y) / 2 + (dx / length) * bend;
    return [{
      path: `M ${point.x} ${point.y} Q ${middleX} ${middleY} ${end.x} ${end.y}`,
      start: point,
      end,
    }];
  });
}

export default function SkillConstellation({ nodes }: { nodes: ConstellationNode[] }) {
  const placed = nodes.slice(0, positions.length);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const [sewn, setSewn] = useState<Set<number>>(() => new Set());
  const [run, setRun] = useState<StitchRun | null>(null);
  const [impact, setImpact] = useState<Impact>({ node: -1, from: -1, version: 0 });
  const runId = useRef(0);
  const introStarted = useRef(false);
  const reduceMotion = useReducedMotion();
  const rawId = useId();
  const componentId = rawId.replaceAll(":", "");
  const detailId = `${componentId}-detail`;
  const { lang } = useT();

  const startRun = useCallback((segments: StitchSegment[], reset = false) => {
    if (segments.length === 0) return;
    if (reset) setSewn(new Set());
    runId.current += 1;
    setRun({ id: runId.current, segments, step: 0 });
  }, []);

  const startIntro = useCallback(() => {
    if (introStarted.current) return;
    introStarted.current = true;
    if (reduceMotion) {
      setSewn(new Set(allConnectionIndexes));
      return;
    }
    startRun(
      connections.map(([from, to], connection) => ({ connection, from, to })),
      true,
    );
  }, [reduceMotion, startRun]);

  const selectNode = (index: number, stitch: boolean) => {
    setActive(index);
    if (!stitch) return;

    setTouched(true);
    setSewn(new Set(allConnectionIndexes));

    if (reduceMotion) return;

    /*
     * Cada ligação é orientada em direção à tira escolhida:
     * a agulha termina no furo clicado e o papel responde ao toque.
     */
    const related = connections.flatMap(([a, b], connection) => {
      if (a === index) return [{ connection, from: b, to: a }];
      if (b === index) return [{ connection, from: a, to: b }];
      return [];
    });
    startRun(related);
  };

  const currentSegment = reduceMotion ? undefined : run?.segments[run.step];
  const currentFrom = currentSegment ? positions[currentSegment.from] : null;
  const currentTo = currentSegment ? positions[currentSegment.to] : null;
  const activePath = currentFrom && currentTo ? connectionPath(currentFrom, currentTo) : "";

  const finishSegment = (finishedRun: number, finishedStep: number) => {
    if (!run || run.id !== finishedRun || run.step !== finishedStep) return;
    const segment = run.segments[run.step];

    setSewn((previous) => {
      const next = new Set(previous);
      next.add(segment.connection);
      return next;
    });
    setImpact((previous) => ({
      node: segment.to,
      from: segment.from,
      version: previous.version + 1,
    }));

    if (run.step + 1 < run.segments.length) {
      setRun({ ...run, step: run.step + 1 });
    } else {
      setRun(null);
    }
  };

  const relatedConnections = new Set(
    connections.flatMap(([a, b], index) => (a === active || b === active ? [index] : [])),
  );

  const needle = currentFrom && currentTo
    ? (() => {
        const dx = currentTo.x - currentFrom.x;
        const dy = currentTo.y - currentFrom.y;
        const length = Math.hypot(dx, dy) || 1;
        const ux = dx / length;
        const uy = dy / length;
        return {
          start: {
            x1: currentFrom.x - ux * 2.35,
            y1: currentFrom.y - uy * 2.35,
            x2: currentFrom.x + ux * 0.7,
            y2: currentFrom.y + uy * 0.7,
            eyeX: currentFrom.x - ux * 2.05,
            eyeY: currentFrom.y - uy * 2.05,
          },
          end: {
            x1: currentTo.x - ux * 2.35,
            y1: currentTo.y - uy * 2.35,
            x2: currentTo.x + ux * 0.7,
            y2: currentTo.y + uy * 0.7,
            eyeX: currentTo.x - ux * 2.05,
            eyeY: currentTo.y - uy * 2.05,
          },
        };
      })()
    : null;

  return (
    <div className="sc" data-touched={touched ? "true" : "false"}>
      <style>{styles}</style>

      <p className="sc__hint" aria-hidden="true">
        {lang === "pt" ? "( toque nas amostras ✳︎ — a agulha responde )" : "( touch the samples ✳︎ — the needle responds )"}
      </p>

      <svg className="sc__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {connections.map(([from, to], connection) => (
          <g
            key={connection}
            className="sc__thread"
            data-sewn={sewn.has(connection) ? "true" : "false"}
            data-related={relatedConnections.has(connection) ? "true" : "false"}
          >
              <path
                className="sc__thread-indent"
                d={connectionPath(positions[from], positions[to])}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              {visibleStitches(positions[from], positions[to]).map((stitch, stitchIndex) => (
                <g key={stitchIndex}>
                  <path
                    className="sc__thread-shadow"
                    d={stitch.path}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    className="sc__thread-fibre"
                    d={stitch.path}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth=".34"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  {[stitch.start, stitch.end].map((point, pointIndex) => (
                    <circle
                      key={pointIndex}
                      className="sc__puncture"
                      cx={point.x}
                      cy={point.y}
                      r=".23"
                      fill="var(--paper)"
                      stroke="currentColor"
                      strokeWidth=".42"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </g>
              ))}
          </g>
        ))}

        {!reduceMotion && run && currentSegment && currentFrom && currentTo && needle && (
          <g key={`${run.id}-${run.step}`}>
            <mask
              id={`${componentId}-mask-${run.id}-${run.step}`}
              x="0"
              y="0"
              width="100"
              height="100"
              maskUnits="userSpaceOnUse"
            >
              <motion.path
                d={activePath}
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: stitchDuration, ease: [0.87, 0, 0.13, 1] }}
                onAnimationComplete={() => finishSegment(run.id, run.step)}
              />
            </mask>

            <g
              className="sc__thread--active"
              mask={`url(#${componentId}-mask-${run.id}-${run.step})`}
            >
              {visibleStitches(currentFrom, currentTo).map((stitch, stitchIndex) => (
                <g key={stitchIndex}>
                  <path
                    d={stitch.path}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    className="sc__thread-fibre"
                    d={stitch.path}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth=".34"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  {[stitch.start, stitch.end].map((point, pointIndex) => (
                    <circle
                      key={pointIndex}
                      className="sc__puncture"
                      cx={point.x}
                      cy={point.y}
                      r=".23"
                      fill="var(--paper)"
                      stroke="currentColor"
                      strokeWidth=".42"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </g>
              ))}
            </g>

            <motion.line
              className="sc__needle"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{
                x1: needle.start.x1,
                y1: needle.start.y1,
                x2: needle.start.x2,
                y2: needle.start.y2,
                opacity: 0,
              }}
              animate={{
                x1: needle.end.x1,
                y1: needle.end.y1,
                x2: needle.end.x2,
                y2: needle.end.y2,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: stitchDuration,
                ease: [0.87, 0, 0.13, 1],
                opacity: { times: [0, 0.08, 0.86, 1] },
              }}
            />
            <motion.circle
              className="sc__needle"
              r=".42"
              fill="var(--paper)"
              stroke="currentColor"
              strokeWidth=".65"
              vectorEffect="non-scaling-stroke"
              initial={{ cx: needle.start.eyeX, cy: needle.start.eyeY, opacity: 0 }}
              animate={{
                cx: needle.end.eyeX,
                cy: needle.end.eyeY,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: stitchDuration,
                ease: [0.87, 0, 0.13, 1],
                opacity: { times: [0, 0.08, 0.86, 1] },
              }}
            />
          </g>
        )}
      </svg>

      <motion.div
        className="sc__nodes"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren: reduceMotion ? 0 : 0.08,
              staggerChildren: reduceMotion ? 0 : 0.09,
            },
          },
        }}
        onAnimationComplete={startIntro}
      >
        {placed.map((node, index) => {
          const isImpacted = impact.node === index;
          const impactKey = isImpacted ? impact.version : 0;
          const pullFrom = isImpacted && impact.from >= 0 ? positions[impact.from] : positions[index];
          const pullX = Math.max(-2.8, Math.min(2.8, (pullFrom.x - positions[index].x) * 0.09));
          const pullY = Math.max(-2.2, Math.min(2.2, (pullFrom.y - positions[index].y) * 0.07));

          return (
            <motion.button
              type="button"
              key={node.label}
              className="sc__node hover-trigger"
              style={{
                "--sc-x": `${positions[index].x}%`,
                "--sc-y": `${positions[index].y}%`,
                "--sc-rotation": `${positions[index].rotation}deg`,
              } as React.CSSProperties}
              data-active={active === index ? "true" : "false"}
              onPointerEnter={() => selectNode(index, false)}
              onFocus={() => selectNode(index, false)}
              onClick={() => selectNode(index, true)}
              aria-describedby={detailId}
              aria-pressed={active === index}
              variants={{
                hidden: { opacity: 0, y: 22, scale: 0.94 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: reduceMotion ? 0 : 0.48,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
            >
              <motion.span
                key={`${node.label}-${impactKey}`}
                className="sc__strip"
                animate={isImpacted
                  ? {
                      x: [0, pullX, pullX * -0.42, 0],
                      y: [0, pullY, pullY * -0.42, 0],
                      rotate: [0, pullX * 0.72, pullX * -0.34, 0],
                    }
                  : undefined}
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="sc__glyph" aria-hidden="true">{positions[index].glyph}</span>
                <span className="sc__name">{node.label}</span>
              </motion.span>
            </motion.button>
          );
        })}
      </motion.div>

      <motion.p
        id={detailId}
        className="sc__detail"
        key={placed[active]?.label}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
        aria-live="polite"
      >
        <span className="sc__detail-key">✳︎ {placed[active]?.label}</span>
        <span>{placed[active]?.detail}</span>
      </motion.p>
    </div>
  );
}
