import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';

describe('AI Agent Learning Hub E2E / DOM Test Suite (Based on TEST_SPECIFICATION.md)', () => {
  let dom;
  let document;
  let window;

  function loadApp() {
    const htmlPath = path.resolve(process.cwd(), 'index.html');
    const appJsPath = path.resolve(process.cwd(), 'app.js');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const appJsContent = fs.readFileSync(appJsPath, 'utf8');

    const virtualConsole = new VirtualConsole();
    virtualConsole.on('jsdomError', () => {}); // 外部リソース未取得警告ログの出力を抑制

    dom = new JSDOM(htmlContent, {
      runScripts: 'dangerously',
      virtualConsole,
      url: 'http://localhost/'
    });

    window = dom.window;
    document = window.document;

    // Inject app.js into DOM and trigger DOMContentLoaded
    const scriptEl = document.createElement('script');
    scriptEl.textContent = appJsContent;
    document.body.appendChild(scriptEl);

    const event = new window.Event('DOMContentLoaded', {
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  }

  test.beforeEach(() => {
    loadApp();
  });

  describe('カテゴリ 1: 初期表示・レイアウト (Layout & Initial Render)', () => {
    test('TS-01-01: ヘッダータイトルと研修バッジが正しいこと', () => {
      const title = document.querySelector('.site-logo');
      const badge = document.querySelector('.header-badge');

      assert.equal(title.textContent.trim(), 'AI Agent Learning Hub');
      assert.ok(badge.textContent.includes('研修用サンプル (2026年8月最新公式情報)'));
    });

    test('TS-01-02: ヒーロー領域のキャッチコピーとヒーロー画像が表示されること', () => {
      const heroTitle = document.querySelector('.hero-title');
      const heroImage = document.querySelector('.hero-image');

      assert.ok(heroTitle.textContent.includes('仕事の目的と制限構造に合わせて'));
      assert.ok(heroTitle.textContent.includes('最適AIエージェントを選ぶ。'));
      assert.equal(heroImage.getAttribute('src'), 'assets/agent-workflow-hero.png');
    });

    test('TS-01-03: 比較サマリーの初期状態が「0 / 2 選択中」であること', () => {
      const count = document.querySelector('#selection-count');
      const emptyText = document.querySelector('.comparison-empty');

      assert.equal(count.textContent.trim(), '0');
      assert.ok(emptyText.textContent.includes('製品カードの「比較に追加」ボタンを押すと'));
    });

    test('TS-01-04: フッターに著作権と最新情報注記が表示されていること', () => {
      const copy = document.querySelector('.footer-copy');
      const note = document.querySelector('.footer-note');

      assert.ok(copy.textContent.includes('2026 AI Agent Learning Hub'));
      assert.ok(note.textContent.includes('2026年8月9日時点'));
    });
  });

  describe('カテゴリ 2: 主要9製品カード表示 (Product Cards)', () => {
    test('TS-02-01: 全9主要製品のカードが存在すること', () => {
      const cards = [...document.querySelectorAll('.agent-card')];
      assert.equal(cards.length, 9);

      const expectedNames = [
        'Codex', 'Claude Code', 'Claude Cowork', 'Kiro',
        'Antigravity', 'Devin', 'Cursor Agent', 'Windsurf', 'Copilot Workspace'
      ];
      const actualNames = cards.map(c => c.dataset.agent);

      assert.deepEqual(actualNames, expectedNames);
    });

    test('TS-02-02: 各製品にブランドアイコンが設定されていること', () => {
      const cards = [...document.querySelectorAll('.agent-card')];
      cards.forEach(card => {
        const img = card.querySelector('.brand-icon');
        assert.ok(img, `Card ${card.dataset.agent} missing brand icon`);
        assert.ok(img.getAttribute('src').startsWith('assets/icons/'));
      });
    });

    test('TS-02-03: 公式ドキュメントリンクが target="_blank" であること', () => {
      const links = [...document.querySelectorAll('.doc-link-btn')];
      assert.equal(links.length, 9);

      links.forEach(link => {
        assert.equal(link.getAttribute('target'), '_blank');
        assert.equal(link.getAttribute('rel'), 'noopener noreferrer');
        assert.ok(link.getAttribute('href').startsWith('http'));
      });
    });

    test('TS-02-05: Antigravity カードに「ライブデモ使用ツール」のハイライトがあること', () => {
      const antigravityCard = document.querySelector('.agent-card[data-agent="Antigravity"]');
      assert.ok(antigravityCard.classList.contains('card-featured'));

      const badge = antigravityCard.querySelector('.featured-badge');
      assert.equal(badge.textContent.trim(), 'ライブデモ使用ツール');
    });
  });

  describe('カテゴリ 3: フィルタリング機能 (Filter Toolbar)', () => {
    test('TS-03-01: 初期状態は「すべて」がアクティブで 9件表示 であること', () => {
      const allBtn = document.querySelector('.filter-button[data-filter="all"]');
      const resultCount = document.querySelector('#result-count');

      assert.equal(allBtn.classList.contains('is-active'), true);
      assert.equal(allBtn.getAttribute('aria-pressed'), 'true');
      assert.equal(resultCount.textContent.trim(), '9件表示');
    });

    test('TS-03-02: 「開発」フィルター選択で 8件表示 となり、Claude Cowork が非表示になること', () => {
      const devBtn = document.querySelector('.filter-button[data-filter="dev"]');
      devBtn.click();

      const resultCount = document.querySelector('#result-count');
      assert.equal(resultCount.textContent.trim(), '8件表示');

      const claudeCowork = document.querySelector('.agent-card[data-agent="Claude Cowork"]');
      assert.equal(claudeCowork.hidden, true);

      const codex = document.querySelector('.agent-card[data-agent="Codex"]');
      assert.equal(codex.hidden, false);
    });

    test('TS-03-03: 「ナレッジワーク」フィルター選択で 1件表示 (Claude Cowork のみ) となること', () => {
      const knowledgeBtn = document.querySelector('.filter-button[data-filter="knowledge"]');
      knowledgeBtn.click();

      const resultCount = document.querySelector('#result-count');
      assert.equal(resultCount.textContent.trim(), '1件表示');

      const claudeCowork = document.querySelector('.agent-card[data-agent="Claude Cowork"]');
      assert.equal(claudeCowork.hidden, false);

      const antigravity = document.querySelector('.agent-card[data-agent="Antigravity"]');
      assert.equal(antigravity.hidden, true);
    });
  });

  describe('カテゴリ 4: 比較サマリー・選択ロジック (Comparison & Selection)', () => {
    test('TS-04-01: 製品選択で「追加済み」表記になり、サマリーエリアに追加されること', () => {
      const codexCard = document.querySelector('.agent-card[data-agent="Codex"]');
      const selectBtn = codexCard.querySelector('.select-button');

      selectBtn.click();

      assert.equal(selectBtn.getAttribute('aria-pressed'), 'true');
      assert.equal(selectBtn.querySelector('.btn-text').textContent.trim(), '追加済み');

      const count = document.querySelector('#selection-count');
      assert.equal(count.textContent.trim(), '1');

      const selectedItems = document.querySelectorAll('.selected-product-item');
      assert.equal(selectedItems.length, 1);
      assert.ok(selectedItems[0].querySelector('.selected-product-name').textContent.includes('Codex'));
    });

    test('TS-04-02: 2製品選択でバッジが「2 / 2 選択中」になり、2件並べて表示されること', () => {
      const codexBtn = document.querySelector('.agent-card[data-agent="Codex"] .select-button');
      const antigravityBtn = document.querySelector('.agent-card[data-agent="Antigravity"] .select-button');

      codexBtn.click();
      antigravityBtn.click();

      const count = document.querySelector('#selection-count');
      assert.equal(count.textContent.trim(), '2');

      const selectedItems = [...document.querySelectorAll('.selected-product-item')];
      assert.equal(selectedItems.length, 2);
    });

    test('TS-04-04: 3件以上選択を試みた場合、警報アラート (role="alert") が表示されること', () => {
      const codexBtn = document.querySelector('.agent-card[data-agent="Codex"] .select-button');
      const claudeBtn = document.querySelector('.agent-card[data-agent="Claude Code"] .select-button');
      const devinBtn = document.querySelector('.agent-card[data-agent="Devin"] .select-button');

      codexBtn.click();
      claudeBtn.click();
      devinBtn.click(); // 3件目

      const alert = document.querySelector('.selection-alert');
      assert.ok(alert, 'Alert element should be rendered');
      assert.equal(alert.getAttribute('role'), 'alert');
      assert.ok(alert.textContent.includes('比較できるのは2製品までです'));

      // 選択数は2のまま維持されること
      const count = document.querySelector('#selection-count');
      assert.equal(count.textContent.trim(), '2');
    });
  });

  describe('カテゴリ 5: アクセシビリティ (Accessibility)', () => {
    test('TS-05-02: フィルターバーおよび比較サマリーが aria-live と role 属性を備えていること', () => {
      const toolbar = document.querySelector('.filter-buttons');
      const resultCount = document.querySelector('#result-count');
      const selectionNames = document.querySelector('#selection-names');

      assert.equal(toolbar.getAttribute('role'), 'toolbar');
      assert.equal(resultCount.getAttribute('aria-live'), 'polite');
      assert.equal(selectionNames.getAttribute('aria-live'), 'polite');
    });
  });

  describe('カテゴリ 6: 公式アイコン取得 ＆ 公式一次情報根拠検証 (Official Icons & Primary Source Evidence)', () => {
    test('TS-06-01: 全製品に公式ブランドアイコン(SVG/img)が正しく設定・表示されること', () => {
      const cards = [...document.querySelectorAll('.agent-card')];
      cards.forEach(card => {
        const img = card.querySelector('.brand-icon');
        assert.ok(img, `Card ${card.dataset.agent} should have brand icon element`);
        const src = img.getAttribute('src');
        assert.ok(src && src.startsWith('assets/icons/'), `Src ${src} should be in assets/icons/`);
        assert.ok(src.endsWith('.svg'), `Src ${src} should be a valid SVG icon`);
      });

      // 2製品選択時の比較サマリー・マトリクスヘッダーにおけるアイコン表示チェック
      const codexBtn = document.querySelector('.agent-card[data-agent="Codex"] .select-button');
      const antigravityBtn = document.querySelector('.agent-card[data-agent="Antigravity"] .select-button');

      codexBtn.click();
      antigravityBtn.click();

      const selectedIcons = [...document.querySelectorAll('.selected-product-item .brand-icon-sm')];
      assert.equal(selectedIcons.length, 2, 'Selected product headers must contain 2 brand icons');

      selectedIcons.forEach(iconImg => {
        const src = iconImg.getAttribute('src');
        assert.ok(src && src.startsWith('assets/icons/'), `Selected icon src ${src} should point to assets/icons/`);
        assert.equal(iconImg.getAttribute('onerror'), "this.style.display='none'", 'Icon img should have onerror fallback handler');
      });
    });

    test('TS-06-02: すべての比較データに公式ドキュメント等の一次情報根拠(data-evidence)およびバージョン表記が存在すること', () => {
      const cards = [...document.querySelectorAll('.agent-card')];
      cards.forEach(card => {
        const agent = card.dataset.agent;
        const evidence = card.dataset.evidence;
        const version = card.dataset.version;

        assert.ok(evidence && evidence.startsWith('https://'), `Product ${agent} must have valid HTTPS primary evidence URL (actual: ${evidence})`);
        assert.ok(version && version.length > 0, `Product ${agent} must have non-empty version string (actual: ${version})`);

        // Claude Cowork は「公開版番号なし」と正しく明記されていることを確認 (数字の捏造禁止)
        if (agent === 'Claude Cowork') {
          assert.ok(version.includes('公開版番号なし'), 'Claude Cowork version must state 公開版番号なし');
        }
      });

      // 比較マトリクスの第10行「一次情報根拠 ＆ 出典」に公式直リンクがレンダリングされることのチェック
      const codexBtn = document.querySelector('.agent-card[data-agent="Codex"] .select-button');
      const antigravityBtn = document.querySelector('.agent-card[data-agent="Antigravity"] .select-button');

      codexBtn.click();
      antigravityBtn.click();

      const evidenceLinks = [...document.querySelectorAll('.comparison-matrix-table .update-detail-text a')];
      assert.equal(evidenceLinks.length, 2, 'Matrix row 10 must contain 2 primary evidence source links');

      evidenceLinks.forEach(link => {
        assert.equal(link.getAttribute('target'), '_blank');
        assert.equal(link.getAttribute('rel'), 'noopener noreferrer');
        assert.ok(link.getAttribute('href').startsWith('https://'));
      });
    });
  });
});
