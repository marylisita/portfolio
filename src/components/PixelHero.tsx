"use client";
import React, { useEffect, useRef } from "react";

interface PixelHeroProps {
    pixelSize?: number;
    baseBlue?: string;
    lilac?: string;
    bgBase?: string;
    bgGlow?: string;
    hoverRadius?: number;
    style?: React.CSSProperties;
}

export default function PixelHero(props: PixelHeroProps) {
    const {
        pixelSize = 32,
        baseBlue = "#96a5fa",
        lilac = "#be96ff",
        bgBase = "#FCF8FF",
        bgGlow = "#C8B0FF",
        hoverRadius = 160,
        style
    } = props;

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const CELL = pixelSize;
        const BASE_BLUE = hexToRgb(baseBlue);
        const LILAC = hexToRgb(lilac);
        const BG_BASE = hexToRgb(bgBase);
        const BG_GLOW = hexToRgb(bgGlow);

        let grid: any[] = [];
        let noiseOffX = 0;
        let noiseOffY = 100;
        let genSeed = Math.random() * 1000;
        let animId: number;
        let lastMouseX = -9999;
        let lastMouseY = -9999;
        let lastMouseTime = 0;
        let isMouseActive = false;

        function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
        function lerp2(a: number, b: number, t: number) { return a + t * (b - a); }
        function grad(hash: number, x: number, y: number) {
            const h = hash & 3;
            const u = h < 2 ? x : y;
            const v = h < 2 ? y : x;
            return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
        }
        const perm = new Uint8Array(512);
        const p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) p[i] = i;
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [p[i], p[j]] = [p[j], p[i]];
        }
        for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

        function noise2d(x: number, y: number) {
            const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255;
            const xf = x - Math.floor(x), yf = y - Math.floor(y);
            const u = fade(xf), v = fade(yf);
            const aa = perm[perm[xi] + yi];
            const ab = perm[perm[xi] + yi + 1];
            const ba = perm[perm[xi + 1] + yi];
            const bb = perm[perm[xi + 1] + yi + 1];
            return lerp2(
                lerp2(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
                lerp2(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
                v
            ) * 0.5 + 0.5;
        }

        function hexToRgb(hex: string) {
            const r = parseInt(hex.slice(1, 3), 16) || 0;
            const g = parseInt(hex.slice(3, 5), 16) || 0;
            const b = parseInt(hex.slice(5, 7), 16) || 0;
            return [r, g, b];
        }

        function buildGrid(w: number, h: number) {
            grid = [];
            const cols = Math.ceil(w / CELL) + 2;
            const rows = Math.ceil(h / CELL) + 2;
            const cx = cols / 2, cy = rows / 2;

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const n = noise2d(x * 0.12 + genSeed, y * 0.12 + genSeed);
                    const distX = Math.abs(x - cx) / cx;
                    const distY = Math.abs(y - cy) / cy;
                    const distFromCenter = Math.sqrt(distX * distX + distY * distY);
                    const maskValue = n + distFromCenter * 0.25;

                    const inTextZone = distX < 0.4 && distY < 0.35;

                    if (maskValue > 0.78 && !inTextZone) {
                        const behaviors = [0, 1, 2, 3, 4];
                        let behavior = Math.floor(Math.random() * 5);
                        if (behavior === 0 && Math.random() > 0.3) behavior = Math.floor(Math.random() * 4) + 1;

                        grid.push({
                            x: x * CELL,
                            y: y * CELL,
                            behavior,
                            scale: 1,
                            targetScale: 1,
                            offsetX: 0,
                            offsetY: 0,
                            targetOffsetX: 0,
                            targetOffsetY: 0,
                            colorBlend: 0,
                        });
                    }
                }
            }
        }

        function drawGradient(x: number, y: number, radius: number) {
            if (!ctx) return;
            const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
            grad.addColorStop(0, `rgba(${BG_GLOW[0]},${BG_GLOW[1]},${BG_GLOW[2]},0.92)`);
            grad.addColorStop(0.45, `rgba(${BG_GLOW[0]},${BG_GLOW[1]},${BG_GLOW[2]},0.5)`);
            grad.addColorStop(1, `rgba(${BG_BASE[0]},${BG_BASE[1]},${BG_BASE[2]},0)`);
            ctx.fillStyle = grad;
            if (canvas) ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function lerpVal(a: number, b: number, t: number) { return a + (b - a) * t; }

        function draw() {
            if (!ctx || !canvas) return;
            const W = canvas.width, H = canvas.height;

            if (Date.now() - lastMouseTime > 1000) isMouseActive = false;

            ctx.fillStyle = `rgb(${BG_BASE[0]},${BG_BASE[1]},${BG_BASE[2]})`;
            ctx.fillRect(0, 0, W, H);

            const glowX = W * 0.5 + (noise2d(noiseOffX, 0) * 2 - 1) * W * 0.15;
            const glowY = H * 0.5 + (noise2d(noiseOffY, 0) * 2 - 1) * H * 0.15;
            noiseOffX += 0.003;
            noiseOffY += 0.003;

            const maxR = Math.max(W, H) * 0.65;
            drawGradient(glowX, glowY, maxR);

            const glowX2 = W * 0.5 + (noise2d(noiseOffX + 100, 0) * 2 - 1) * W * 0.2;
            const glowY2 = H * 0.5 + (noise2d(noiseOffY + 100, 0) * 2 - 1) * H * 0.2;
            drawGradient(glowX2, glowY2, maxR * 0.75);

            ctx.strokeStyle = "rgba(255,255,255,0.35)";
            ctx.lineWidth = 1;
            for (let x = 0; x < W; x += CELL) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
            for (let y = 0; y < H; y += CELL) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

            ctx.fillStyle = "rgba(0,0,0,0.08)";
            for (let i = 0; i < 800; i++) {
                const s = Math.random() * 2 + 1;
                ctx.fillRect(Math.random() * W, Math.random() * H, s, s);
            }

            for (const cell of grid) {
                const cx = cell.x + CELL / 2;
                const cy = cell.y + CELL / 2;
                const mx = lastMouseX, my = lastMouseY;

                const distortion = (noise2d(cx * 0.02 + noiseOffX * 5, cy * 0.02) * 2 - 1) * 50;
                const d = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2) + distortion;
                const influence = isMouseActive ? Math.max(0, 1 - d / hoverRadius) : 0;

                cell.targetScale = 1;
                cell.targetOffsetX = 0;
                cell.targetOffsetY = 0;
                let targetBlend = 0;

                if (influence > 0) {
                    targetBlend = 1;
                    if (cell.behavior === 0) {
                        cell.targetScale = 0;
                    } else if (cell.behavior === 1) {
                        cell.targetOffsetX = -CELL;
                    } else if (cell.behavior === 2) {
                        cell.targetOffsetX = CELL;
                    } else if (cell.behavior === 3) {
                        cell.targetOffsetY = -CELL;
                    } else {
                        cell.targetOffsetY = CELL;
                    }
                }

                cell.scale = lerpVal(cell.scale, cell.targetScale, 0.15);
                cell.offsetX = lerpVal(cell.offsetX, cell.targetOffsetX, 0.15);
                cell.offsetY = lerpVal(cell.offsetY, cell.targetOffsetY, 0.15);
                cell.colorBlend = lerpVal(cell.colorBlend, targetBlend, 0.15);

                if (cell.scale > 0.01) {
                    const r = lerpVal(BASE_BLUE[0], LILAC[0], cell.colorBlend);
                    const g = lerpVal(BASE_BLUE[1], LILAC[1], cell.colorBlend);
                    const b = lerpVal(BASE_BLUE[2], LILAC[2], cell.colorBlend);
                    ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;

                    const size = (CELL + 0.5) * cell.scale;
                    const off = (CELL - size) / 2;
                    ctx.fillRect(
                        cell.x + off + cell.offsetX,
                        cell.y + off + cell.offsetY,
                        size, size
                    );
                }
            }

            animId = requestAnimationFrame(draw);
        }

        function resize() {
            if (!canvas) return;
            const parent = canvas.parentElement;
            if (!parent) return;
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
            buildGrid(canvas.width, canvas.height);
        }

        function onMouseMove(e: MouseEvent) {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            lastMouseX = e.clientX - rect.left;
            lastMouseY = e.clientY - rect.top;
            lastMouseTime = Date.now();
            isMouseActive = true;
        }
        function onMouseLeave() {
            isMouseActive = false;
        }
        function onTouchMove(e: TouchEvent) {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const t = e.touches[0];
            lastMouseX = t.clientX - rect.left;
            lastMouseY = t.clientY - rect.top;
            lastMouseTime = Date.now();
            isMouseActive = true;
        }

        resize();
        draw();

        const ro = new ResizeObserver(resize);
        if (canvas.parentElement) {
            ro.observe(canvas.parentElement);
        }

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseleave", onMouseLeave);
        window.addEventListener("touchmove", onTouchMove, { passive: true });

        return () => {
            cancelAnimationFrame(animId);
            ro.disconnect();
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseleave", onMouseLeave);
            window.removeEventListener("touchmove", onTouchMove);
        };
    }, [pixelSize, baseBlue, lilac, bgBase, bgGlow, hoverRadius]);

    return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "auto", zIndex: 0, ...style }}>
            <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%", position: "absolute", inset: 0 }} />
        </div>
    );
}
