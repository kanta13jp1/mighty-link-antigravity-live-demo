document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  const cards = [...document.querySelectorAll(".agent-card")];
  const selectButtons = [...document.querySelectorAll(".select-button")];
  const resultCount = document.querySelector("#result-count");
  const selectionCount = document.querySelector("#selection-count");
  const selectionNames = document.querySelector("#selection-names");

  const selectedAgents = new Set();

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

  function renderSelectedItems(selectedCards) {
    if (selectedCards.length === 0) {
      return `<p class="comparison-empty">製品カードの「比較に追加」ボタンを押すと、最大2件まで特徴を並べて比較できます。</p>`;
    }

    return selectedCards
      .map(
        (card) => `
        <div class="selected-product-item">
          <div class="selected-product-header">
            <span class="selected-product-badge">選択中</span>
            <h4 class="selected-product-name">${card.dataset.agent}</h4>
          </div>
          <p class="selected-product-fit"><strong>向いている仕事:</strong> ${card.dataset.fit}</p>
        </div>
      `
      )
      .join("");
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
        <div class="selected-products-grid">
          ${itemsHtml}
        </div>
      `;
    } else {
      selectionNames.innerHTML = `
        <div class="selected-products-grid">
          ${renderSelectedItems(selectedCards)}
        </div>
      `;
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
