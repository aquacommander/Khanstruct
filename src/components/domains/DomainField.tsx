'use client';

/* ════════════════════════════════════════════════════════════════════════
   DOMAIN FIELD — the signature artwork behind each panel.

   Pure SVG, laid out from a SEEDED generator so the server and client agree
   (Math.random here would be a hydration mismatch). Nothing animates in JS:
   the panel's --p / --vis scrub variables drive every transform from CSS, so
   these stay on the compositor.
   ──────────────────────────────────────────────────────────────────────── */

import { useMemo } from 'react';
import type { Domain } from '@/lib/domains';
import styles from './DomainField.module.css';

/** mulberry32 — tiny deterministic PRNG so the artwork is stable across renders. */
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SIZE = 600;

/* Round every generated coordinate. The PRNG is deterministic, but Node and the
   browser can serialise the same float to different digit counts, which React
   reports as a hydration mismatch. Fixed precision makes both emit one string. */
const px = (n: number) => Math.round(n * 100) / 100;

function neural(rand: () => number) {
  const nodes = Array.from({ length: 26 }, () => {
    const a = rand() * Math.PI * 2;
    const r = 60 + rand() * 230;
    return {
      x: px(300 + Math.cos(a) * r),
      y: px(300 + Math.sin(a) * r * 0.82),
      r: px(1.5 + rand() * 3.5),
    };
  });
  const links: [number, number][] = [];
  nodes.forEach((n, i) => {
    const near = nodes
      .map((m, j) => ({ j, d: Math.hypot(m.x - n.x, m.y - n.y) }))
      .filter((m) => m.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    near.forEach((m) => links.push([i, m.j]));
  });
  return { nodes, links };
}

export function DomainField({ domain }: { domain: Domain }) {
  const art = useMemo(() => {
    const rand = seeded(domain.label.length * 9973 + domain.index.charCodeAt(1));
    if (domain.field === 'neural') return { kind: 'neural' as const, ...neural(rand) };
    if (domain.field === 'agents') {
      const rings = [110, 175, 240, 300];
      const nodes = rings.flatMap((r, ri) => {
        const count = 5 + ri * 2;
        return Array.from({ length: count }, (_, i) => {
          const t = (i / count) * Math.PI * 2 + ri * 0.4;
          return {
            x: px(300 + Math.cos(t) * r),
            y: px(300 + Math.sin(t) * r),
            r: px(2 + rand() * 2.5),
            ri,
          };
        });
      });
      return { kind: 'agents' as const, rings, nodes };
    }
    const arcs = Array.from({ length: 5 }, (_, i) => ({
      rx: 140 + i * 52,
      ry: 52 + i * 20,
      rot: -22 + i * 9,
      o: px(0.5 - i * 0.07),
    }));
    return { kind: 'orbital' as const, arcs };
  }, [domain]);

  return (
    <svg
      className={styles.field}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`glow-${domain.index}`}>
          <stop offset="0%" stopColor={domain.color} stopOpacity="0.32" />
          <stop offset="70%" stopColor={domain.color} stopOpacity="0.04" />
          <stop offset="100%" stopColor={domain.color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="300" cy="300" r="290" fill={`url(#glow-${domain.index})`} className={styles.halo} />

      {art.kind === 'neural' && (
        <g>
          <g className={styles.web} stroke={domain.color}>
            {art.links.map(([a, b], i) => (
              <line
                key={i}
                x1={art.nodes[a]!.x}
                y1={art.nodes[a]!.y}
                x2={art.nodes[b]!.x}
                y2={art.nodes[b]!.y}
              />
            ))}
          </g>
          <g fill={domain.color}>
            {art.nodes.map((n, i) => (
              <circle
                key={i}
                cx={n.x}
                cy={n.y}
                r={n.r}
                className={styles.node}
                style={{ '--i': i } as React.CSSProperties}
              />
            ))}
          </g>
        </g>
      )}

      {art.kind === 'agents' && (
        <g>
          <g className={styles.rings} stroke={domain.color} fill="none">
            {art.rings.map((r, i) => (
              <circle key={i} cx="300" cy="300" r={r} style={{ '--i': i } as React.CSSProperties} />
            ))}
          </g>
          <g fill={domain.color}>
            {art.nodes.map((n, i) => (
              <circle
                key={i}
                cx={n.x}
                cy={n.y}
                r={n.r}
                className={styles.node}
                style={{ '--i': i } as React.CSSProperties}
              />
            ))}
          </g>
        </g>
      )}

      {art.kind === 'orbital' && (
        <g className={styles.orbits} stroke={domain.color} fill="none">
          {art.arcs.map((a, i) => (
            <ellipse
              key={i}
              cx="300"
              cy="300"
              rx={a.rx}
              ry={a.ry}
              opacity={a.o}
              transform={`rotate(${a.rot} 300 300)`}
              style={{ '--i': i } as React.CSSProperties}
            />
          ))}
          <circle cx="300" cy="300" r="46" fill={domain.color} opacity="0.13" />
          <circle cx="300" cy="300" r="46" stroke={domain.color} opacity="0.5" />
        </g>
      )}
    </svg>
  );
}
