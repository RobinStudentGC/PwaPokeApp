<script setup>
import { ref, onMounted } from 'vue';
import { fetchPokemon, fetchPokemonDetails } from './data/pokemon';
import TopBar from './components/TopBar.vue';
import Sheet from './components/Sheet.vue';

const homeViewRef = ref(null);
const sheetRef = ref(null);
const favoritedPokemon = ref([]);
const allPokemon = ref([]);
const fetchLimit = 1350;

onMounted(async () => {
  const storageKey = 'pokemon-list';
  const storageKeyFavorites = 'pokemon-favorites';
  const cached = localStorage.getItem(storageKey);
  const cachedFavorites = localStorage.getItem(storageKeyFavorites);

  if (cached) {
    allPokemon.value = JSON.parse(cached);
  } else {
    allPokemon.value = await fetchPokemon(fetchLimit);
    localStorage.setItem(storageKey, JSON.stringify(allPokemon.value));
  }

  if (cachedFavorites) {
    favoritedPokemon.value = JSON.parse(cachedFavorites);
  }
});

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
  sheetRef.value.openSheet({ pokemonId, pokemonDetail: details, title });
}

function handleFavoritePokemon(pokemonId) {
  const favPokemonCopy = [...favoritedPokemon.value];
  const clickedPokemon = favPokemonCopy.indexOf(Number(pokemonId));
  if (clickedPokemon > -1) {
    favPokemonCopy.splice(clickedPokemon, 1);
  } else {
    favPokemonCopy.push(Number(pokemonId));
  }
  favoritedPokemon.value = favPokemonCopy;
  localStorage.setItem('pokemon-favorites', JSON.stringify(favPokemonCopy));
}

function handleSearch(query) {
  homeViewRef.value?.updateSearchResults(query);
}
</script>

<template>
  <TopBar @search="handleSearch" @clear="handleSearch('')" />
  <Sheet ref="sheetRef" />
  <main class="mdc-top-app-bar--fixed-adjust">
    <RouterView ref="homeViewRef" :all-pokemon="allPokemon" :favorited-pokemon="favoritedPokemon"
      @view="handleViewPokemon" @favorite="handleFavoritePokemon" />
  </main>
</template>

<style>
.no-scroll {
  overflow: hidden;
  height: 100vh;
}
</style>