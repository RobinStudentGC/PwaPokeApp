<script setup>
import { ref, onMounted } from "vue";
import { fetchPokemon, fetchPokemonDetails } from "./data/pokemon";
import TopBar from "./components/TopBar.vue";
import Sheet from "./components/Sheet.vue";

const sheetRef = ref(null);
const allPokemon = ref([]);
const favoritedPokemon = ref([]);
const searchQuery = ref("");

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
  const detail = await fetchPokemonDetails(pokemonId);
  sheetRef.value.openSheet({ id: pokemonId, detail });
}

function handleFavoritePokemon(pokemonId) {
  const id = Number(pokemonId);
  const favorites = favoritedPokemon.value;
  const index = favorites.indexOf(id);
  if (index === -1) {
    favorites.push(id);
  } else {
    favorites.splice(index, 1);
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
  <Sheet ref="sheetRef" />
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
