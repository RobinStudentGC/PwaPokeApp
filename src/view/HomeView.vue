<script setup>
import { ref, computed, watch } from "vue";
import PokemonList from "../components/PokemonList.vue";
import PaginationButtons from "../components/PaginationButtons.vue";

const props = defineProps(["allPokemon", "favoritedPokemon", "searchQuery"]);
defineEmits(["view", "favorite"]);

const paginationLimit = 40;
const currentPage = ref(1);

// Filtert de volledige lijst op de zoekopdracht (zoekt op naam).
const filteredPokemon = computed(() => {
  const query = props.searchQuery?.toLowerCase();

  if (!query) {
    return props.allPokemon;
  }

  return props.allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(query),
  );
});

const pageCount = computed(() =>
  Math.max(1, Math.ceil(filteredPokemon.value.length / paginationLimit)),
);

const pagedPokemon = computed(() => {
  const start = (currentPage.value - 1) * paginationLimit;
  return filteredPokemon.value.slice(start, start + paginationLimit);
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

watch(() => props.searchQuery, () => {
  currentPage.value = 1;
});
</script>

<template>
  <PaginationButtons
    :current-page="currentPage"
    :page-count="pageCount"
    @previous="previousPage"
    @next="nextPage"
    @change="goToPage"
  />
  <PokemonList
    :pokemon="pagedPokemon"
    :favorited="favoritedPokemon"
    @view="$emit('view', $event)"
    @favorite="$emit('favorite', $event)"
  />
</template>
