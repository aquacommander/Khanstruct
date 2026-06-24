'use client';

/* ════════════════════════════════════════════════════════════════════════
   LOADER CANVAS — Zain's "node-brain → K" intro.

   Labeled idea-nodes glow in against black space, link into a network, pull to
   a glowing core, then the particles CONVERGE INTO THE EXACT SHAPE OF THE LOGO
   — the target points are sampled from the real khanstruct-logo.png, so the
   dots assemble into his precise K — before the crisp logo resolves in.

   Self-contained canvas. Respects reduced motion (static logo). Timed to the
   loader's MIN_INTRO_MS so it finishes just before the page hands off.
   ──────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef } from 'react';

const LOGO_SRC = '/khanstruct-logo.png';
const N = 220;
const DURATION = 5000; // ms — kept in step with SiteLoader MIN_INTRO_MS
const LABELS = ['IDEAS', 'DATA', 'TOOLS', 'SYSTEMS', 'PEOPLE', 'INSIGHT', 'MODELS', 'DESIGN'];

type Particle = {
  sx: number; sy: number; // scattered start
  bx: number; by: number; // node-brain position
  tx: number; ty: number; // logo-shape target
  label: string | null;
  r: number;
  ph: number; sp: number; delay: number;
};

export function LoaderCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = ref.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext('2d');
    if (!context) return;
    // Re-bind as narrowed consts so the nested draw/resize closures see them as
    // non-null (TS doesn't carry narrowing into nested function declarations).
    const canvas = canvasEl;
    const ctx = context;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0, H = 0, DPR = 1;
    let particles: Particle[] = [];
    let edges: Array<[number, number]> = [];
    let shapePts: Array<{ x: number; y: number }> = []; // normalized −1..1 within the logo box
    let logo: HTMLImageElement | null = null;
    let raf = 0;
    const start = performance.now();

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);
    const eo = (t: number) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
    const eio = (t: number) => {
      t = clamp(t, 0, 1);
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    };
    const seg = (e: number, a: number, b: number) => clamp((e - a) / (b - a), 0, 1);

    const box = () => Math.min(W, H * 1.15) * (W < 640 ? 0.64 : 0.4);
    const cx = () => W * 0.5;
    const cy = () => H * 0.46;

    function assignTargets() {
      const b = box();
      for (let i = 0; i < N; i++) {
        const pt = shapePts.length ? shapePts[i % shapePts.length] : { x: 0, y: 0 };
        particles[i].tx = cx() + pt.x * b * 0.5;
        particles[i].ty = cy() + pt.y * b * 0.5;
      }
    }

    function buildParticles() {
      const b = box();
      particles = [];
      for (let i = 0; i < N; i++) {
        const ang = rnd(0, Math.PI * 2);
        const rad = Math.pow(Math.random(), 0.6);
        particles.push({
          sx: cx() + Math.cos(ang) * rad * W * 0.52,
          sy: cy() + Math.sin(ang) * rad * H * 0.52,
          bx: cx() + Math.cos(ang) * (0.3 + rad * 0.18) * b,
          by: cy() + Math.sin(ang) * (0.3 + rad * 0.18) * b * 0.9,
          tx: cx(), ty: cy(),
          label: i < 8 ? LABELS[i] : null,
          r: i < 8 ? 2.6 : rnd(1.1, 1.9),
          ph: rnd(0, 6.28), sp: rnd(0.001, 0.0022), delay: rnd(0, 340),
        });
      }
      assignTargets();
      // nearest-neighbour edges for the network look
      edges = [];
      const seen: Record<string, 1> = {};
      for (let a = 0; a < N; a++) {
        let best = 1e9, n1 = -1;
        for (let c = 0; c < N; c++) {
          if (c === a) continue;
          const dx = particles[a].bx - particles[c].bx;
          const dy = particles[a].by - particles[c].by;
          const d = dx * dx + dy * dy;
          if (d < best) { best = d; n1 = c; }
        }
        if (n1 >= 0) {
          const k = Math.min(a, n1) + '_' + Math.max(a, n1);
          if (!seen[k]) { seen[k] = 1; edges.push([a, n1]); }
        }
      }
    }

    function sampleLogo(img: HTMLImageElement) {
      const S = 200;
      const oc = document.createElement('canvas');
      oc.width = S; oc.height = S;
      const octx = oc.getContext('2d');
      if (!octx) return;
      octx.drawImage(img, 0, 0, S, S);
      let data: Uint8ClampedArray;
      try {
        data = octx.getImageData(0, 0, S, S).data;
      } catch {
        return; // tainted canvas guard (same-origin asset, so shouldn't happen)
      }
      const pts: Array<{ x: number; y: number }> = [];
      for (let y = 0; y < S; y += 2) {
        for (let x = 0; x < S; x += 2) {
          if (data[(y * S + x) * 4 + 3] > 90) {
            pts.push({ x: (x / S) * 2 - 1, y: (y / S) * 2 - 1 });
          }
        }
      }
      // shuffle so the slice is an even spread across the shape
      for (let i = pts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pts[i], pts[j]] = [pts[j], pts[i]];
      }
      if (pts.length) shapePts = pts.slice(0, N);
    }

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      buildParticles();
    }

    function drawLogo(alpha: number) {
      if (!logo) return;
      const b = box();
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.drawImage(logo, cx() - b / 2, cy() - b / 2, b, b);
      ctx.restore();
    }

    function draw(now: number) {
      const e = now - start;
      ctx.clearRect(0, 0, W, H);

      const brain = eio(seg(e, DURATION * 0.16, DURATION * 0.46));
      const conv = eio(seg(e, DURATION * 0.46, DURATION * 0.8));
      const reveal = eo(seg(e, DURATION * 0.74, DURATION));
      const nodeFade = 1 - eo(seg(e, DURATION * 0.78, DURATION * 0.97));
      const labelFade = 1 - seg(e, DURATION * 0.3, DURATION * 0.46);

      const pos: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < N; i++) {
        const p = particles[i];
        const drift = Math.sin(now * p.sp + p.ph) * 5 * (1 - brain);
        const sx = p.sx + drift, sy = p.sy - drift;
        const px = lerp(lerp(sx, p.bx, brain), p.tx, conv);
        const py = lerp(lerp(sy, p.by, brain), p.ty, conv);
        pos.push({ x: px, y: py });
      }

      // network edges
      const edgeA = seg(e, DURATION * 0.18, DURATION * 0.42) * (1 - conv) * nodeFade;
      if (edgeA > 0.01) {
        ctx.lineWidth = 0.6;
        ctx.strokeStyle = 'rgba(120,165,245,0.85)';
        const maxD = box() * 0.7;
        for (const [a, c] of edges) {
          const A = pos[a], B = pos[c];
          const d = Math.hypot(A.x - B.x, A.y - B.y);
          if (d > maxD) continue;
          ctx.globalAlpha = edgeA * 0.5 * (1 - d / maxD);
          ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // core glow
      const coreA = brain * (1 - conv) * (0.5 + 0.5 * Math.sin(now * 0.004)) * nodeFade;
      if (coreA > 0.02) {
        const g = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), box() * 0.6);
        g.addColorStop(0, `rgba(255,214,150,${0.4 * coreA})`);
        g.addColorStop(0.4, `rgba(150,190,255,${0.14 * coreA})`);
        g.addColorStop(1, 'rgba(120,160,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx(), cy(), box() * 0.6, 0, 6.283); ctx.fill();
      }

      // particles + labels
      if (nodeFade > 0.02) {
        for (let i = 0; i < N; i++) {
          const p = particles[i], pp = pos[i];
          const ap = seg(e, 80 + p.delay, 900 + p.delay) * nodeFade;
          if (ap <= 0) continue;
          ctx.save();
          ctx.globalAlpha = ap;
          ctx.shadowColor = 'rgba(190,215,255,0.9)';
          ctx.shadowBlur = p.label ? 12 : 6;
          ctx.fillStyle = p.label ? '#f4f8ff' : '#d8e6fb';
          ctx.beginPath(); ctx.arc(pp.x, pp.y, p.r, 0, 6.283); ctx.fill();
          ctx.restore();
          if (p.label && labelFade > 0.04) {
            ctx.save();
            ctx.globalAlpha = ap * labelFade;
            ctx.fillStyle = 'rgba(170,200,250,0.9)';
            ctx.font = `500 ${Math.round(H * 0.014)}px ui-monospace, monospace`;
            ctx.textBaseline = 'middle';
            ctx.fillText(p.label, pp.x + 9, pp.y);
            ctx.restore();
          }
        }
      }

      // crisp logo resolves in
      if (reveal > 0) drawLogo(reveal);

      raf = requestAnimationFrame(draw);
    }

    // ── load logo, then run ─────────────────────────────────────────────────
    const img = new Image();
    img.onload = () => {
      logo = img;
      sampleLogo(img);
      assignTargets();
      if (reduced) drawLogo(1);
    };
    img.src = LOGO_SRC;

    if (reduced) {
      resize();
      const onResize = () => { resize(); drawLogo(1); };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
