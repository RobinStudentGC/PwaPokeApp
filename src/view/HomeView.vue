<script setup>
import { computed } from 'vue';
import PokemonList from '../components/PokemonList.vue';
import PaginationButtons from '../components/PaginationButtons.vue';
import { usePagination } from '../composables/usePagination';

const props = defineProps(['allPokemon', 'favoritedPokemon', 'searchQuery']);
defineEmits(['view', 'favorite']);

const POKEMON_PER_PAGE = 40;

// Filtert de volledige lijst op de zoekopdracht (zoekt op naam).
const filteredPokemon = computed(() => {
  const query = props.searchQuery?.toLowerCase();
  if (!query) return props.allPokemon;
  return props.allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(query)
  );
});

const { currentPage, pageCount, pagedItems, nextPage, previousPage, goToPage } =
  usePagination(filteredPokemon, POKEMON_PER_PAGE);
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
    :pokemon="pagedItems"
    :favorited="favoritedPokemon"
    @view="$emit('view', $event)"
    @favorite="$emit('favorite', $event)"
  />
</template>
