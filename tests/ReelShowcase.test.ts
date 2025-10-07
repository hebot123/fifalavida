import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReelShowcase from '../app/components/ReelShowcase';
import { reels } from '../content/reels';

describe('ReelShowcase', () => {
  it('exposes curated reel metadata', () => {
    assert.ok(reels.length > 0, 'expected at least one reel');
    for (const reel of reels) {
      assert.ok(reel.title.length > 0, 'reel title should be present');
      assert.ok(reel.description.length > 0, 'reel description should be present');
      assert.match(reel.src, /^https?:\/\//, 'reel source should be an absolute URL');
      assert.match(reel.poster, /^https?:\/\//, 'reel poster should be an absolute URL');
    }
  });

  it('renders the accessible heading and play controls', () => {
    const markup = renderToStaticMarkup(React.createElement(ReelShowcase));

    assert.ok(markup.includes('Matchday Reels'));
    const playLabelMatches = markup.match(/Play<\/span>/g) ?? [];
    assert.equal(playLabelMatches.length, reels.length);
  });
});
