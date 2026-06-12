<script setup>
import { ref, onMounted } from 'vue';
import { fetchPokemon, fetchPokemonDetails } from './data/pokemon';
import TopBar from './components/TopBar.vue';
import Sheet from './components/Sheet.vue';

const sheetRef = ref(null);
const favoritedPokemon = ref([]);
const allPokemon = ref([]);
const searchQuery = ref('');

const FETCH_LIMIT = 1350;

onMounted(async () => {
  const cached = localStorage.getItem('pokemon-list');
  const cachedFavorites = localStorage.getItem('pokemon-favorites');

  allPokemon.value = cached
    ? JSON.parse(cached)
    : await fetchPokemon(FETCH_LIMIT).then((data) => {
      localStorage.setItem('pokemon-list', JSON.stringify(data));
      return data;
    });

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
  const id = Number(pokemonId);
  const index = favoritedPokemon.value.indexOf(id);
  if (index > -1) {
    favoritedPokemon.value.splice(index, 1);
  } else {
    favoritedPokemon.value.push(id);
  }
  localStorage.setItem('pokemon-favorites', JSON.stringify(favoritedPokemon.value));
}
</script>

<template>
  <TopBar :search-query="searchQuery" @search="searchQuery = $event" @clear="searchQuery = ''" />
  <Sheet ref="sheetRef" />
  <main class="mdc-top-app-bar--fixed-adjust">
    <RouterView :all-pokemon="allPokemon" :favorited-pokemon="favoritedPokemon" :search-query="searchQuery"
      @view="handleViewPokemon" @favorite="handleFavoritePokemon" />
  </main>
</template>

<style>
.no-scroll {
  overflow: hidden;
  height: 100vh;
}
</style>