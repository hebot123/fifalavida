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
  it('renders an accessible live countdown placeholder during SSR', () => {
    const markup = renderToStaticMarkup(React.createElement(CountdownTimer));

    assert.ok(markup.includes('Countdown to Kickoff'));
    assert.ok(markup.includes('role="status"'));
    assert.ok(markup.includes('Loading live countdown'));
    assert.ok(markup.includes('until FIFA World Cup 2026'));
  });
});
