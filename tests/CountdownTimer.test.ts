import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import CountdownTimer, { getTimeDifference } from '../app/components/CountdownTimer';

const kickoff = new Date('2026-06-11T00:00:00-06:00');

describe('getTimeDifference', () => {
  it('calculates positive durations when target is in the future', () => {
    const snapshot = new Date('2026-06-10T00:00:00-06:00');
    const result = getTimeDifference(kickoff, snapshot);

    assert.equal(result.isPast, false);
    assert.equal(result.days, 1);
    assert.equal(result.hours, 0);
  });

  it('indicates the event has passed when the target is in the past', () => {
    const snapshot = new Date('2026-06-12T00:00:00-06:00');
    const result = getTimeDifference(kickoff, snapshot);

    assert.equal(result.isPast, true);
    assert.equal(result.total, 0);
  });
});

describe('CountdownTimer component', () => {
  it('renders accessible countdown content before kickoff', () => {
    const originalDate = globalThis.Date;

    class FixedDate extends originalDate {
      constructor(...args: unknown[]) {
        if (args.length === 0) {
          super('2026-06-10T12:00:00-06:00');
          return;
        }
        super(...(args as ConstructorParameters<typeof originalDate>));
      }

      static now(): number {
        return new originalDate('2026-06-10T12:00:00-06:00').getTime();
      }
    }

    // @ts-expect-error overriding for deterministic render
    globalThis.Date = FixedDate;

    try {
      const markup = renderToStaticMarkup(React.createElement(CountdownTimer));
      assert.ok(markup.includes('Countdown to Kickoff'));
      assert.ok(markup.includes('role="timer"'));
      assert.ok(markup.includes('until FIFA World Cup 2026'));
    } finally {
      globalThis.Date = originalDate;
    }
  });

  it('announces kickoff once the event is in the past', () => {
    const originalDate = globalThis.Date;

    class FixedDate extends originalDate {
      constructor(...args: unknown[]) {
        if (args.length === 0) {
          super('2026-06-12T00:00:00-06:00');
          return;
        }
        super(...(args as ConstructorParameters<typeof originalDate>));
      }

      static now(): number {
        return new originalDate('2026-06-12T00:00:00-06:00').getTime();
      }
    }

    // @ts-expect-error overriding for deterministic render
    globalThis.Date = FixedDate;

    try {
      const markup = renderToStaticMarkup(React.createElement(CountdownTimer));
      assert.ok(markup.includes('has kicked off'));
      assert.ok(markup.includes('role="status"'));
    } finally {
      globalThis.Date = originalDate;
    }
  });
});
