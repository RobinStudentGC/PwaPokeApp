import { ref, computed, watch } from 'vue';

// Verdeelt een lijst over meerdere pagina's en onthoudt op welke pagina we staan.
// items:   een ref of computed met de volledige (al gefilterde) lijst.
// perPage: hoeveel items er per pagina getoond worden.
export function usePagination(items, perPage) {
  const currentPage = ref(1);

  // Minimaal 1 pagina, ook als de lijst (nog) leeg is.
  const pageCount = computed(() =>
    Math.max(1, Math.ceil(items.value.length / perPage))
  );

  // De items die op de huidige pagina horen.
  const pagedItems = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    return items.value.slice(start, start + perPage);
  });

  // Springt naar een pagina, maar nooit voorbij de eerste of laatste pagina.
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

  // Zodra de lijst van grootte verandert (bijvoorbeeld bij zoeken) beginnen we
  // weer bij pagina 1, zodat we niet op een lege pagina blijven hangen.
  watch(() => items.value.length, () => {
    currentPage.value = 1;
  });

  return { currentPage, pageCount, pagedItems, goToPage, nextPage, previousPage };
}
