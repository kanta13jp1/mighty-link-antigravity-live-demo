/**
 * AI Agent Learning Hub - Finale Edition
 * Real-time Search, CSV/JSON Data Export, AI Recommender & Cyberpunk Theme
 */
document.addEventListener('DOMContentLoaded', () => {
  const MAX_SELECTION = 2;
  const selectedProductIds = new Set();

  const filterButtons = document.querySelectorAll('.btn-filter');
  const productCards = document.querySelectorAll('.product-card');
  const compareButtons = document.querySelectorAll('.btn-compare');
  const searchInput = document.getElementById('search-input');
  const summaryCountBadge = document.getElementById('summary-count-badge');
  const summaryContentBox = document.getElementById('summary-content-box');
  const limitToast = document.getElementById('limit-warning-toast');
  const clearSelectionBtn = document.getElementById('btn-clear-selection');
  const openModalBtn = document.getElementById('btn-open-modal');
  const closeModalBtn = document.getElementById('btn-close-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalBodyGrid = document.getElementById('modal-body-grid');
  
  // Theme Switcher
  const themeToggleBtn = document.getElementById('btn-theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'neon') {
        document.documentElement.removeAttribute('data-theme');
        themeToggleBtn.innerHTML = '⚡ ネオン (Cyberpunk)';
      } else {
        document.documentElement.setAttribute('data-theme', 'neon');
        themeToggleBtn.innerHTML = '🌙 ダーク (Slate)';
      }
    });
  }

  // 1. Real-time Search & Filter Combination
  let currentFilter = 'すべて';
  let searchQuery = '';

  function applyFilterAndSearch() {
    productCards.forEach(card => {
      const cardTags = card.getAttribute('data-tags') || '';
      const textContent = card.textContent.toLowerCase();

      const matchesFilter = (currentFilter === 'すべて' || cardTags.includes(currentFilter));
      const matchesSearch = (!searchQuery || textContent.includes(searchQuery.toLowerCase()));

      if (matchesFilter && matchesSearch) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.getAttribute('data-filter');
      filterButtons.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      applyFilterAndSearch();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      applyFilterAndSearch();
    });
  }

  // 2. Data Export (CSV & JSON)
  const exportCsvBtn = document.getElementById('btn-export-csv');
  const exportJsonBtn = document.getElementById('btn-export-json');

  function getProductsData() {
    const products = [];
    productCards.forEach(card => {
      const name = card.querySelector('.product-name').textContent.trim();
      const link = card.querySelector('.official-doc-link') ? card.querySelector('.official-doc-link').href : '';
      const tags = card.getAttribute('data-tags') || '';
      const work = card.querySelector('.card-text-work').textContent.trim();
      const features = card.querySelectorAll('.card-text')[1].textContent.trim();
      const price = card.querySelector('.card-text-price').textContent.trim();
      const quota = card.querySelector('.card-text-quota').textContent.trim();
      const firstTry = card.querySelectorAll('.card-text')[4].textContent.trim();

      products.push({ name, tags, work, features, price, quota, firstTry, officialDocLink: link });
    });
    return products;
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const data = getProductsData();
      let csvContent = '\uFEFF'; // UTF-8 BOM
      csvContent += '製品名,タグ,向いている仕事,主な機能,全料金プラン (2026),クォータ・制限詳細,最初に試すこと,公式ドキュメントURL\n';

      data.forEach(p => {
        const row = [
          `"${p.name.replace(/"/g, '""')}"`,
          `"${p.tags.replace(/"/g, '""')}"`,
          `"${p.work.replace(/"/g, '""')}"`,
          `"${p.features.replace(/"/g, '""')}"`,
          `"${p.price.replace(/"/g, '""')}"`,
          `"${p.quota.replace(/"/g, '""')}"`,
          `"${p.firstTry.replace(/"/g, '""')}"`,
          `"${p.officialDocLink.replace(/"/g, '""')}"`
        ];
        csvContent += row.join(',') + '\n';
      });

      downloadFile(csvContent, 'ai_agent_learning_hub_2026.csv', 'text/csv;charset=utf-8;');
    });
  }

  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
      const data = getProductsData();
      const jsonContent = JSON.stringify(data, null, 2);
      downloadFile(jsonContent, 'ai_agent_learning_hub_2026.json', 'application/json;');
    });
  }

  function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // 3. AI Recommender Widget Logic
  const recWork = document.getElementById('rec-work');
  const recCost = document.getElementById('rec-cost');
  const recFeature = document.getElementById('rec-feature');
  const recommenderResult = document.getElementById('recommender-result');

  function calculateRecommendation() {
    if (!recWork || !recCost || !recFeature || !recommenderResult) return;
    
    const workVal = recWork.value;
    const featVal = recFeature.value;

    let recId = 'product-antigravity';
    let matchScore = '98%';
    let matchReason = 'ブラウザ自律検証、計画Artifacts、高度な統合開発環境を必要とする場合に最適です。';

    if (workVal === 'knowledge') {
      recId = 'product-claude-cowork';
      matchScore = '96%';
      matchReason = 'ナレッジワーク、定例レポート、チームでのデータ・資料整理に最適です。';
    } else if (featVal === 'github') {
      recId = 'product-copilot-workspace';
      matchScore = '95%';
      matchReason = 'GitHub Issueからの仕様策定・タスク分解・自動PR起草フローに最適です。';
    } else if (featVal === 'browser') {
      recId = 'product-antigravity';
      matchScore = '99%';
      matchReason = '計画Artifactsの生成からブラウザ自律表示・視覚検証までのWeb構築に最も適しています。';
    } else if (workVal === 'autonomous') {
      recId = 'product-devin';
      matchScore = '97%';
      matchReason = 'Issueを指定して完全自律でデバッグ・修正・テストを完遂させたい場合に最適です。';
    } else if (featVal === 'fast') {
      recId = 'product-windsurf';
      matchScore = '96%';
      matchReason = 'Cascadeフローによる超高速マルチファイルリファクタリングに最適です。';
    } else if (workVal === 'spec') {
      recId = 'product-kiro';
      matchScore = '95%';
      matchReason = 'Specs、Steering、Hooksによる明確な仕様駆動開発プロセスに最適です。';
    } else if (featVal === 'ide') {
      recId = 'product-cursor-agent';
      matchScore = '96%';
      matchReason = 'Composerによる複数ファイルの一括自動生成と高速コード補完に最適です。';
    }

    const recCard = document.getElementById(recId);
    if (!recCard) return;

    const recName = recCard.querySelector('.product-name').textContent.trim();
    
    recommenderResult.innerHTML = `
      <div class="result-info">
        <div class="result-title">🎯 診断結果: ${recName}</div>
        <div class="result-desc">${matchReason}</div>
      </div>
      <div class="match-badge">適合度 ${matchScore}</div>
    `;
    recommenderResult.classList.add('show');

    productCards.forEach(c => c.classList.remove('recommended-highlight'));
    recCard.classList.add('recommended-highlight');
    recCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  if (recWork && recCost && recFeature) {
    recWork.addEventListener('change', calculateRecommendation);
    recCost.addEventListener('change', calculateRecommendation);
    recFeature.addEventListener('change', calculateRecommendation);
  }

  // 4. Comparison Selection (Max 2)
  compareButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      const productId = card.id;

      if (selectedProductIds.has(productId)) {
        selectedProductIds.delete(productId);
        btn.setAttribute('aria-pressed', 'false');
        btn.textContent = '比較に追加';
        card.classList.remove('selected');
        hideToast();
      } else {
        if (selectedProductIds.size >= MAX_SELECTION) {
          showToast('比較できる製品は最大2件までです。1件解除してください。');
          return;
        }

        selectedProductIds.add(productId);
        btn.setAttribute('aria-pressed', 'true');
        btn.textContent = '選択中 (追加済み)';
        card.classList.add('selected');
        hideToast();
      }

      updateSummaryPanel();
    });
  });

  if (clearSelectionBtn) {
    clearSelectionBtn.addEventListener('click', () => {
      selectedProductIds.clear();
      compareButtons.forEach(btn => {
        btn.setAttribute('aria-pressed', 'false');
        btn.textContent = '比較に追加';
      });
      productCards.forEach(card => card.classList.remove('selected'));
      hideToast();
      updateSummaryPanel();
    });
  }

  function updateSummaryPanel() {
    const count = selectedProductIds.size;
    summaryCountBadge.textContent = `${count} / ${MAX_SELECTION}`;

    if (count === 0) {
      summaryContentBox.innerHTML = `
        <div class="summary-empty-msg">
          「比較に追加」ボタンを押すと、最大2製品の比較サマリーがここに表示されます。
        </div>
      `;
      if (clearSelectionBtn) clearSelectionBtn.style.display = 'none';
      if (openModalBtn) openModalBtn.style.display = 'none';
      return;
    }

    if (clearSelectionBtn) clearSelectionBtn.style.display = 'inline-block';
    if (openModalBtn) openModalBtn.style.display = 'inline-block';

    let htmlContent = '';
    selectedProductIds.forEach(id => {
      const card = document.getElementById(id);
      const productName = card.querySelector('.product-name').textContent.trim();
      const suitableWork = card.querySelector('.card-text-work').textContent.trim();

      htmlContent += `
        <div class="summary-item">
          <div class="summary-item-name">📌 ${productName}</div>
          <div class="summary-item-work"><strong>向いている仕事:</strong> ${suitableWork}</div>
        </div>
      `;
    });

    summaryContentBox.innerHTML = htmlContent;
  }

  // 5. Modal Dialog Logic
  if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
      renderModalContent();
      modalOverlay.classList.add('show');
      modalOverlay.setAttribute('aria-hidden', 'false');
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('show')) {
      closeModal();
    }
  });

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('show');
    modalOverlay.setAttribute('aria-hidden', 'true');
  }

  function renderModalContent() {
    if (!modalBodyGrid) return;
    let html = '';

    selectedProductIds.forEach(id => {
      const card = document.getElementById(id);
      const name = card.querySelector('.product-name').textContent.trim();
      const docLink = card.querySelector('.official-doc-link') ? card.querySelector('.official-doc-link').outerHTML : '';
      const work = card.querySelector('.card-text-work').textContent.trim();
      const features = card.querySelectorAll('.card-text')[1].textContent.trim();
      const price = card.querySelector('.card-text-price').textContent.trim();
      const quota = card.querySelector('.card-text-quota').textContent.trim();
      const firstTry = card.querySelectorAll('.card-text')[4].textContent.trim();

      html += `
        <div class="modal-col">
          <h4>${name} ${docLink}</h4>
          <div><strong>🎯 向いている仕事:</strong><p>${work}</p></div>
          <div><strong>⚙️ 主な機能:</strong><p>${features}</p></div>
          <div><strong>💳 全料金プラン:</strong><p>${price}</p></div>
          <div><strong>⏱️ クォータ・制限詳細:</strong><p>${quota}</p></div>
          <div><strong>🚀 最初に試すこと:</strong><p>${firstTry}</p></div>
        </div>
      `;
    });

    modalBodyGrid.innerHTML = html;
  }

  // Toast Helpers
  let toastTimer = null;
  function showToast(message) {
    if (!limitToast) return;
    limitToast.textContent = `⚠️ ${message}`;
    limitToast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 4000);
  }

  function hideToast() {
    if (!limitToast) return;
    limitToast.classList.remove('show');
  }
});
