'use client';

import { useState } from 'react';
import styles from './AIAgentsDirectory.module.css';

interface Tool {
  name: string;
  domain: string;
  featured?: boolean;
}

interface Category {
  id: number;
  name: string;
  color: string;
  tools: Tool[];
}

const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'ASSISTANTS',
    color: '#f2d4d7',
    tools: [
      { name: 'Synthflow', domain: 'synthflow.ai' },
      { name: 'Devin', domain: 'cognition.ai', featured: true },
      { name: 'Crewai', domain: 'crewai.com' },
      { name: 'Operator', domain: 'openai.com' },
      { name: 'Jotform AI Agents', domain: 'jotform.com' },
      { name: 'Athena', domain: 'athenadecision.com' },
      { name: 'Adept', domain: 'adept.ai' },
      { name: 'Nelima AI', domain: 'nelima.ai' },
      { name: 'Harvey', domain: 'harvey.ai', featured: true },
      { name: 'Salesforce Agentforce', domain: 'salesforce.com', featured: true },
      { name: 'Mesha', domain: 'meshahq.com' },
      { name: 'Cal AI', domain: 'cal.com' },
      { name: 'Cust', domain: 'cust.ai' },
      { name: 'Duckie', domain: 'duckie.ai' },
      { name: 'Spell', domain: 'spell.so' },
    ],
  },
  {
    id: 2,
    name: 'ANALYTICS & DATA',
    color: '#c084fc',
    tools: [
      { name: 'Invicta', domain: 'invicta.ai', featured: true },
      { name: 'Duckie', domain: 'duckie.ai', featured: true },
      { name: 'Athena', domain: 'athenadecision.com', featured: true },
      { name: 'Synthflow', domain: 'synthflow.ai' },
      { name: 'Evolv AI', domain: 'evolvai.com' },
      { name: 'Adept', domain: 'adept.ai' },
      { name: 'Interviewer AI', domain: 'interviewer.ai' },
      { name: 'Avanz', domain: 'avanz.ai' },
    ],
  },
  {
    id: 3,
    name: 'CODING & DEV',
    color: '#86efac',
    tools: [
      { name: 'Cursor', domain: 'cursor.sh', featured: true },
      { name: 'Fix AI', domain: 'fixai.io' },
      { name: 'Replit', domain: 'replit.com', featured: true },
      { name: 'Devin', domain: 'cognition.ai', featured: true },
      { name: 'Agent X', domain: 'agentx.so' },
      { name: 'Coval', domain: 'coval.dev' },
      { name: 'Evolv AI', domain: 'evolvai.com' },
    ],
  },
  {
    id: 4,
    name: 'CUSTOMER SERVICE',
    color: '#f97316',
    tools: [
      { name: 'Synthflow', domain: 'synthflow.ai', featured: true },
      { name: 'Decagon', domain: 'decagon.ai', featured: true },
      { name: 'Cust', domain: 'cust.ai' },
      { name: 'Salesforce Agentforce', domain: 'salesforce.com' },
      { name: 'Jotform AI Agents', domain: 'jotform.com' },
      { name: 'Crewai', domain: 'crewai.com' },
      { name: 'Bland AI', domain: 'bland.ai', featured: true },
      { name: 'Duckie', domain: 'duckie.ai' },
      { name: 'Leaping AI', domain: 'leaping.ai' },
      { name: 'Beam AI', domain: 'beam.ai' },
      { name: 'Chaindesk', domain: 'chaindesk.ai' },
      { name: 'D-ID', domain: 'd-id.com' },
      { name: 'Invicta', domain: 'invicta.ai' },
      { name: 'Adept', domain: 'adept.ai' },
      { name: 'Cal AI', domain: 'cal.com' },
    ],
  },
  {
    id: 5,
    name: 'CONTENT',
    color: '#3b82f6',
    tools: [
      { name: 'Spell', domain: 'spell.so', featured: true },
      { name: 'HeyGen', domain: 'heygen.com', featured: true },
      { name: 'SuperAGI', domain: 'superagi.com', featured: true },
    ],
  },
  {
    id: 6,
    name: 'BONUS AI AGENTS',
    color: '#a78bfa',
    tools: [
      { name: 'Payments AI', domain: 'cal.com', featured: true },
      { name: 'Rulebase', domain: 'rulebase.app', featured: true },
      { name: 'Cykel', domain: 'cykel.ai' },
    ],
  },
  {
    id: 7,
    name: 'COMING SOON',
    color: '#6b7280',
    tools: [],
  },
];

function ToolLogo({ tool, color }: { tool: Tool; color: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={styles.logoFallback}
        style={{ background: color + '22', borderColor: color + '55', color }}
        aria-hidden="true"
      >
        {tool.name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://logo.clearbit.com/${tool.domain}`}
      alt=""
      className={styles.logo}
      width={28}
      height={28}
      onError={() => setFailed(true)}
    />
  );
}

export function AIAgentsDirectory() {
  const [activeTab, setActiveTab] = useState(0);
  const current = CATEGORIES[activeTab];

  const goNext = () => setActiveTab((p) => (p + 1) % CATEGORIES.length);
  const goPrev = () => setActiveTab((p) => (p - 1 + CATEGORIES.length) % CATEGORIES.length);

  return (
    <div id="directory" className={styles.root}>
      {/* Section heading */}
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>The Directory</h2>
        <span className={styles.dirBadge}>7 categories</span>
      </div>

      {/* Tab Bar */}
      <div className={styles.tabBar} role="tablist" aria-label="Agent categories">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={activeTab === i}
            aria-controls={`cat-panel-${cat.id}`}
            className={`${styles.tab} ${activeTab === i ? styles.tabActive : ''}`}
            style={
              activeTab === i
                ? ({ '--tab-color': cat.color } as React.CSSProperties)
                : undefined
            }
            onClick={() => setActiveTab(i)}
            title={cat.name}
          >
            {cat.id}
          </button>
        ))}
      </div>

      {/* Category Panel */}
      <div
        id={`cat-panel-${current.id}`}
        role="tabpanel"
        className={styles.panel}
        style={{ '--panel-color': current.color } as React.CSSProperties}
      >
        {/* Panel Header */}
        <div className={styles.panelHeader}>
          <h2 className={styles.catName} style={{ color: current.color }}>
            {current.name}
          </h2>
          <div className={styles.panelActions}>
            {current.tools.length > 0 && (
              <span className={styles.toolCount}>{current.tools.length} tools</span>
            )}
            <button
              className={styles.navBtn}
              onClick={goPrev}
              aria-label="Previous category"
            >
              ←
            </button>
            <button
              className={styles.navBtn}
              onClick={goNext}
              aria-label="Next category"
            >
              →
            </button>
          </div>
        </div>

        {/* Tool Grid or Empty State */}
        {current.tools.length === 0 ? (
          <div className={styles.empty}>
            <span>More categories coming soon</span>
          </div>
        ) : (
          <div className={styles.toolGrid}>
            {current.tools.map((tool) => (
              <div
                key={`${tool.name}-${tool.domain}`}
                className={`${styles.toolCard} ${tool.featured ? styles.featured : ''}`}
                style={
                  tool.featured
                    ? ({ '--feat-color': current.color } as React.CSSProperties)
                    : undefined
                }
              >
                <div className={styles.logoWrap}>
                  <ToolLogo tool={tool} color={current.color} />
                </div>
                <span className={styles.toolName}>{tool.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
