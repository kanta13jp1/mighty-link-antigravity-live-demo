(() => {
  "use strict";

  const products = Array.isArray(window.PRODUCT_DATA) ? window.PRODUCT_DATA : [];
  const selectedIds = new Set();
  let activeScenario = "all";
  let searchQuery = "";

  const scenarios = {
    all: {
      ids: products.map((product) => product.id),
      message: "5製品を表示しています。カードから最大2製品を詳細比較できます。"
    },
    code: {
      ids: ["codex", "claude-code", "kiro", "antigravity"],
      message: "コード実装は、横断的な開発ならCodex、CLI中心ならClaude Code、仕様駆動ならKiro、画面検証まで一体化するならAntigravityが候補です。"
    },
    knowledge: {
      ids: ["claude-cowork"],
      message: "資料、表計算、メール、カレンダー、定期レポートをまたぐ仕事はClaude Coworkが中心候補です。"
    },
    spec: {
      ids: ["kiro", "codex", "claude-code"],
      message: "仕様を正式な工程として残すならKiro。既存の設計書やテストを基準に実装するならCodexとClaude Codeも候補です。"
    },
    browser: {
      ids: ["antigravity", "codex", "claude-cowork"],
      message: "Web制作と画面証拠はAntigravity、アプリ内Browserを含む開発はCodex、業務Web操作はClaude Coworkが候補です。"
    },
    automation: {
      ids: ["codex", "claude-code", "kiro", "antigravity", "claude-cowork"],
      message: "SDK/CIはCodexとClaude Code、仕様とHooksはKiro、Browserを含むSDK実演はAntigravity、定期業務はClaude Coworkが向きます。"
    }
  };

  const productGrid = document.getElementById("product-grid");
  const emptyState = document.getElementById("empty-state");
  const searchInput = document.getElementById("product-search");
  const scenarioResult = document.getElementById("scenario-result");
  const selectionCount = document.getElementById("selection-count");
  const compareStatus = document.getElementById("compare-status");
  const comparisonEmpty = document.getElementById("comparison-empty");
  const comparisonTableWrap = document.getElementById("comparison-table-wrap");
  const comparisonHead = document.getElementById("comparison-head");
  const comparisonBody = document.getElementById("comparison-body");
  const clearComparison = document.getElementById("clear-comparison");
  const sourceLedger = document.getElementById("source-ledger");
  const sourceCount = document.getElementById("source-count");

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function externalLink(label, url, className) {
    const link = element("a", className, label);
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  }

  function createMediaLink(kind, item) {
    const link = externalLink("", item.url, "media-link");
    link.append(
      element("span", "", kind),
      element("strong", "", item.title),
      element("small", "", `${item.date}${item.channel ? ` / ${item.channel}` : ""}`)
    );
    return link;
  }

  function createProductCard(product) {
    const card = element("article", "product-card");
    card.dataset.product = product.id;
    card.dataset.search = [
      product.name,
      product.vendor,
      product.oneLine,
      product.bestFor,
      product.notIdealFor,
      ...product.tags,
      ...Object.values(product.comparison)
    ].join(" ").toLowerCase();

    const head = element("div", "product-card-head");
    const iconWrap = element("div", "product-icon-wrap");
    const icon = element("img", "product-icon");
    icon.src = product.icon;
    icon.alt = `${product.name} 公式アイコン`;
    icon.width = 42;
    icon.height = 42;
    icon.loading = "lazy";
    iconWrap.append(icon);

    const meta = element("div", "product-meta");
    meta.append(element("p", "vendor", product.vendor), element("h3", "product-name", product.name));

    const release = element("a", "release-badge");
    release.href = product.release.url;
    release.target = "_blank";
    release.rel = "noopener noreferrer";
    release.setAttribute("aria-label", `${product.name} ${product.release.version} の公式更新情報`);
    release.append(
      element("strong", "", product.release.version),
      element("span", "", `${product.release.label} / ${product.release.date}`)
    );
    head.append(iconWrap, meta, release);

    const summary = element("p", "product-summary", product.oneLine);

    const fitGrid = element("div", "fit-grid");
    const bestFit = element("div", "fit-item");
    bestFit.append(element("span", "fit-label", "選ぶ理由"), element("p", "", product.bestFor));
    const caution = element("div", "fit-item is-caution");
    caution.append(element("span", "fit-label", "別候補も見る条件"), element("p", "", product.notIdealFor));
    fitGrid.append(bestFit, caution);

    const update = element("div", "update-block");
    update.append(
      element("span", "update-kicker", `LATEST UPDATE / ${product.latestUpdate.date}`),
      element("h4", "", product.latestUpdate.title),
      element("p", "", product.latestUpdate.summary)
    );

    const media = element("div", "media-grid");
    media.append(
      createMediaLink("最新公式動画", product.latestVideo),
      createMediaLink("最新公式ブログ", product.latestBlog)
    );

    const details = element("details", "card-details");
    details.append(element("summary", "", "実務比較の要点"));
    const detailList = element("ul", "detail-list");
    ["操作面", "持続指示", "能力拡張", "MCP・連携", "証拠とレビュー", "安全境界", "価格・利用枠"].forEach((field) => {
      const item = element("li", "");
      item.append(element("strong", "", field), element("span", "", product.comparison[field]));
      detailList.append(item);
    });
    details.append(detailList);

    const actions = element("div", "card-actions");
    const compareButton = element("button", "compare-button", "比較に追加");
    compareButton.type = "button";
    compareButton.dataset.productId = product.id;
    compareButton.setAttribute("aria-pressed", "false");
    compareButton.setAttribute("aria-label", `${product.name}を詳細比較に追加`);
    compareButton.addEventListener("click", () => toggleSelection(product.id));

    const links = element("div", "official-links");
    links.append(
      externalLink("公式Docs", product.sources[0].url),
      externalLink("更新履歴", product.release.url)
    );
    actions.append(compareButton, links);

    card.append(head, summary, fitGrid, update, media, details, actions);
    return card;
  }

  function renderProducts() {
    productGrid.replaceChildren(...products.map(createProductCard));
    applyFilters();
  }

  function applyFilters() {
    const allowed = new Set(scenarios[activeScenario].ids);
    let visibleCount = 0;

    document.querySelectorAll(".product-card").forEach((card) => {
      const matchesScenario = allowed.has(card.dataset.product);
      const matchesSearch = !searchQuery || card.dataset.search.includes(searchQuery);
      const visible = matchesScenario && matchesSearch;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    emptyState.hidden = visibleCount !== 0;
    const baseMessage = scenarios[activeScenario].message;
    scenarioResult.textContent = searchQuery
      ? `${baseMessage} 検索結果は${visibleCount}製品です。`
      : baseMessage;
  }

  function toggleSelection(productId) {
    if (selectedIds.has(productId)) {
      selectedIds.delete(productId);
      compareStatus.textContent = "比較候補から外しました。";
    } else if (selectedIds.size >= 2) {
      const current = [...selectedIds].map((id) => products.find((product) => product.id === id).name);
      compareStatus.textContent = `比較は最大2製品です。${current.join(" と ")}のどちらかを外してください。`;
      return;
    } else {
      selectedIds.add(productId);
      compareStatus.textContent = selectedIds.size === 1
        ? "1製品を選択しました。もう1製品を追加すると横並びで比較できます。"
        : "2製品を選択しました。13の実務軸で差を確認できます。";
    }

    updateSelectionUi();
  }

  function updateSelectionUi() {
    document.querySelectorAll(".product-card").forEach((card) => {
      const selected = selectedIds.has(card.dataset.product);
      card.classList.toggle("is-selected", selected);
      const button = card.querySelector(".compare-button");
      button.setAttribute("aria-pressed", String(selected));
      button.textContent = selected ? "比較から外す" : "比較に追加";
    });

    selectionCount.textContent = String(selectedIds.size);
    clearComparison.disabled = selectedIds.size === 0;
    renderComparison();
  }

  const costCalculatorWrap = document.getElementById("cost-calculator-wrap");
  const teamSizeSelect = document.getElementById("team-size-select");
  const calcResultsGrid = document.getElementById("calc-results-grid");

  const productPrices = {
    codex: {
      name: "Codex",
      pricePerUser: 20,
      baseModel: "OpenAI GPT-5.6 (Sol / Terra / Luna) (自律エージェント型モデル群)",
      minSeatsNote: "1名から契約可能",
      quotaInfo: (size) => `Pro $20/月 × ${size}名 (1日200回枠 / Sandbox隔離環境)`,
      valueBadge: "1枠約3.3円相当 (1日200回枠)"
    },
    "claude-code": {
      name: "Claude Code",
      pricePerUser: 20,
      baseModel: "Anthropic Claude Opus 5 / Claude Sonnet 5 (2026年7月最新モデル)",
      minSeatsNote: "1名から契約可能 (Max $100/月)",
      quotaInfo: (size) => `Pro $20/月 × ${size}名 (5時間枠制限) / Max $100/月`,
      valueBadge: "高度コード編集特化 (5h制限あり)"
    },
    "claude-cowork": {
      name: "Claude Cowork",
      pricePerUser: 30,
      baseModel: "Anthropic Claude Fable 5 / Claude Sonnet 5 (マルチエージェント基盤)",
      minSeatsNote: "※最低5席からの契約が必要 (最低月$150〜)",
      quotaInfo: (size) => `Team $30/月 × ${size < 5 ? 5 : size}名 (${size < 5 ? "※最低5席契約の最低額適用" : "チーム共有アクセス"})`,
      valueBadge: "ナレッジ・ドキュメント自動化特化"
    },
    kiro: {
      name: "Kiro",
      pricePerUser: 20,
      baseModel: "Anthropic Claude Opus 5 / Claude Sonnet 5 (Bedrock連動)",
      minSeatsNote: "1名から契約可能 (Free 500 PUあり)",
      quotaInfo: (size) => `Pro $20/月 × ${size}名 (月間Power Units枠 / Freeプランあり)`,
      valueBadge: "仕様駆動開発 (Specs) 特化"
    },
    antigravity: {
      name: "Antigravity",
      pricePerUser: 20,
      baseModel: "Google Gemini 3.1 Pro (100万トークン窓) / Gemini 3.5 Flash",
      minSeatsNote: "1名から契約可能 (無料プランあり)",
      quotaInfo: (size) => `Pro $20/月 × ${size}名 (Pro定額自律枠 / 無料プランあり)`,
      valueBadge: "🟢 1枠約0.66円相当 (他社の5倍枠・最高コスパ)"
    }
  };

  function renderCostCalculator(selectedProducts) {
    if (!costCalculatorWrap || !calcResultsGrid) return;

    if (selectedProducts.length === 0) {
      costCalculatorWrap.hidden = true;
      calcResultsGrid.replaceChildren();
      return;
    }

    costCalculatorWrap.hidden = false;
    const teamSize = parseInt(teamSizeSelect ? teamSizeSelect.value : "5", 10);
    const jpyRate = 155; // 1 USD = 155 JPY 換算

    const boxes = selectedProducts.map((product) => {
      const priceMeta = productPrices[product.id] || {
        name: product.name,
        pricePerUser: 20,
        baseModel: product.comparison["基盤モデル"] || "最新AIモデル",
        minSeatsNote: "1名から契約可能",
        quotaInfo: (size) => `Pro $20/月 × ${size}名`,
        valueBadge: "標準プラン"
      };

      // Claude Cowork は最低5席契約ルールを反映
      const effectiveUsers = (product.id === "claude-cowork" && teamSize < 5) ? 5 : teamSize;
      const totalUsd = priceMeta.pricePerUser * effectiveUsers;
      const totalJpy = Math.round(totalUsd * jpyRate);

      const box = element("div", "calc-result-box");
      const head = element("div", "calc-box-head");
      head.append(
        element("strong", "calc-product-name", `${product.name} 試算額`),
        element("span", "calc-team-label", `${effectiveUsers}名分 適用`)
      );

      const modelBlock = element("div", "calc-model-badge-block");
      modelBlock.append(
        element("span", "calc-model-label", "🧠 基盤モデル: "),
        element("strong", "calc-model-name", priceMeta.baseModel)
      );

      const priceDisplay = element("div", "calc-price-display");
      priceDisplay.append(
        element("span", "calc-usd", `$${totalUsd.toLocaleString()} / 月`),
        element("span", "calc-jpy", `(約 ${totalJpy.toLocaleString()} 円 / 月)`),
        element("span", "calc-value-badge", priceMeta.valueBadge)
      );

      const seatNote = element("p", "calc-seat-note", priceMeta.minSeatsNote);
      const quotaDetail = element("p", "calc-quota-text", priceMeta.quotaInfo(teamSize));

      box.append(head, modelBlock, priceDisplay, seatNote, quotaDetail);
      return box;
    });

    calcResultsGrid.replaceChildren(...boxes);
  }

  if (teamSizeSelect) {
    teamSizeSelect.addEventListener("change", () => {
      const selected = [...selectedIds]
        .map((id) => products.find((product) => product.id === id))
        .filter(Boolean);
      renderCostCalculator(selected);
    });
  }

  function renderComparison() {
    const selected = [...selectedIds]
      .map((id) => products.find((product) => product.id === id))
      .filter(Boolean);

    renderCostCalculator(selected);

    if (selected.length === 0) {
      comparisonEmpty.hidden = false;
      comparisonTableWrap.hidden = true;
      comparisonHead.replaceChildren();
      comparisonBody.replaceChildren();
      return;
    }

    comparisonEmpty.hidden = true;
    comparisonTableWrap.hidden = false;

    const headerRow = element("tr", "");
    headerRow.append(element("th", "", "比較軸"));
    selected.forEach((product) => {
      const heading = element("th", "");
      heading.scope = "col";
      const wrapper = element("div", "comparison-product");
      const icon = element("img", "");
      icon.src = product.icon;
      icon.alt = "";
      icon.width = 32;
      icon.height = 32;
      wrapper.append(icon, element("span", "", product.name));
      heading.append(wrapper);
      headerRow.append(heading);
    });
    comparisonHead.replaceChildren(headerRow);

    const fields = Object.keys(selected[0].comparison);
    const rows = fields.map((field) => {
      const row = element("tr", "");
      const label = element("th", "", field);
      label.scope = "row";
      row.append(label);
      selected.forEach((product) => row.append(element("td", "", product.comparison[field])));
      return row;
    });
    comparisonBody.replaceChildren(...rows);
  }

  function renderSourceLedger() {
    let total = 0;
    const rows = products.map((product) => {
      const row = element("article", "source-row");
      const productBlock = element("div", "source-product");
      const icon = element("img", "");
      icon.src = product.icon;
      icon.alt = "";
      icon.width = 38;
      icon.height = 38;
      const text = element("div", "");
      text.append(element("strong", "", product.name), element("span", "", `確認日 2026-08-13 / ${product.release.version}`));
      productBlock.append(icon, text);

      const links = element("div", "source-links");
      const allSources = [
        ...product.sources,
        {label: "最新更新", url: product.latestUpdate.url},
        {label: "最新動画", url: product.latestVideo.url},
        {label: "最新ブログ", url: product.latestBlog.url},
        {label: "アイコン配布元", url: product.iconSource}
      ];
      total += allSources.length;
      allSources.forEach((source) => {
        const link = externalLink(source.label, source.url);
        link.setAttribute("aria-label", `${product.name}: ${source.label}を開く`);
        links.append(link);
      });
      row.append(productBlock, links);
      return row;
    });

    sourceLedger.replaceChildren(...rows);
    sourceCount.textContent = `${total}件`;
  }

  document.querySelectorAll(".scenario-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeScenario = button.dataset.scenario;
      document.querySelectorAll(".scenario-button").forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });
      applyFilters();
    });
  });

  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    applyFilters();
  });

  clearComparison.addEventListener("click", () => {
    selectedIds.clear();
    compareStatus.textContent = "比較候補をすべて解除しました。";
    updateSelectionUi();
  });

  // 🎓 AI Agent Academy & Learning Progress Tracker Logic
  function initAcademyTracker() {
    const checkboxes = [...document.querySelectorAll(".module-checkbox")];
    const progressCountText = document.querySelector("#progress-count-text");
    const progressPercentBadge = document.querySelector("#progress-percent-badge");
    const progressBarFill = document.querySelector("#progress-bar-fill");
    const btnResetTracker = document.querySelector("#btn-reset-tracker");

    if (checkboxes.length === 0) return;

    const STORAGE_KEY = "ai_agent_learning_progress";

    function loadSavedProgress() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        return [];
      }
    }

    function saveProgress(completedIds) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds));
      } catch (e) {
        // Fallback if localStorage is disabled
      }
    }

    function updateTrackerUI() {
      const total = checkboxes.length;
      const completed = checkboxes.filter(chk => chk.checked);
      const completedCount = completed.length;
      const percent = Math.round((completedCount / total) * 100);

      if (progressCountText) {
        progressCountText.textContent = `${completedCount} / ${total} モジュール完了`;
      }
      if (progressPercentBadge) {
        progressPercentBadge.textContent = `${percent}% 完了`;
      }
      if (progressBarFill) {
        progressBarFill.style.width = `${percent}%`;
        const barContainer = progressBarFill.parentElement;
        if (barContainer) {
          barContainer.setAttribute("aria-valuenow", String(percent));
        }
      }

      checkboxes.forEach(chk => {
        const card = chk.closest(".module-card");
        if (card) {
          card.classList.toggle("is-completed", chk.checked);
        }
      });
    }

    // Restore saved state
    const savedCompletedIds = loadSavedProgress();
    checkboxes.forEach(chk => {
      const modId = chk.dataset.moduleId;
      if (savedCompletedIds.includes(modId)) {
        chk.checked = true;
      }
    });
    updateTrackerUI();

    // Event handlers
    checkboxes.forEach(chk => {
      chk.addEventListener("change", () => {
        const currentCompleted = checkboxes.filter(c => c.checked).map(c => c.dataset.moduleId);
        saveProgress(currentCompleted);
        updateTrackerUI();
      });
    });

    if (btnResetTracker) {
      btnResetTracker.addEventListener("click", () => {
        if (confirm("すべての学習進捗をリセットしてもよろしいですか？")) {
          checkboxes.forEach(chk => { chk.checked = false; });
          saveProgress([]);
          updateTrackerUI();
        }
      });
    }
  }

  renderProducts();
  renderSourceLedger();
  updateSelectionUi();
  initAcademyTracker();
})();
