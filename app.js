/**
 * AI Agent Learning Hub - Application Logic
 * Interactive Filtering, Product Comparison (Max 2), & Accessibility
 */
document.addEventListener('DOMContentLoaded', () => {
  const MAX_SELECTION = 2;
  const selectedProductIds = setOfSelectedProducts();

  // DOM Elements
  const filterButtons = document.querySelectorAll('.btn-filter');
  const productCards = document.querySelectorAll('.product-card');
  const compareButtons = document.querySelectorAll('.btn-compare');
  const summaryPanel = document.getElementById('comparison-summary');
  const summaryCountBadge = document.getElementById('summary-count-badge');
  const summaryContentBox = document.getElementById('summary-content-box');
  const limitToast = document.getElementById('limit-warning-toast');
  const clearSelectionBtn = document.getElementById('btn-clear-selection');

  function setOfSelectedProducts() {
    return new Set();
  }

  // -------------------------------------------------------------
  // 1. Filtering Logic
  // -------------------------------------------------------------
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedCategory = btn.getAttribute('data-filter');
      
      // Update aria-pressed states on filter buttons
      filterButtons.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');

      // Filter product cards based on data-tags attribute
      productCards.forEach(card => {
        const cardTags = card.getAttribute('data-tags') || '';
        if (selectedCategory === 'すべて' || cardTags.includes(selectedCategory)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // -------------------------------------------------------------
  // 2. Product Comparison Logic (Max 2 Items)
  // -------------------------------------------------------------
  compareButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      const productId = card.id;

      if (selectedProductIds.has(productId)) {
        // Deselect Product
        selectedProductIds.delete(productId);
        btn.setAttribute('aria-pressed', 'false');
        btn.textContent = '比較に追加';
        card.classList.remove('selected');
        hideToast();
      } else {
        // Check Max Selection Limit
        if (selectedProductIds.size >= MAX_SELECTION) {
          showToast('比較できる製品は最大2件までです。1件解除してください。');
          return;
        }

        // Select Product
        selectedProductIds.add(productId);
        btn.setAttribute('aria-pressed', 'true');
        btn.textContent = '選択中 (追加済み)';
        card.classList.add('selected');
        hideToast();
      }

      updateSummaryPanel();
    });
  });

  // Clear Selection Button
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

  // -------------------------------------------------------------
  // 3. Comparison Summary Panel Update (aria-live="polite")
  // -------------------------------------------------------------
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
      return;
    }

    if (clearSelectionBtn) clearSelectionBtn.style.display = 'inline-block';

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

  // -------------------------------------------------------------
  // 4. Toast Notification Helpers
  // -------------------------------------------------------------
  let toastTimer = null;

  function showToast(message) {
    if (!limitToast) return;
    limitToast.textContent = `⚠️ ${message}`;
    limitToast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      hideToast();
    }, 4000);
  }

  function hideToast() {
    if (!limitToast) return;
    limitToast.classList.remove('show');
  }

});
