import { ref, computed, watch } from 'vue';

export function usePagination(items, perPage) {
  const currentPage = ref(1);

  const pageCount = computed(() =>
    Math.max(1, Math.ceil(items.value.length / perPage))
  );

  const pagedItems = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    return items.value.slice(start, start + perPage);
  });

  function goToPage(page) {
    const target = Number(page);
    if (target < 1) {
      currentPage.value = 1;
    } else if (target > pageCount.value) {
      currentPage.value = pageCount.value;
    } else {
      currentPage.value = target;
    }
  }

  function nextPage() {
    goToPage(currentPage.value + 1);
  }

  function previousPage() {
    goToPage(currentPage.value - 1);
  }

  
  watch(() => items.value.length, () => {
    currentPage.value = 1;
  });

  return { currentPage, pageCount, pagedItems, goToPage, nextPage, previousPage };
}
