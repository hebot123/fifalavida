import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReelShowcase from '../app/components/ReelShowcase';
import { reels } from '../content/reels';

describe('ReelShowcase', () => {
  it('exposes at least one curated reel', () => {
    assert.ok(reels.length > 0, 'expected at least one reel in the curated list');
    for (const reel of reels) {
      assert.ok(reel.title.length > 0);
      assert.ok(reel.description.length > 0);
      assert.ok(reel.src.startsWith('http'));
      assert.ok(reel.poster.startsWith('http'));
    }
  });

  it('renders the showcase heading for assistive tech', () => {
    const markup = renderToStaticMarkup(React.createElement(ReelShowcase));
    assert.ok(markup.includes('id="reels-heading"'));
    assert.ok(/Reel/.test(markup));
  });
});
