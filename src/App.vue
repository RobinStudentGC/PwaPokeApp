<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchPokemon, fetchPokemonDetails } from './data/pokemon';
import TopBar from './components/TopBar.vue';
import PokemonList from './components/PokemonList.vue';
import PaginationButtons from './components/PaginationButtons.vue';
import Sheet from './components/Sheet.vue';

const pokemonPaginated = ref([]);
const fetchLimit = 1350;
const paginationLimit = 40;

const currentPage = ref(1);
const pokemonCount = ref(0);
const filteredPokemon = ref([]);
const sheetRef = ref(null);

const pageCount = computed(() =>
  Math.ceil(filteredPokemon.value.length / paginationLimit)
);

let allPokemon = [];

function applySearch(query) {
  currentPage.value = 1;
  if (!query) {
    filteredPokemon.value = allPokemon;
  } else {
    const q = query.toLowerCase();
    filteredPokemon.value = allPokemon.filter((p) =>
      p.name.toLowerCase().includes(q)
    );
  }
  pokemonPaginated.value = filteredPokemon.value.slice(0, paginationLimit);
}

let timer = null;

function updateSearchResults(query) {
  clearTimeout(timer);
  timer = setTimeout(() => applySearch(query), 200);
}

function updatePagination(direction) {
  if (direction === 'previous' && currentPage.value > 1) {
    currentPage.value--;
  } else if (direction === 'next' && currentPage.value < pageCount.value) {
    currentPage.value++;
  }
  const start = (currentPage.value - 1) * paginationLimit;
  pokemonPaginated.value = filteredPokemon.value.slice(start, start + paginationLimit);
}

async function handleViewPokemon(pokemonId) {
  let title = `Pokémon #${pokemonId}`;
  let details = null;
  try {
    details = await fetchPokemonDetails(pokemonId);
    title = details?.name
      ? details.name.charAt(0).toUpperCase() + details.name.slice(1)
      : title;
  } catch (error) {
    console.error('Error fetching Pokémon details:', error);
  }

  sheetRef.value.openSheet({
    pokemonId: pokemonId,
    pokemonDetail: details,
    title: title
  });
}

onMounted(async () => {
  const storageKey = 'pokemon-list';
  const cached = localStorage.getItem(storageKey);

  if (cached) {
    allPokemon = JSON.parse(cached);
    pokemonCount.value = allPokemon.length;
  } else {
    allPokemon = await fetchPokemon(fetchLimit);
    pokemonCount.value = allPokemon.length;
    localStorage.setItem(storageKey, JSON.stringify(allPokemon));
  }

  applySearch('');
});
</script>

<template>
  <TopBar @search="updateSearchResults" @clear="updateSearchResults('')" />
  <PaginationButtons :current-page="currentPage" :page-count="pageCount" @previous="updatePagination('previous')"
    @next="updatePagination('next')" />

  <Sheet ref="sheetRef" />

  <main class="mdc-top-app-bar--fixed-adjust">
    <PokemonList :pokemon="pokemonPaginated" @view="handleViewPokemon" />
  </main>
</template>

<style>
.no-scroll {
  overflow: hidden;
  height: 100vh;
}
</style>