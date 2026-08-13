# AI Agent Learning Hub Site Brief

SYNTHETIC_DATA_ONLY

このファイルは研修用の公開可能な概要だけを含み, 実在する顧客, 社員, 申込情報, 認証情報を含まない。製品説明および料金区分・クォータ制限は2026年8月9日時点の公式ドキュメント情報を要約であり, 機能, 提供面, 料金は変更される可能性がある。

## サイト目的

非エンジニアと開発者が, Codex, Claude Code, Claude Cowork, Kiro, Antigravity, Devin, Cursor Agent, Windsurf (Cascade), GitHub Copilot Workspace の計9製品の違い, 公式料金プラン（Max/Pro+/Ultra等）, 具体的クォータ制限, 公式リンク, 公式動画デモを読み比べ, 「AIエージェントは仕事の目的とコスト・制限構造に応じて選び, 指示, Skill, MCP, 人の確認を組み合わせて使う」と理解できる1ページWebサイトを作る。

さらに, Visual Feedback (画面直接コメント指示) シミュレーター, Nano Banana (Google Antigravityマルチモデル画像アセット生成機能) シミュレーター, AIエージェント診断シミュレーター, 公式動画デモシアター, テーマ切り替え機能を搭載し, 体験型の学習と意思決定支援を提供する。

## 表示内容

- サイト名: AI Agent Learning Hub
- 見出し: 仕事・コスト・制限に合わせて, 最適AIエージェントを選ぶ。
- 特集機能: 💬 Visual Feedback (画面コメント指示) & 🍌 Nano Banana AIアセット & 🎥 公式動画シアター & 🎯 AI診断 & ⚡ ネオン/ダーク テーマ切替
- 説明: 開発とナレッジワークの主要9製品を, 用途・主な機能・全公式料金プラン・具体的クォータ制限・公式リンク・公式動画デモから読み比べる研修用サンプル。
- 注記: 2026年8月9日時点の公式情報を要約 / 選択内容は送信・保存されません / 各料金・クォータは公式ドキュメントへリンク

## 主要製品 (9製品網羅)

| 製品 | タグ | 向いている仕事 | 主な機能 | 公式ドキュメント＆動画リンク | 全料金プラン & 具体的クォータ制限 (2026) |
| --- | --- | --- | --- | --- | --- |
| Codex | 開発、計画・自動化 | コードベース理解、実装、修正、テスト、レビュー | AGENTS.md、Skills、Plugins、MCP、sandbox | https://developers.openai.com/codex | Free (1日10回制限) / Pro ($20/月: 1日200回制限) / Enterprise (カスタム) |
| Claude Code | 開発、計画・自動化 | 複数ファイルの開発、Git操作、反復作業の自動化 | CLAUDE.md、Skills、Hooks、MCP、subagents | https://code.claude.com/docs | Pro ($20/月: 5hあたり45〜450通) / Max ($100/月: 5倍クォータ) / API Tokens |
| Claude Cowork | ナレッジワーク、計画・自動化 | 調査、資料作成、表計算、ファイル整理、定期レポート | Projects、Skills、Connectors、scheduled tasks | https://www.anthropic.com/claude | Team ($30/人/月: Proの2倍クォータ) / Enterprise (カスタムSSO) |
| Kiro | 開発、計画・自動化 | 要件・設計・タスクを明確にして進める仕様駆動開発 | Specs、Steering、Hooks、Agent Skills、Powers | https://kiro.dev/docs | Free (月500 PU) / Pro ($20/月: 月3,000 PU) / Power Units 従量 |
| Antigravity | 開発、計画・自動化 | 計画、実装、ブラウザ検証をArtifactで確認するWeb開発 | Artifacts、Planning、Browser、Rules、Skills、MCP、Visual Feedback、Nano Banana | https://antigravity.google/ | Free (1日100回) / Pro ($20/月: 1日1,000回) / Ultra ($200/月: 1日1万回・優先) |
| Devin | 開発、計画・自動化 | 自律的なソフトウェア開発、バグ修正、Issue自動化 | ACU (Compute Units)、Devin Desktop、Shell | https://cognition.ai/pricing | Free (月15 ACU) / Pro ($20/月: 月250 ACU) / Max ($200/月: 月3,000 ACU) / Teams ($80+$40/席) |
| Cursor Agent | 開発、計画・自動化 | IDE統合型のマルチファイル自動生成、高速コード補完 | Composer、Fast Completion、.cursorrules | https://cursor.com/pricing | Hobby (Free: 50回Fast/月) / Pro ($20/月: 500回Fast) / Pro+ ($60/月: 2千回Fast) / Ultra ($200/月: 8千回Fast) |
| Windsurf | 開発、計画・自動化 | Cascadeフローによる超高速マルチファイルリファクタリング | Cascade Flow、Supercomplete、.windsurfrules | https://codeium.com/windsurf | Free (月50回Cascade) / Pro ($15/月: 月500回) / Pro+ ($45/月: 月2千回) / Teams ($30/席) |
| Copilot Workspace | 開発、計画・自動化 | GitHub Issueからの仕様策定、タスク分解、自動PR起草 | Issue-to-PR Flow、Task Plan Specs、Extensions | https://github.com/features/copilot | Individual ($10/月: 月300回Agent) / Business ($19/席) / Enterprise ($39/席) |

## 用語・データ境界

- 全9製品 (Codex, Claude Code, Claude Cowork, Kiro, Antigravity, Devin, Cursor Agent, Windsurf, Copilot Workspace) の名称横に `assets/icons/` から公式ブランドアイコンを表示する。
- 全製品の料金・クォータ情報欄および公式動画シアターには, `target="_blank"` で公式リンクを設置する。
- 画像は `assets/agent-workflow-hero.png` をヒーロー画像として使用する。

## TDD ＆ テスト仕様書作成手順 (Test Specification & TDD Workflow)

本サイト構築および研修デモでは、AIエージェントの出力品質を担保しハルシネーションを防ぐため、**サイト実装前にテスト仕様書を先行作成する TDD（テスト駆動開発）アプローチ**を標準手順として採用する。

### 1. 開発フロー (Red -> Green -> Refactor)
1. **[仕様定義] テスト仕様書の先行作成 (`TEST_SPECIFICATION.md`)**:
   - サイト作成前に「機能要件」「正常系」「異常系」「入力境界値」「UI/アクセシビリティ要件」を網羅したテスト仕様書を作成する。
2. **[Red] 自動テストコードの記述 (`test/site.spec.js`)**:
   - テスト仕様書に基づき、Playwright / Vitest による自動テストコードを先行生成・記述する。未実装のため実行時は失敗 (Red 🔴) となる。
3. **[Green] AIエージェントによるサイト実装 (`index.html`, `app.js`, `styles.css`)**:
   - AIエージェントに「テストコードを全件パスする最小限のWebサイトを作成せよ」と指示し、テストを全件合格 (Green 🟢) させる。
4. **[Refactor] デザイン調整・シミュレーター拡張**:
   - 自動テストが常にグリーンであることを担保したまま、Visual Feedback シミュレーターやテーマ切り替えなどの視覚的デザイン・演出をブラッシュアップする。

### 2. 本サイトのテスト仕様書テンプレート (抜粋)

| テストID | 対象機能 | テスト手順・入力条件 | 期待される結果 (合格基準) |
| :--- | :--- | :--- | :--- |
| **TC-01** | 9製品比較テーブル | ページ初期読み込み | Codex, Claude Code, Antigravity 等の全9製品の料金・クォータ情報が表示されること |
| **TC-02** | AIエージェント診断 | 仕事内容「開発」・予算を選択し診断ボタン押下 | 条件に合致する最適なエージェントカードが推奨表示されること |
| **TC-03** | テーマ切替機能 | 画面上のテーマ切替ボタンを押下 | ネオンテーマ/ダークテーマが即座に切り替わりスタイリングが適用されること |
| **TC-04** | Visual Feedback シミュレーター | 画面エレメント選択＆フィードバック送信 | コメントがキャンバス上にピン留めされ、指示プロンプトが生成されること |

