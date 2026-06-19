<script setup>
import { ref, onMounted } from "vue";
import { fetchPokemon, fetchPokemonDetails } from "./data/pokemon";
import TopBar from "./components/TopBar.vue";
import Sheet from "./components/Sheet.vue";

const allPokemon = ref([]);
const favoritedPokemon = ref([]);
const searchQuery = ref("");

const sheetOpen = ref(false);
const selectedPokemon = ref(null);
const selectedPokemonId = ref(null);

const FETCH_LIMIT = 1350;

onMounted(async () => {
  // We doen maar 1 call voor de volledige lijst en bewaren die in localStorage.
  // Bij een refresh laden we uit de cache, zodat er geen tweede call nodig is.
  const cachedList = localStorage.getItem("pokemon-list");
  if (cachedList) {
    allPokemon.value = JSON.parse(cachedList);
  } else {
    const data = await fetchPokemon(FETCH_LIMIT);
    allPokemon.value = data;
    localStorage.setItem("pokemon-list", JSON.stringify(data));
  }

  const cachedFavorites = localStorage.getItem("pokemon-favorites");
  if (cachedFavorites) {
    favoritedPokemon.value = JSON.parse(cachedFavorites);
  }
});

async function handleViewPokemon(pokemonId) {
  selectedPokemon.value = await fetchPokemonDetails(pokemonId);
  selectedPokemonId.value = Number(pokemonId);
  sheetOpen.value = true;
}

function handleCloseSheet() {
  sheetOpen.value = false;
  setTimeout(() => {
    selectedPokemon.value = null;
    selectedPokemonId.value = null;
  }, 300);
}

function handleFavoritePokemon(pokemonId) {
  const id = Number(pokemonId);
  const favorites = favoritedPokemon.value;
  const isFavorited = favorites.includes(id);

  if (isFavorited) {
    const index = favorites.indexOf(id);
    favorites.splice(index, 1);
  } else {
    favorites.push(id);
  }

  localStorage.setItem("pokemon-favorites", JSON.stringify(favorites));
}
</script>

<template>
  <TopBar
    :search-query="searchQuery"
    @search="searchQuery = $event"
    @clear="searchQuery = ''"
  />
  <Sheet
    :pokemon="selectedPokemon"
    :pokemon-id="selectedPokemonId"
    :is-open="sheetOpen"
    @close="handleCloseSheet"
  />
  <main class="mdc-top-app-bar--fixed-adjust">
    <RouterView
      :all-pokemon="allPokemon"
      :favorited-pokemon="favoritedPokemon"
      :search-query="searchQuery"
      @view="handleViewPokemon"
      @favorite="handleFavoritePokemon"
    />
  </main>
</template>

<style>
.no-scroll {
  overflow: hidden;
  height: 100vh;
}
</style>
