<script setup>
import { computed } from "vue";
import PokemonList from "../components/PokemonList.vue";
import PaginationButtons from "../components/PaginationButtons.vue";
import { usePagination } from "../js/usePagination.js";

const props = defineProps(["allPokemon", "favoritedPokemon", "searchQuery"]);
defineEmits(["view", "favorite"]);

const POKEMON_PER_PAGE = 40;

function getId(url) {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

// Houdt alleen de favoriete Pokémon over en past daarbinnen ook de zoekopdracht toe.
const favoritePokemon = computed(() => {
  const query = props.searchQuery?.toLowerCase();
  return props.allPokemon.filter((pokemon) => {
    const isFavorite = props.favoritedPokemon.includes(getId(pokemon.url));
    const matchesSearch = !query || pokemon.name.toLowerCase().includes(query);
    return isFavorite && matchesSearch;
  });
});

const { currentPage, pageCount, pagedItems, nextPage, previousPage, goToPage } =
  usePagination(favoritePokemon, POKEMON_PER_PAGE);
</script>

<template>
  <PaginationButtons
    :current-page="currentPage"
    :page-count="pageCount"
    @previous="previousPage"
    @next="nextPage"
    @change="goToPage"
  />
  <p v-if="favoritePokemon.length === 0" class="empty-message">
    {{ searchQuery ? "No favorites match your search." : "No favorites yet!" }}
  </p>
  <PokemonList
    v-else
    :pokemon="pagedItems"
    :favorited="favoritedPokemon"
    @view="$emit('view', $event)"
    @favorite="$emit('favorite', $event)"
  />
</template>

<style scoped>
.empty-message {
  padding: 24px;
  text-align: center;
}
</style>
