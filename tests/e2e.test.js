import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';

const EXPECTED_PRODUCTS = [
  ['codex', 'Codex', '0.147.0'],
  ['claude-code', 'Claude Code', '2.1.229'],
  ['claude-cowork', 'Claude Cowork', '公開版番号なし（SaaS）'],
  ['kiro', 'Kiro', '1.0.293'],
  ['antigravity', 'Antigravity', '2.8.0']
];

function loadApp() {
  const html = fs.readFileSync(path.resolve('index.html'), 'utf8');
  const productData = fs.readFileSync(path.resolve('product-data.js'), 'utf8');
  const app = fs.readFileSync(path.resolve('app.js'), 'utf8');
  const virtualConsole = new VirtualConsole();
  const errors = [];
  virtualConsole.on('jsdomError', (error) => errors.push(error));

  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: 'http://localhost/',
    virtualConsole
  });

  for (const code of [productData, app]) {
    const script = dom.window.document.createElement('script');
    script.textContent = code;
    dom.window.document.body.appendChild(script);
  }

  return { dom, document: dom.window.document, errors };
}

describe('AI Agent Decision Guide DOM contract', () => {
  test('renders the verified five-product scope and exact versions', () => {
    const { dom, document, errors } = loadApp();
    const cards = [...document.querySelectorAll('.product-card')];

    assert.equal(document.title, 'AI Agent Decision Guide | 5製品の実務比較');
    assert.equal(cards.length, 5);
    assert.deepEqual(
      cards.map((card) => card.dataset.product),
      EXPECTED_PRODUCTS.map(([id]) => id)
    );

    EXPECTED_PRODUCTS.forEach(([id, name, version]) => {
      const card = document.querySelector(`[data-product="${id}"]`);
      assert.ok(card.textContent.includes(name));
      assert.ok(card.textContent.includes(version));
    });
    assert.equal(errors.length, 0);
    dom.window.close();
  });

  test('renders meaningful local official icons and forty evidence links', () => {
    const { dom, document } = loadApp();
    const icons = [...document.querySelectorAll('.product-icon')];
    const sourceLinks = [...document.querySelectorAll('.source-links a')];

    assert.equal(icons.length, 5);
    icons.forEach((icon) => {
      assert.match(icon.getAttribute('src'), /^assets\/product-icons\//);
      assert.ok(icon.getAttribute('alt').includes('公式アイコン'));
    });

    assert.equal(sourceLinks.length, 40);
    sourceLinks.forEach((link) => {
      assert.ok(link.href.startsWith('https://'));
      assert.ok(link.getAttribute('aria-label').includes('を開く'));
      assert.equal(link.getAttribute('rel'), 'noopener noreferrer');
    });
    dom.window.close();
  });

  test('filters from a work scenario and supports full-text search', () => {
    const { dom, document } = loadApp();
    document.querySelector('[data-scenario="knowledge"]').click();
    const visibleAfterScenario = [...document.querySelectorAll('.product-card')]
      .filter((card) => !card.hidden);

    assert.equal(visibleAfterScenario.length, 1);
    assert.equal(visibleAfterScenario[0].dataset.product, 'claude-cowork');

    document.querySelector('[data-scenario="all"]').click();
    const search = document.querySelector('#product-search');
    search.value = 'Visual Feedback';
    search.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    const visibleAfterSearch = [...document.querySelectorAll('.product-card')]
      .filter((card) => !card.hidden);

    assert.equal(visibleAfterSearch.length, 1);
    assert.equal(visibleAfterSearch[0].dataset.product, 'antigravity');
    dom.window.close();
  });

  test('renders thirteen comparison rows and refuses a third product', () => {
    const { dom, document } = loadApp();
    const buttons = [...document.querySelectorAll('.compare-button')];
    buttons[0].click();
    buttons[4].click();

    assert.equal(document.querySelector('#selection-count').textContent, '2');
    assert.equal(document.querySelectorAll('#comparison-body tr').length, 13);
    assert.equal(document.querySelector('#comparison-table-wrap').hidden, false);

    buttons[2].click();
    assert.equal(document.querySelector('#selection-count').textContent, '2');
    assert.ok(document.querySelector('#compare-status').textContent.includes('最大2製品'));
    dom.window.close();
  });

  test('exposes accessible pressed states, live regions, and a skip link', () => {
    const { dom, document } = loadApp();
    const scenario = document.querySelector('[data-scenario="all"]');
    const compare = document.querySelector('.compare-button');

    assert.equal(scenario.getAttribute('aria-pressed'), 'true');
    assert.equal(document.querySelector('#scenario-result').getAttribute('aria-live'), 'polite');
    assert.equal(document.querySelector('#compare-status').getAttribute('aria-live'), 'polite');
    assert.equal(document.querySelector('.skip-link').getAttribute('href'), '#products');

    compare.click();
    assert.equal(compare.getAttribute('aria-pressed'), 'true');
    dom.window.close();
  });

  test('does not render stale products or fabricated fixed quotas', () => {
    const { dom, document } = loadApp();
    const rendered = document.body.textContent;

    for (const forbidden of [
      'Devin', 'Cursor Agent', 'Windsurf', 'Copilot Workspace',
      '1日100回', '1日1,000回', '1日1万回', '月3,000 PU'
    ]) {
      assert.ok(!rendered.includes(forbidden), `${forbidden} must not be rendered`);
    }
    dom.window.close();
  });

  test('TS-08-01: OpenAI Academy等の学習サイトリンクおよび進捗トラッカーが正常動作すること', () => {
    const { dom, document } = loadApp();
    const trackerSection = document.querySelector('.academy-tracker-section');
    assert.ok(trackerSection, 'Academy tracker section should be present');

    const moduleCards = [...document.querySelectorAll('.module-card')];
    assert.equal(moduleCards.length, 8, 'There should be 8 learning module cards');

    const openAiLink = document.querySelector('.module-card[data-module-id="mod-1"] .module-link-btn');
    assert.ok(openAiLink, 'OpenAI Academy link should exist');
    assert.equal(openAiLink.getAttribute('href'), 'https://openai.com/academy/');

    const anthropicLink = document.querySelector('.module-card[data-module-id="mod-3"] .module-link-btn');
    assert.ok(anthropicLink, 'Anthropic Academy link should exist');
    assert.equal(anthropicLink.getAttribute('href'), 'https://www.anthropic.com/learn');

    const chk1 = document.querySelector('#chk-mod-1');
    const chk2 = document.querySelector('#chk-mod-2');
    const percentBadge = document.querySelector('#progress-percent-badge');
    const progressBarFill = document.querySelector('#progress-bar-fill');

    chk1.click();
    chk2.click();

    assert.equal(percentBadge.textContent, '25% 完了');
    assert.equal(progressBarFill.style.width, '25%');
    dom.window.close();
  });
});
