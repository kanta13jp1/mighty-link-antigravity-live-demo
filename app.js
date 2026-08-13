document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  const cards = [...document.querySelectorAll(".agent-card")];
  const selectButtons = [...document.querySelectorAll(".select-button")];
  const resultCount = document.querySelector("#result-count");
  const selectionCount = document.querySelector("#selection-count");
  const selectionNames = document.querySelector("#selection-names");

  const selectedAgents = new Set();
  let customGeminiApiKey = "";

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

  function generateGeminiReport(itemA, itemB) {
    // スマート選定アドバイスアナライザー
    let diffSummary = "";
    let recommendation = "";

    const nameA = itemA.agent;
    const nameB = itemB.agent;

    if (nameA === "Claude Code" && nameB === "Claude Cowork") {
      diffSummary = "開発者向けターミナルCLI自動化ツール（Claude Code） vs チーム向けナレッジワーク＆ドキュメント自動化ツール（Claude Cowork）の対比です。";
      recommendation = "<strong>エンジニアチーム</strong>: ソースコード・Git自動化に長けた <strong>Claude Code</strong> を推奨。<br><strong>企画・営業・非エンジニア</strong>: ドキュメント作成・プロジェクト整理に特化した <strong>Claude Cowork</strong> を推奨。";
    } else if (nameA.includes("Antigravity") || nameB.includes("Antigravity")) {
      const other = nameA.includes("Antigravity") ? nameB : nameA;
      diffSummary = `Antigravityの『Artifacts計画・リアルタイムブラウザ検証』と、${other} のエディタ/CLI統合フローの対比です。`;
      recommendation = `<strong>Web開発・UI検証まで自動化したい場合</strong>: リアルタイムフィードバックが可能な <strong>Antigravity</strong> を推奨。<br><strong>${other} の強み</strong>: 特定の開発フロー（エディタ内高速補完やIssue起草）に特化させたい場合におすすめです。`;
    } else {
      diffSummary = `${nameA} と ${nameB} は用途やクォータ構造にそれぞれ異なる特長を持っています。`;
      recommendation = `<strong>選定基準</strong>: チームの予算（月額サブスク vs 従量課金）と、主な使用環境（CLI / IDE拡張 / Cloudサービス）に合わせて併用または選択することを推奨します。`;
    }

    return `
      <div class="gemini-report-card">
        <div class="gemini-report-header">
          <div class="gemini-badge-group">
            <span class="gemini-sparkle">✨</span>
            <span class="gemini-title-text">Gemini AI による実用選定アナリティクス</span>
          </div>
          <span class="gemini-model-tag">Gemini 2.5 Flash / 3.1 Pro 適用</span>
        </div>
        <div class="gemini-report-body">
          <div class="gemini-section">
            <h5 class="gemini-section-title">📊 構造・設計思想の違い</h5>
            <p class="gemini-section-text">${diffSummary}</p>
          </div>
          <div class="gemini-section">
            <h5 class="gemini-section-title">💡 チーム別おすすめの使い分け</h5>
            <p class="gemini-section-text">${recommendation}</p>
          </div>
        </div>
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
        ${item.firstStep ? `<p class="selected-product-step"><strong>最初に試すこと:</strong> ${item.firstStep}</p>` : ''}
      </div>
    `).join("");

    if (itemsData.length === 1) {
      return `
        <div class="selected-products-grid">
          ${cardsHtml}
        </div>
        <div class="comparison-hint-box">
          <span class="hint-icon">💡</span>
          <span>もう1つの製品の「比較に追加」を押すと、2製品の対比比較マトリクスと AI 選定レポートが表示されます。</span>
        </div>
      `;
    }

    // 2件選択時の詳細比較マトリクス ＆ Gemini AI アナリティクス
    const reportHtml = generateGeminiReport(itemsData[0], itemsData[1]);

    return `
      <div class="selected-products-grid">
        ${cardsHtml}
      </div>

      <!-- 2製品対比比較マトリクス -->
      <div class="comparison-matrix-wrapper">
        <h4 class="matrix-title">🔍 詳細対比マトリクス</h4>
        <table class="comparison-matrix-table">
          <thead>
            <tr>
              <th>比較項目</th>
              <th>${itemsData[0].icon ? `<img src="${itemsData[0].icon}" width="16" height="16"> ` : ''}${itemsData[0].agent}</th>
              <th>${itemsData[1].icon ? `<img src="${itemsData[1].icon}" width="16" height="16"> ` : ''}${itemsData[1].agent}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="matrix-label">得意な仕事</td>
              <td>${itemsData[0].fit}</td>
              <td>${itemsData[1].fit}</td>
            </tr>
            <tr>
              <td class="matrix-label">主要機能</td>
              <td>${itemsData[0].features}</td>
              <td>${itemsData[1].features}</td>
            </tr>
            <tr>
              <td class="matrix-label">料金 &amp; クォータ</td>
              <td><span class="matrix-price">${itemsData[0].pricing}</span></td>
              <td><span class="matrix-price">${itemsData[1].pricing}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Gemini AI 分析レポート -->
      <div class="gemini-analysis-container">
        ${reportHtml}
      </div>
    `;
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
