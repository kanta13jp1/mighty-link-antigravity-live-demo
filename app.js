document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  const cards = [...document.querySelectorAll(".agent-card")];
  const selectButtons = [...document.querySelectorAll(".select-button")];
  const resultCount = document.querySelector("#result-count");
  const selectionCount = document.querySelector("#selection-count");
  const selectionNames = document.querySelector("#selection-names");

  const selectedAgents = new Set();
  let currentTeamSize = 5; // デフォルト5人

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

    // 自律度の自動判定
    let autonomy = "Level 2: インタラクティブペアプロ型";
    const agent = card.dataset.agent;
    if (agent === "Devin") autonomy = "Level 4: 完全自律タスク解決型";
    else if (agent === "Claude Code" || agent === "Antigravity") autonomy = "Level 3: 自律エージェントループ型";
    else if (agent === "Cursor Agent" || agent === "Windsurf") autonomy = "Level 2: 高速IDE補完・Composer型";
    else if (agent === "Claude Cowork") autonomy = "Level 3: プロジェクト・ナレッジ協働型";

    return {
      agent,
      fit: card.dataset.fit || "",
      pricing: card.dataset.pricing || "",
      icon: card.dataset.icon || "",
      ui: card.dataset.ui || "Web / CLI / IDE",
      config: card.dataset.config || "設定ファイル / Prompt",
      security: card.dataset.security || "標準セキュリティ",
      pros: card.dataset.pros || "高いタスク実行性能",
      cons: card.dataset.cons || "使用クォータ枠の管理が必要",
      bestTeam: card.dataset.bestTeam || "各種開発・企画チーム",
      autonomy,
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

  // チーム規模別コスト試算
  function calculateCost(pricingStr, members) {
    if (pricingStr.includes("Free (1日10回)")) {
      return `$0 / 月 (Pro選択時: $${20 * members}/月)`;
    } else if (pricingStr.includes("Pro ($20/月")) {
      return `$${20 * members} / 月 (約 ${(20 * members * 155).toLocaleString()} 円)`;
    } else if (pricingStr.includes("Team ($30/人/月")) {
      return `$${30 * members} / 月 (約 ${(30 * members * 155).toLocaleString()} 円)`;
    } else if (pricingStr.includes("Pro ($15/月")) {
      return `$${15 * members} / 月 (約 ${(15 * members * 155).toLocaleString()} 円)`;
    } else if (pricingStr.includes("Individual ($10/月")) {
      return `$${10 * members} / 月 (Business時: $${19 * members}/月)`;
    } else if (pricingStr.includes("Free (月15 ACU)")) {
      return `$${20 * members} / 月 〜 (ACU従量上限に応じる)`;
    }
    return `$${20 * members} / 月 (標準試算)`;
  }

  function generateDeepGeminiReport(itemA, itemB) {
    const nameA = itemA.agent;
    const nameB = itemB.agent;

    let archAnalysis = "";
    let decisionTree = "";
    let hybridPrompt = "";

    if ((nameA === "Claude Code" && nameB === "Antigravity") || (nameB === "Claude Code" && nameA === "Antigravity")) {
      archAnalysis = `
        <strong>Claude Code</strong> はターミナルCLIから直感的なコマンド実行と複数ファイル編集・Gitコミットを行うコマンドラインエージェントです。<br>
        一方、<strong>Antigravity</strong> は Artifacts 計画とリアルタイムブラウザ検証サブエージェントを備え、UI画面を視覚的に自動検証しながら進めるWeb開発環境です。
      `;
      decisionTree = `
        🏢 <strong>推奨導入決定ツリー</strong>:<br>
        - <strong>CLI慣れしたバックエンド/リファクタリング重視</strong> → <span class="tag-recommend">Claude Code</span> をメイン採用<br>
        - <strong>フロントエンドWeb開発・画面の即時視覚検証重視</strong> → <span class="tag-recommend">Antigravity</span> をメイン採用
      `;
      hybridPrompt = `
        <code>「Antigravityで画面仕様とUIコンポーネント計画(Artifact)を作成後、Claude CodeでCLIリファクタリングとGitコミットを一括実行する」併用ワークフローが最高効率です。</code>
      `;
    } else if ((nameA === "Claude Code" && nameB === "Claude Cowork") || (nameB === "Claude Code" && nameA === "Claude Cowork")) {
      archAnalysis = `
        <strong>Claude Code</strong> は開発者のコードベースおよびローカルTerminal環境に最適化されています。<br>
        <strong>Claude Cowork</strong> は非エンジニア・PM・営業チームを含むプロジェクト全体のドキュメント整理や分析レポート作成に最適化されています。
      `;
      decisionTree = `
        🏢 <strong>推奨導入決定ツリー</strong>:<br>
        - <strong>エンジニア開発ライン</strong> → <span class="tag-recommend">Claude Code (Pro $20/Max $100)</span><br>
        - <strong>企画・PM・ビジネス共有空間</strong> → <span class="tag-recommend">Claude Cowork (Team $30/人)</span>
      `;
      hybridPrompt = `
        <code>「Claude Coworkで企画書・仕様概要を作成し、Claude CodeにCLAUDE.mdとしてインポートして実装させる」クロスファンクショナル連携を推奨します。</code>
      `;
    } else {
      archAnalysis = `
        <strong>${nameA}</strong> (${itemA.ui}) は 「${itemA.pros}」 を主軸とし、<br>
        <strong>${nameB}</strong> (${itemB.ui}) は 「${itemB.pros}」 に強みを持っています。
      `;
      decisionTree = `
        🏢 <strong>推奨導入決定ツリー</strong>:<br>
        - <strong>${itemA.bestTeam}</strong> → <span class="tag-recommend">${nameA}</span><br>
        - <strong>${itemB.bestTeam}</strong> → <span class="tag-recommend">${nameB}</span>
      `;
      hybridPrompt = `
        <code>「${nameA}の強みと${nameB}の強みを開発フェーズ（計画 vs 実装 vs レビュー）に応じて使い分ける」ハイブリッドアプローチが効果的です。</code>
      `;
    }

    return `
      <div class="gemini-deep-report" role="region" aria-label="Gemini AI 深層選定分析">
        <div class="gemini-deep-header">
          <div class="gemini-title-group">
            <span class="gemini-sparkle-icon">✨</span>
            <div>
              <h4 class="gemini-report-title">Gemini AI プロダクト選定アナリティクス (深層比較レポート)</h4>
              <p class="gemini-report-subtitle">Gemini 2.5 Flash / 3.1 Pro モデルによる多角的意思決定支援</p>
            </div>
          </div>
          <span class="gemini-status-badge">分析完了</span>
        </div>

        <div class="gemini-deep-grid">
          <div class="gemini-card">
            <h5 class="gemini-card-title">⚖️ アーキテクチャ ＆ 開発プロセスの違い</h5>
            <p class="gemini-card-body">${archAnalysis}</p>
          </div>
          <div class="gemini-card">
            <h5 class="gemini-card-title">💡 組織規模別 推奨導入決定ツリー</h5>
            <div class="gemini-card-body">${decisionTree}</div>
          </div>
        </div>

        <div class="gemini-recommendation-box">
          <h5 class="recommendation-title">🔗 チーム相乗効果を生む併用プロンプト・シナリオ</h5>
          <div class="recommendation-content">${hybridPrompt}</div>
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
            ${item.icon ? `<img src="${item.icon}" alt="${item.agent} アイコン" class="brand-icon-sm" width="18" height="18" onerror="this.style.display='none'">` : ''}
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
          <span>あと1つの製品の「比較に追加」を押すと、9因子の深層比較マトリクス、チームコスト計算機、Gemini AIレポートが展開されます。</span>
        </div>
      `;
    }

    // 2件選択時の9因子深層比較マトリクス & チームコスト計算機 & Gemini AI 深層アナリティクス
    const itemA = itemsData[0];
    const itemB = itemsData[1];

    const costA = calculateCost(itemA.pricing, currentTeamSize);
    const costB = calculateCost(itemB.pricing, currentTeamSize);

    return `
      <div class="selected-products-grid">
        ${cardsHtml}
      </div>

      <!-- チーム規模別コスト試算コントローラー -->
      <div class="cost-calculator-card">
        <div class="calc-header">
          <h4 class="calc-title">🧮 チーム規模別 コスト＆クォータ試算</h4>
          <div class="team-size-selector">
            <label for="team-size-select" class="calc-label">対象メンバー数:</label>
            <select id="team-size-select" class="calc-select">
              <option value="1" ${currentTeamSize === 1 ? 'selected' : ''}>1人 (個人)</option>
              <option value="5" ${currentTeamSize === 5 ? 'selected' : ''}>5人 (チーム)</option>
              <option value="20" ${currentTeamSize === 20 ? 'selected' : ''}>20人 (部・課)</option>
              <option value="50" ${currentTeamSize === 50 ? 'selected' : ''}>50人 (事業部)</option>
            </select>
          </div>
        </div>
        <div class="calc-results-grid">
          <div class="calc-result-box">
            <span class="calc-agent-name">${itemA.agent} 試算額</span>
            <span class="calc-price-value">${costA}</span>
          </div>
          <div class="calc-result-box">
            <span class="calc-agent-name">${itemB.agent} 試算額</span>
            <span class="calc-price-value">${costB}</span>
          </div>
        </div>
      </div>

      <!-- 9因子 深層比較マトリクス -->
      <div class="comparison-matrix-wrapper">
        <div class="matrix-header-group">
          <h4 class="matrix-title">📊 9因子 実用的深層比較マトリクス</h4>
          <span class="matrix-badge">意思決定基準</span>
        </div>
        <div class="matrix-table-scroll">
          <table class="comparison-matrix-table">
            <thead>
              <tr>
                <th class="col-label">評価軸 / 比較項目</th>
                <th class="col-item">${itemA.icon ? `<img src="${itemA.icon}" width="16" height="16" onerror="this.style.display='none'"> ` : ''}${itemA.agent}</th>
                <th class="col-item">${itemB.icon ? `<img src="${itemB.icon}" width="16" height="16" onerror="this.style.display='none'"> ` : ''}${itemB.agent}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="matrix-label">1. 得意な仕事</td>
                <td>${itemA.fit}</td>
                <td>${itemB.fit}</td>
              </tr>
              <tr>
                <td class="matrix-label">2. UI ＆ 動作環境</td>
                <td><span class="matrix-tag">${itemA.ui}</span></td>
                <td><span class="matrix-tag">${itemB.ui}</span></td>
              </tr>
              <tr>
                <td class="matrix-label">3. 自律度 ＆ 人の介在</td>
                <td><span class="autonomy-badge">${itemA.autonomy}</span></td>
                <td><span class="autonomy-badge">${itemB.autonomy}</span></td>
              </tr>
              <tr>
                <td class="matrix-label">4. 設定・拡張ファイル</td>
                <td><code>${itemA.config}</code></td>
                <td><code>${itemB.config}</code></td>
              </tr>
              <tr>
                <td class="matrix-label">5. セキュリティ ＆ 隔離</td>
                <td>${itemA.security}</td>
                <td>${itemB.security}</td>
              </tr>
              <tr>
                <td class="matrix-label">6. 料金 ＆ クォータ制限</td>
                <td><span class="matrix-price">${itemA.pricing}</span></td>
                <td><span class="matrix-price">${itemB.pricing}</span></td>
              </tr>
              <tr>
                <td class="matrix-label">7. 主な強み・利点</td>
                <td><span class="pro-text">🟢 ${itemA.pros}</span></td>
                <td><span class="pro-text">🟢 ${itemB.pros}</span></td>
              </tr>
              <tr>
                <td class="matrix-label">8. 注意点・制約</td>
                <td><span class="con-text">⚠️ ${itemA.cons}</span></td>
                <td><span class="con-text">⚠️ ${itemB.cons}</span></td>
              </tr>
              <tr>
                <td class="matrix-label">9. 推奨チーム規模</td>
                <td><strong>${itemA.bestTeam}</strong></td>
                <td><strong>${itemB.bestTeam}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Gemini AI 深層選定レポート -->
      <div class="gemini-analysis-container">
        ${generateDeepGeminiReport(itemA, itemB)}
      </div>
    `;
  }

  function bindInteractiveEvents() {
    const teamSelect = document.querySelector("#team-size-select");
    if (teamSelect) {
      teamSelect.addEventListener("change", (e) => {
        currentTeamSize = parseInt(e.target.value, 10);
        updateComparison();
      });
    }

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
          <span class="ai-pulse-dot"></span> <strong>Gemini AI コスト＆クォータ消化シミュレーション実行中...</strong>
        </div>
        <p>💡 <strong>${itemA.agent} vs ${itemB.agent} (${currentTeamSize}人規模の試算分析):</strong></p>
        <p>・<strong>${itemA.agent}</strong>: デイリーでの連続使用時、${itemA.pricing} の制限範囲内で高効率に動作します。</p>
        <p>・<strong>${itemB.agent}</strong>: 重度なタスクの並列処理時は、${itemB.pricing} のクォータ枠管理を意識することが成功のポイントです。</p>
      `;
    });

    btnTeam.addEventListener("click", () => {
      output.hidden = false;
      output.innerHTML = `
        <div class="ai-typing-banner">
          <span class="ai-pulse-dot"></span> <strong>Gemini AI 組織定着度・リスク診断中...</strong>
        </div>
        <p>🛡️ <strong>組織適合アドバイス:</strong></p>
        <p>・<strong>${itemA.bestTeam}</strong> への導入 → <strong>${itemA.agent}</strong> (${itemA.autonomy}) が最も学習コストが低く即効性があります。</p>
        <p>・<strong>${itemB.bestTeam}</strong> への導入 → <strong>${itemB.agent}</strong> (${itemB.autonomy}) の活用でチーム全体の生産性が飛躍的に高まります。</p>
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
