import { describe, it, expect } from 'vitest';
import {
  scoreLead,
  scopeOptionsFor,
  labelFor,
  buildLeadSummary,
  FUNNEL_STEPS,
  SERVICE_OPTIONS,
  SCOPE_OPTIONS,
  type FunnelAnswers,
} from '@/lib/funnel';

describe('lead scoring', () => {
  it('ranks strong budget + urgency as hot', () => {
    const answers: FunnelAnswers = { budget: '15k-plus', timeline: 'now' };
    const { score, priority } = scoreLead(answers);
    expect(score).toBe(6);
    expect(priority).toBe('hot');
  });

  it('ranks mid budget or urgency as warm', () => {
    const answers: FunnelAnswers = { budget: '5-15k', timeline: 'soon' };
    expect(scoreLead(answers).priority).toBe('warm');
  });

  it('ranks low budget + exploring as cold', () => {
    const answers: FunnelAnswers = { budget: 'under-1k', timeline: 'exploring' };
    const { score, priority } = scoreLead(answers);
    expect(score).toBe(0);
    expect(priority).toBe('cold');
  });

  it('handles missing answers without throwing', () => {
    expect(scoreLead({}).priority).toBe('cold');
  });
});

describe('scope options', () => {
  it('returns service-specific options for every service', () => {
    for (const service of SERVICE_OPTIONS) {
      const opts = scopeOptionsFor(service.id);
      expect(opts.length).toBeGreaterThan(0);
      expect(opts).toEqual(SCOPE_OPTIONS[service.id]);
    }
  });

  it('returns empty for unknown / missing service', () => {
    expect(scopeOptionsFor(undefined)).toEqual([]);
    expect(scopeOptionsFor('nope')).toEqual([]);
  });
});

describe('labelFor', () => {
  it('resolves ids from every pool', () => {
    expect(labelFor('content')).toBe('Content Creation');
    expect(labelFor('15k-plus')).toBe('$15k+');
    expect(labelFor('now')).toBe('Right now');
  });

  it('falls back to the id when unknown', () => {
    expect(labelFor('xyz')).toBe('xyz');
  });
});

describe('funnel definition', () => {
  it('has a stable 5-step shape ending in details', () => {
    expect(FUNNEL_STEPS).toHaveLength(5);
    expect(FUNNEL_STEPS[FUNNEL_STEPS.length - 1].kind).toBe('details');
  });
});

describe('buildLeadSummary', () => {
  it('includes priority and all chosen answers', () => {
    const answers: FunnelAnswers = {
      service: 'ai',
      scope: ['agent', 'automation'],
      timeline: 'now',
      budget: '15k-plus',
    };
    const summary = buildLeadSummary(answers, {
      name: 'Jane Doe',
      email: 'jane@acme.com',
      company: 'Acme',
      message: 'Need an agent',
    });
    expect(summary).toContain('High priority');
    expect(summary).toContain('AI Implementation');
    expect(summary).toContain('AI agent / assistant');
    expect(summary).toContain('jane@acme.com');
  });
});
