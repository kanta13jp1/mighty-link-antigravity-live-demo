/**
 * AI Agent Learning Hub - Application Logic (9 Products, Exhaustive Pricing & Quotas)
 */
document.addEventListener('DOMContentLoaded', () => {
  const MAX_SELECTION = 2;
  const selectedProductIds = new Set();

  const filterButtons = document.querySelectorAll('.btn-filter');
  const productCards = document.querySelectorAll('.product-card');
  const compareButtons = document.querySelectorAll('.btn-compare');
  const summaryCountBadge = document.getElementById('summary-count-badge');
  const summaryContentBox = document.getElementById('summary-content-box');
  const limitToast = document.getElementById('limit-warning-toast');
  const clearSelectionBtn = document.getElementById('btn-clear-selection');
  const openModalBtn = document.getElementById('btn-open-modal');
  const closeModalBtn = document.getElementById('btn-close-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalBodyGrid = document.getElementById('modal-body-grid');

  // 1. Filter Logic
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedCategory = btn.getAttribute('data-filter');
      
      filterButtons.forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');

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

  // 2. Comparison Logic (Max 2)
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

  // 3. Summary Panel Update
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

  // 4. Modal Dialog Logic
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
      const docLink = card.querySelector('.official-doc-link').outerHTML;
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
