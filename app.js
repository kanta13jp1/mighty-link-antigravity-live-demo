document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  const cards = [...document.querySelectorAll(".agent-card")];
  const selectButtons = [...document.querySelectorAll(".select-button")];
  const resultCount = document.querySelector("#result-count");
  const selectionCount = document.querySelector("#selection-count");
  const selectionNames = document.querySelector("#selection-names");

  const selectedAgents = new Set();

  function getCardData(card) {
    const infoGroups = [...card.querySelectorAll(".info-group")];
    let features = "";
    let firstStep = "";

    infoGroups.forEach(group => {
      const label = group.querySelector(".info-label")?.textContent.trim() || "";
      const text = group.querySelector(".info-text")?.textContent.trim() || "";
      if (label.includes("主な機能")) features = text;
      if (label.includes("最初に試すこと")) firstStep = text;
    });

    return {
      agent: card.dataset.agent,
      fit: card.dataset.fit || "",
      pricing: card.dataset.pricing || "",
      icon: card.dataset.icon || "",
      ui: card.dataset.ui || "Web / CLI / IDE",
      config: card.dataset.config || "設定ファイル / Prompt",
      security: card.dataset.security || "標準セキュリティ",
      pros: card.dataset.pros || "高いタスク実行性能",
      cons: card.dataset.cons || "使用クォータ枠の管理が必要",
      bestTeam: card.dataset.bestTeam || "各種開発・企画チーム",
      features,
      firstStep
    };
  }

  function updateFilter(filter) {
    let visible = 0;

    cards.forEach((card) => {
      const tags = (card.dataset.tags || "").split(" ");
      const matches = filter === "all" || tags.includes(filter);
      card.hidden = !matches;
      if (matches) visible += 1;
    });

    filterButtons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (resultCount) {
      resultCount.textContent = `${visible}件表示`;
    }
  }

  function generateDeepGeminiReport(itemA, itemB) {
    const nameA = itemA.agent;
    const nameB = itemB.agent;

    let architectureDiff = "";
    let costComparison = "";
    let decisionGuide = "";

    if ((nameA === "Claude Code" && nameB === "Antigravity") || (nameB === "Claude Code" && nameA === "Antigravity")) {
      architectureDiff = `
        <strong>Claude Code</strong> はターミナルCLIから複数ファイル編集やGit操作を自律実行するコマンド指向エージェントです。<br>
        一方、<strong>Antigravity</strong> は Artifacts 計画とリアルタイムブラウザ検証サブエージェントを備えた視覚主導型開発環境です。
      `;
      costComparison = `
        <strong>コスト・制限構造</strong>: Claude Code は Pro ($20/月: 5hあたり45〜450通) / Max ($100/月) のメッセージ枠制。Antigravity は Pro ($20/月: 1日1,000回) / Ultra ($200/月) の回数枠制です。
      `;
      decisionGuide = `
        🎯 <strong>使い分けの結論</strong>:<br>
        - 既存のターミナル作業やリファクタリング、Git自動化を最重視 → <strong>Claude Code</strong><br>
        - 画面UIの完成度をブラウザで自動検証しながら視覚的にWeb開発を進めたい → <strong>Antigravity</strong>
      `;
    } else if ((nameA === "Claude Code" && nameB === "Claude Cowork") || (nameB === "Claude Code" && nameA === "Claude Cowork")) {
      architectureDiff = `
        <strong>Claude Code</strong> は開発者のコードベース・Terminal環境に直結するCLIツールです。<br>
        <strong>Claude Cowork</strong> はナレッジワーカー向けにプロジェクト、資料作成、レポート自動化を提供するクラウド協働空間です。
      `;
      costComparison = `
        <strong>コスト・制限構造</strong>: 開発チームは Pro ($20) / Max ($100)、ナレッジワーク共有組織は Team ($30/席/月) での導入が最適です。
      `;
      decisionGuide = `
        🎯 <strong>使い分けの結論</strong>:<br>
        - エンジニアのコード修正・コミット自動化 → <strong>Claude Code</strong><br>
        - PM・企画・営業チームの資料作成・リサーチ → <strong>Claude Cowork</strong>
      `;
    } else {
      architectureDiff = `
        <strong>${nameA}</strong> (${itemA.ui}) は 「${itemA.pros}」 を強みとし、<br>
        <strong>${nameB}</strong> (${itemB.ui}) は 「${itemB.pros}」 に特化しています。
      `;
      costComparison = `
        <strong>クォータ対比</strong>:<br>
        - ${nameA}: ${itemA.pricing}<br>
        - ${nameB}: ${itemB.pricing}
      `;
      decisionGuide = `
        🎯 <strong>使い分けの結論</strong>:<br>
        - <strong>${itemA.bestTeam}</strong> には <strong>${nameA}</strong> が最適です。<br>
        - <strong>${itemB.bestTeam}</strong> には <strong>${nameB}</strong> の導入を推奨します。
      `;
    }

    return `
      <div class="gemini-deep-report">
        <div class="gemini-deep-header">
          <div class="gemini-title-group">
            <span class="gemini-sparkle-icon">✨</span>
            <div>
              <h4 class="gemini-report-title">Gemini AI プロダクト選定アナリティクス (深層比較レポート)</h4>
              <p class="gemini-report-subtitle">Gemini 2.5 Flash / 3.1 Pro モデルによる意思決定支援要約</p>
            </div>
          </div>
          <span class="gemini-status-badge">AI分析完了</span>
        </div>

        <div class="gemini-deep-grid">
          <div class="gemini-card">
            <h5 class="gemini-card-title">⚖️ アーキテクチャ ＆ 開発プロセスの違い</h5>
            <p class="gemini-card-body">${architectureDiff}</p>
          </div>
          <div class="gemini-card">
            <h5 class="gemini-card-title">💰 コストパフォーマンス ＆ 制限比較</h5>
            <p class="gemini-card-body">${costComparison}</p>
          </div>
        </div>

        <div class="gemini-recommendation-box">
          <h5 class="recommendation-title">💡 最終的な導入判定アドバイス</h5>
          <div class="recommendation-content">${decisionGuide}</div>
        </div>

        <!-- インタラクティブAI分析シミュレーターボタン -->
        <div class="gemini-interactive-actions">
          <button type="button" class="gemini-action-btn" id="btn-ai-cost-eval">
            ⚡ 費用対効果とクォータ消費の深層分析を生成
          </button>
          <button type="button" class="gemini-action-btn" id="btn-ai-team-eval">
            👥 チーム構成別の導入失敗リスク判定
          </button>
        </div>
        <div id="ai-interactive-output" class="ai-interactive-output" hidden></div>
      </div>
    `;
  }

  function renderSelectedItems(selectedCards) {
    if (selectedCards.length === 0) {
      return `<p class="comparison-empty">製品カードの「比較に追加」ボタンを押すと、最大2件まで特徴や料金プランを並べて比較できます。</p>`;
    }

    const itemsData = selectedCards.map(card => getCardData(card));

    const cardsHtml = itemsData.map(item => `
      <div class="selected-product-item">
        <div class="selected-product-header">
          <span class="selected-product-badge">選択中</span>
          <div class="selected-product-title-group">
            ${item.icon ? `<img src="${item.icon}" alt="" class="brand-icon-sm" width="18" height="18">` : ''}
            <h4 class="selected-product-name">${item.agent}</h4>
          </div>
        </div>
        <p class="selected-product-fit"><strong>向いている仕事:</strong> ${item.fit}</p>
        ${item.features ? `<p class="selected-product-features"><strong>主な機能:</strong> ${item.features}</p>` : ''}
        ${item.pricing ? `<p class="selected-product-pricing"><strong>料金・制限:</strong> ${item.pricing}</p>` : ''}
      </div>
    `).join("");

    if (itemsData.length === 1) {
      return `
        <div class="selected-products-grid">
          ${cardsHtml}
        </div>
        <div class="comparison-hint-box">
          <span class="hint-icon">💡</span>
          <span>あと1つの製品の「比較に追加」を押すと、8因子の実用比較マトリクスと Gemini AI 深層選定レポートが展開されます。</span>
        </div>
      `;
    }

    // 2件選択時の実用的8因子比較マトリクス & 深層レポート
    const itemA = itemsData[0];
    const itemB = itemsData[1];

    return `
      <div class="selected-products-grid">
        ${cardsHtml}
      </div>

      <!-- 8因子 実用的深層比較マトリクス -->
      <div class="comparison-matrix-wrapper">
        <div class="matrix-header-group">
          <h4 class="matrix-title">📊 8因子 実用的詳細比較マトリクス</h4>
          <span class="matrix-badge">実務選定基準</span>
        </div>
        <table class="comparison-matrix-table">
          <thead>
            <tr>
              <th class="col-label">評価軸 / 比較項目</th>
              <th class="col-item">${itemA.icon ? `<img src="${itemA.icon}" width="16" height="16"> ` : ''}${itemA.agent}</th>
              <th class="col-item">${itemB.icon ? `<img src="${itemB.icon}" width="16" height="16"> ` : ''}${itemB.agent}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="matrix-label">1. 得意な仕事</td>
              <td>${itemA.fit}</td>
              <td>${itemB.fit}</td>
            </tr>
            <tr>
              <td class="matrix-label">2. UI ＆ 使用環境</td>
              <td><span class="matrix-tag">${itemA.ui}</span></td>
              <td><span class="matrix-tag">${itemB.ui}</span></td>
            </tr>
            <tr>
              <td class="matrix-label">3. 設定・拡張ファイル</td>
              <td><code>${itemA.config}</code></td>
              <td><code>${itemB.config}</code></td>
            </tr>
            <tr>
              <td class="matrix-label">4. セキュリティ &amp; 隔離</td>
              <td>${itemA.security}</td>
              <td>${itemB.security}</td>
            </tr>
            <tr>
              <td class="matrix-label">5. 料金 ＆ 具体的クォータ</td>
              <td><span class="matrix-price">${itemA.pricing}</span></td>
              <td><span class="matrix-price">${itemB.pricing}</span></td>
            </tr>
            <tr>
              <td class="matrix-label">6. 主な強み・利点</td>
              <td><span class="pro-text">🟢 ${itemA.pros}</span></td>
              <td><span class="pro-text">🟢 ${itemB.pros}</span></td>
            </tr>
            <tr>
              <td class="matrix-label">7. 注意点・制約</td>
              <td><span class="con-text">⚠️ ${itemA.cons}</span></td>
              <td><span class="con-text">⚠️ ${itemB.cons}</span></td>
            </tr>
            <tr>
              <td class="matrix-label">8. 推奨チーム規模</td>
              <td><strong>${itemA.bestTeam}</strong></td>
              <td><strong>${itemB.bestTeam}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Gemini AI 深層選定レポート -->
      <div class="gemini-analysis-container">
        ${generateDeepGeminiReport(itemA, itemB)}
      </div>
    `;
  }

  function bindInteractiveEvents() {
    const btnCost = document.querySelector("#btn-ai-cost-eval");
    const btnTeam = document.querySelector("#btn-ai-team-eval");
    const output = document.querySelector("#ai-interactive-output");

    if (!btnCost || !btnTeam || !output) return;

    const selectedCards = cards.filter((card) => selectedAgents.has(card.dataset.agent));
    if (selectedCards.length < 2) return;

    const itemA = getCardData(selectedCards[0]);
    const itemB = getCardData(selectedCards[1]);

    btnCost.addEventListener("click", () => {
      output.hidden = false;
      output.innerHTML = `
        <div class="ai-typing-banner">
          <span class="ai-pulse-dot"></span> <strong>Gemini AI コストシミュレーション実行中...</strong>
        </div>
        <p>💡 <strong>${itemA.agent} vs ${itemB.agent} クォータ試算結果:</strong></p>
        <p>・<strong>${itemA.agent}</strong> (${itemA.pricing}): 高頻度な単体生成タスクやデイリー開発で優れたコスト効率を発揮します。</p>
        <p>・<strong>${itemB.agent}</strong> (${itemB.pricing}): チーム全体での並列タスクやプロジェクト単位のナレッジ共有でROIが高まります。</p>
      `;
    });

    btnTeam.addEventListener("click", () => {
      output.hidden = false;
      output.innerHTML = `
        <div class="ai-typing-banner">
          <span class="ai-pulse-dot"></span> <strong>Gemini AI 組織導入リスク判定中...</strong>
        </div>
        <p>🛡️ <strong>組織適正アドバイス:</strong></p>
        <p>・<strong>${itemA.bestTeam}</strong> が中心のチームには <strong>${itemA.agent}</strong> の初期導入が最も摩擦が少ない選択肢です。</p>
        <p>・<strong>${itemB.bestTeam}</strong> には <strong>${itemB.agent}</strong> を導入することで開発サイクル・業務自動化の即効性が期待できます。</p>
      `;
    });
  }

  function updateComparison(warningMessage = "") {
    const selectedCards = cards.filter((card) => selectedAgents.has(card.dataset.agent));

    if (selectionCount) {
      selectionCount.textContent = String(selectedCards.length);
    }

    if (!selectionNames) return;

    if (warningMessage) {
      const itemsHtml = renderSelectedItems(selectedCards);
      selectionNames.innerHTML = `
        <div class="selection-alert" role="alert">
          <span class="alert-icon">⚠️</span>
          <span>${warningMessage}</span>
        </div>
        ${itemsHtml}
      `;
    } else {
      selectionNames.innerHTML = renderSelectedItems(selectedCards);
    }

    bindInteractiveEvents();
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => updateFilter(button.dataset.filter));
  });

  selectButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".agent-card");
      if (!card) return;

      const name = card.dataset.agent;
      const isSelected = selectedAgents.has(name);

      if (!isSelected && selectedAgents.size >= 2) {
        updateComparison("比較できるのは2製品までです。1つ外してから追加してください。");
        return;
      }

      if (isSelected) {
        selectedAgents.delete(name);
      } else {
        selectedAgents.add(name);
      }

      const nextState = !isSelected;
      button.setAttribute("aria-pressed", String(nextState));

      const btnTextEl = button.querySelector(".btn-text") || button;
      btnTextEl.textContent = nextState ? "追加済み" : "比較に追加";

      button.classList.toggle("is-selected", nextState);
      card.classList.toggle("is-selected", nextState);

      updateComparison();
    });
  });

  // Initial setup
  updateFilter("all");
  updateComparison();
});
