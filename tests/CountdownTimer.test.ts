import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getTimeDifference } from '../app/components/CountdownTimer';

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
