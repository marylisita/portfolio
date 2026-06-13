"use client";

import { useEffect, useRef, useState } from "react";

export interface Slide {
  src: string;
  title: string;
  tag: string;
  href: string;
}

const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform float uProgress;
uniform vec2 uRes;
uniform vec2 uFromRes;
uniform vec2 uToRes;

// Mapeia a UV para "cover" (preenche sem distorcer, cortando o excedente).
vec2 coverUV(vec2 uv, vec2 plane, vec2 img) {
  vec2 ratio = vec2(
    min((plane.x / plane.y) / (img.x / img.y), 1.0),
    min((plane.y / plane.x) / (img.y / img.x), 1.0)
  );
  return vec2(
    uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    uv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
}

void main() {
  float p = uProgress;

  // Deslocamento que sobe e desce ao longo da transição (0 nas pontas, máx no meio).
  float disp = sin(p * 3.14159265) * 0.16;
  // Onda vertical para dar o aspecto líquido.
  float wave = sin(vUv.y * 7.0 + p * 6.2831) * 0.5 + 0.5;
  vec2 dir = vec2(1.0, 0.0);

  vec2 fromUV = coverUV(vUv, uRes, uFromRes);
  vec2 toUV   = coverUV(vUv, uRes, uToRes);

  fromUV += dir * disp * wave * p;
  toUV   -= dir * disp * wave * (1.0 - p);

  // Leve separação de canais (RGB shift) na imagem que sai.
  float shift = disp * 0.45;
  vec4 fromC;
  fromC.r = texture2D(uFrom, fromUV + vec2(shift, 0.0)).r;
  fromC.g = texture2D(uFrom, fromUV).g;
  fromC.b = texture2D(uFrom, fromUV - vec2(shift, 0.0)).b;
  fromC.a = 1.0;

  vec4 toC = texture2D(uTo, toUV);

  float m = smoothstep(0.2, 0.8, p);
  gl_FragColor = mix(fromC, toC, m);
}
`;

const DURATION = 900; // ms da transição entre slides
const ease = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic

export default function WebGLSlider({ slides }: { slides: Slide[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [index, setIndex] = useState(0);
  const [glFailed, setGlFailed] = useState(false);

  // Estado mutável do WebGL guardado em ref (fora do ciclo de render do React).
  const gpu = useRef<{
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    textures: (WebGLTexture | null)[];
    sizes: [number, number][];
    uniforms: Record<string, WebGLUniformLocation | null>;
    from: number;
    to: number;
    progress: number;
    raf: number;
    transitioning: boolean;
  } | null>(null);

  // Setup único do contexto + shaders + texturas.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = (canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    } catch {
      gl = null;
    }
    if (!gl) {
      setGlFailed(true);
      return;
    }

    const compile = (type: number, src: string) => {
      const sh = gl!.createShader(type)!;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS)) {
        console.error("Shader error:", gl!.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      setGlFailed(true);
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      setGlFailed(true);
      return;
    }
    gl.useProgram(program);

    // Quad de tela cheia.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      uFrom: gl.getUniformLocation(program, "uFrom"),
      uTo: gl.getUniformLocation(program, "uTo"),
      uProgress: gl.getUniformLocation(program, "uProgress"),
      uRes: gl.getUniformLocation(program, "uRes"),
      uFromRes: gl.getUniformLocation(program, "uFromRes"),
      uToRes: gl.getUniformLocation(program, "uToRes"),
    };

    const textures: (WebGLTexture | null)[] = slides.map(() => null);
    const sizes: [number, number][] = slides.map(() => [1, 1]);

    gpu.current = {
      gl,
      program,
      textures,
      sizes,
      uniforms,
      from: 0,
      to: 0,
      progress: 0,
      raf: 0,
      transitioning: false,
    };

    // Placeholder 1x1 para texturas ainda não carregadas.
    const makeTex = () => {
      const t = gl!.createTexture();
      gl!.bindTexture(gl!.TEXTURE_2D, t);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, 1, 1, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, new Uint8Array([20, 20, 30, 255]));
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
      return t;
    };

    slides.forEach((slide, i) => {
      textures[i] = makeTex();
      const img = new Image();
      img.onload = () => {
        const g = gpu.current;
        if (!g) return;
        g.gl.bindTexture(g.gl.TEXTURE_2D, textures[i]);
        g.gl.pixelStorei(g.gl.UNPACK_FLIP_Y_WEBGL, 1);
        g.gl.texImage2D(g.gl.TEXTURE_2D, 0, g.gl.RGBA, g.gl.RGBA, g.gl.UNSIGNED_BYTE, img);
        sizes[i] = [img.naturalWidth, img.naturalHeight];
        if (i === g.from && !g.transitioning) draw();
      };
      img.src = slide.src;
    });

    const resize = () => {
      const g = gpu.current;
      if (!g) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      g.gl.viewport(0, 0, canvas.width, canvas.height);
      draw();
    };

    const draw = () => {
      const g = gpu.current;
      if (!g) return;
      const { gl: c, uniforms: u, textures: tx, sizes: sz } = g;
      c.activeTexture(c.TEXTURE0);
      c.bindTexture(c.TEXTURE_2D, tx[g.from]);
      c.uniform1i(u.uFrom, 0);
      c.activeTexture(c.TEXTURE1);
      c.bindTexture(c.TEXTURE_2D, tx[g.to]);
      c.uniform1i(u.uTo, 1);
      c.uniform1f(u.uProgress, g.progress);
      c.uniform2f(u.uRes, canvas.width, canvas.height);
      c.uniform2f(u.uFromRes, sz[g.from][0], sz[g.from][1]);
      c.uniform2f(u.uToRes, sz[g.to][0], sz[g.to][1]);
      c.drawArrays(c.TRIANGLES, 0, 3);
    };

    // Expõe draw/resize para os outros effects via ref.
    (gpu.current as unknown as { draw: () => void; resize: () => void }).draw = draw;
    (gpu.current as unknown as { draw: () => void; resize: () => void }).resize = resize;

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      const g = gpu.current;
      if (g) {
        cancelAnimationFrame(g.raf);
        g.textures.forEach((t) => g.gl.deleteTexture(t));
        g.gl.deleteProgram(g.program);
      }
      gpu.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dispara a transição quando o index muda.
  useEffect(() => {
    const g = gpu.current as
      | (NonNullable<typeof gpu.current> & { draw: () => void })
      | null;
    if (!g || glFailed) return;
    if (g.from === index) return;

    g.to = index;
    g.transitioning = true;
    const start = performance.now();

    const tick = (now: number) => {
      const gg = gpu.current as
        | (NonNullable<typeof gpu.current> & { draw: () => void })
        | null;
      if (!gg) return;
      const t = Math.min((now - start) / DURATION, 1);
      gg.progress = ease(t);
      gg.draw();
      if (t < 1) {
        gg.raf = requestAnimationFrame(tick);
      } else {
        gg.from = gg.to;
        gg.progress = 0;
        gg.transitioning = false;
        gg.draw();
      }
    };
    g.raf = requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, glFailed]);

  const go = (dir: number) => {
    setIndex((i) => (i + dir + slides.length) % slides.length);
  };

  // Arrastar para trocar de slide.
  const dragStart = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
  };

  const current = slides[index];

  return (
    <section
      style={{
        position: "relative",
        zIndex: 20,
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 2rem 120px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h2 style={{ fontFamily: "var(--font-head)", fontSize: "clamp(2.4rem, 4.5vw, 4.2rem)", fontWeight: 700, letterSpacing: "-0.5px", margin: 0 }}>
          Em Destaque
        </h2>
      </div>

      <div
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(360px, 64vh, 720px)",
          borderRadius: "var(--r-xl)",
          overflow: "hidden",
          border: "var(--border)",
          background: "#13131a",
          cursor: "grab",
          touchAction: "pan-y",
        }}
      >
        {/* Fallback: imagem simples se o WebGL não estiver disponível */}
        {glFailed ? (
          <img
            src={current.src}
            alt={current.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        )}

        {/* Gradiente para legibilidade do texto */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 45%)",
            pointerEvents: "none",
          }}
        />

        {/* Info do slide */}
        <div style={{ position: "absolute", left: 0, bottom: 0, padding: "clamp(1.2rem, 3vw, 2.4rem)", color: "#fff", maxWidth: "640px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8, marginBottom: "0.6rem" }}>
            {current.tag}
          </div>
          <h3 style={{ fontFamily: "var(--font-head)", fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 600, lineHeight: 1.05, margin: "0 0 1rem" }}>
            {current.title}
          </h3>
          <a
            href={current.href}
            className="hover-trigger"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1.3rem",
              background: "#fff",
              color: "#111",
              borderRadius: "var(--r-pill)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textDecoration: "none",
            }}
          >
            Ver Projeto →
          </a>
        </div>

        {/* Setas */}
        <button
          aria-label="Anterior"
          onClick={() => go(-1)}
          style={arrowStyle("left")}
          className="hover-trigger"
        >
          ←
        </button>
        <button
          aria-label="Próximo"
          onClick={() => go(1)}
          style={arrowStyle("right")}
          className="hover-trigger"
        >
          →
        </button>

        {/* Indicadores */}
        <div style={{ position: "absolute", bottom: "1.2rem", right: "1.4rem", display: "flex", gap: "0.5rem" }}>
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className="hover-trigger"
              style={{
                width: i === index ? "26px" : "10px",
                height: "10px",
                borderRadius: "var(--r-pill)",
                border: "1px solid rgba(255,255,255,0.7)",
                background: i === index ? "#fff" : "transparent",
                cursor: "pointer",
                transition: "width 0.3s ease, background 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function arrowStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    top: "50%",
    [side]: "1.2rem",
    transform: "translateY(-50%)",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.6)",
    background: "rgba(0,0,0,0.25)",
    backdropFilter: "blur(6px)",
    color: "#fff",
    fontSize: "1.2rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}
