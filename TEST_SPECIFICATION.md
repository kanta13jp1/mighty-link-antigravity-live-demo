# AI Agent Learning Hub テスト仕様書 (Test Specification Document)

本ドキュメントは、**AI Agent Learning Hub** の品質・機能・表示・アクセシビリティを検証するための公式テスト仕様書です。テスト駆動開発（TDD）に基づき、実装およびテスト自動化の基準として運用します。

---

## 1. テスト概要

- **対象システム**: AI Agent Learning Hub (1ページWebアプリケーション)
- **準拠ドキュメント**: [SITE_BRIEF.md](file:///c:/Users/kanta/GitHub/mighty-link-antigravity-live-demo/SITE_BRIEF.md)
- **テスト自動化フレームワーク**: Playwright / Node.js
- **サポート推奨ブラウザ**: Chrome, Edge, Firefox, Safari (Desktop & Mobile)

---

## 2. 詳細テストケース一覧 (Test Cases Matrix)

### カテゴリ 1: 初期表示・レイアウト (Layout & Initial Render)

| テストID | テスト項目 | 操作・事前条件 | 期待される結果 (合格判定基準) | 重要度 |
| :--- | :--- | :--- | :--- | :---: |
| **TS-01-01** | ヘッダー表示確認 | ページ初期読み込み | タイトル「AI Agent Learning Hub」とバッジ「研修用サンプル (2026年8月最新公式情報)」が表示されていること | 高 |
| **TS-01-02** | ヒーロー領域表示 | ページ初期読み込み | キャッチコピー「仕事の目的と制限構造に合わせて最適AIエージェントを選ぶ。」および `assets/agent-workflow-hero.png` 画像が正常表示されること | 高 |
| **TS-01-03** | 比較サマリー初期状態 | ページ初期読み込み | 選択件数が「0 / 2 選択中」となり、「製品カードの『比較に追加』ボタンを押すと...」という案内テキストが表示されていること | 中 |
| **TS-01-04** | フッター表示 | ページ最下部へスクロール | 著作権表示および「2026年8月9日時点の各社公式ドキュメント情報に基づく概要です。」注記が表示されていること | 低 |

---

### カテゴリ 2: 主要9製品カード表示 (Product Cards)

| テストID | テスト項目 | 操作・事前条件 | 期待される結果 (合格判定基準) | 重要度 |
| :--- | :--- | :--- | :--- | :---: |
| **TS-02-01** | 全9製品カード網羅性 | ページ初期読み込み | Codex, Claude Code, Claude Cowork, Kiro, Antigravity, Devin, Cursor Agent, Windsurf, Copilot Workspace の9個のカードが存在すること | 最高 |
| **TS-02-02** | ブランドアイコン表示 | 全製品カード | 各製品カードのヘッダーに `assets/icons/` から対応するブランドアイコンが正常に表示されること | 中 |
| **TS-02-03** | 料金・制限情報の表示 | 各製品カード | 「向いている仕事」「主な機能」「料金プラン & クォータ制限 (2026)」が正しく記載されていること | 高 |
| **TS-02-04** | 公式リンク動作 | 公式ドキュメントボタン | 各カードのリンクボタンが `target="_blank"` 属性を持ち、正しい公式ドキュメントURLに遷移すること | 高 |
| **TS-02-05** | フィーチャード表示 | Antigravity カード | 「ライブデモ使用ツール」バッジがつき、視覚的にハイライト（特別なスタイル）されていること | 中 |

---

### カテゴリ 3: フィルタリング機能 (Filter Toolbar)

| テストID | テスト項目 | 操作・事前条件 | 期待される結果 (合格判定基準) | 重要度 |
| :--- | :--- | :--- | :--- | :---: |
| **TS-03-01** | 初期フィルター状態 | ページ初期読み込み | 「すべて」ボタンがアクティブ (`is-active`, `aria-pressed="true"`) で、件数表示が「9件表示」となっていること | 高 |
| **TS-03-02** | 「開発」フィルター | 「開発」ボタンをクリック | 8件表示に更新され、Claude Cowork (ナレッジワーク専用) のカードが非表示 (`hidden`) となること | 高 |
| **TS-03-03** | 「ナレッジワーク」フィルター | 「ナレッジワーク」ボタンをクリック | 「1件表示」になり、Claude Cowork のカードのみが表示され、他8件が非表示となること | 高 |
| **TS-03-04** | 「計画・自動化」フィルター | 「計画・自動化」ボタンをクリック | 「9件表示」となり、全9製品カードが表示されること | 高 |
| **TS-03-05** | フィルター状態復元 | 「すべて」ボタンをクリック | 再び「9件表示」に戻り、全カードが表示されること | 中 |

---

### カテゴリ 4: 比較サマリー・選択ロジック (Comparison & Selection)

| テストID | テスト項目 | 操作・事前条件 | 期待される結果 (合格判定基準) | 重要度 |
| :--- | :--- | :--- | :--- | :---: |
| **TS-04-01** | 製品カード選択 | Codex の「比較に追加」を押す | ボタン表示が「追加済み」に変更され、バッジが「1 / 2 選択中」となり、比較サマリーエリアに Codex の情報カードが挿入されること | 最高 |
| **TS-04-02** | 2製品選択 | さらに Antigravity の「比較に追加」を押す | バッジが「2 / 2 選択中」となり、サマリーエリアに Codex と Antigravity の2件が並べて表示されること | 最高 |
| **TS-04-03** | 選択解除 | 選択中の Codex の「追加済み」を押す | 選択が解除され、バッジが「1 / 2 選択中」に減少し、サマリーエリアから Codex が削除されること | 高 |
| **TS-04-04** | 3件選択上限アラート | 2件選択中に3件目 (Devin) の「比較に追加」を押す | 選択が追加されず、「比較できるのは2製品までです。1つ外してから追加してください。」のアラート警報 (`role="alert"`) が表示されること | 最高 |

---

### カテゴリ 5: アクセシビリティ・レスポンシブ (Accessibility & Responsiveness)

| テストID | テスト項目 | 操作・事前条件 | 期待される結果 (合格判定基準) | 重要度 |
| :--- | :--- | :--- | :--- | :---: |
| **TS-05-01** | キーボードナビゲーション | `Tab` キーでフォーカス移動 | 全ボタン・リンクへフォーカス枠が表示され、`Space` / `Enter` キーで動作すること | 高 |
| **TS-05-02** | ARIA属性 | フィルター・選択ボタン | `aria-pressed`, `aria-live="polite"`, `role="toolbar"` 等が正しく更新されること | 中 |
| **TS-05-03** | レスポンシブ表示 (375px) | モバイル画面幅 (iPhone SE等) | カードやボタンが崩れず縦一列に収まり、横スクロールが発生しないこと | 高 |

---

## 3. Playwright による自動テストコード例 (`test/site.spec.js`)

```javascript
import { test, expect } from '@playwright/test';

test.describe('AI Agent Learning Hub 自動テストスイート', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('TS-02-01: 主要9製品カードが正しく表示されること', async ({ page }) => {
    const cards = page.locator('.agent-card');
    await expect(cards).toHaveCount(9);
  });

  test('TS-03-03: ナレッジワークフィルターで Claude Cowork のみ表示されること', async ({ page }) => {
    await page.click('button[data-filter="knowledge"]');
    await expect(page.locator('#result-count')).toHaveText('1件表示');
    await expect(page.locator('.agent-card[data-agent="Claude Cowork"]')).toBeVisible();
    await expect(page.locator('.agent-card[data-agent="Codex"]')).toBeHidden();
  });

  test('TS-04-04: 3製品目の選択時に上限アラートが表示されること', async ({ page }) => {
    await page.click('.agent-card[data-agent="Codex"] .select-button');
    await page.click('.agent-card[data-agent="Claude Code"] .select-button');
    await page.click('.agent-card[data-agent="Antigravity"] .select-button');

    const alert = page.locator('.selection-alert');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('比較できるのは2製品までです');
  });
});
```
