<script setup>
import { ref, computed, watch } from "vue";
import PokemonList from "../components/PokemonList.vue";
import PaginationButtons from "../components/PaginationButtons.vue";

const props = defineProps(["allPokemon", "favoritedPokemon", "searchQuery"]);
defineEmits(["view", "favorite"]);

const paginationLimit = 40;
const currentPage = ref(1);

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

const pageCount = computed(() =>
  Math.max(1, Math.ceil(favoritePokemon.value.length / paginationLimit)),
);

const pagedPokemon = computed(() => {
  const start = (currentPage.value - 1) * paginationLimit;
  return favoritePokemon.value.slice(start, start + paginationLimit);
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

// Bij een nieuwe zoekopdracht beginnen we weer bij pagina 1.
watch(
  () => props.searchQuery,
  () => {
    currentPage.value = 1;
  },
);
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
    :pokemon="pagedPokemon"
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
