<script setup>
import { ref, computed, watch } from 'vue';
import PokemonList from '../components/PokemonList.vue';
import PaginationButtons from '../components/PaginationButtons.vue';

const props = defineProps(['allPokemon', 'favoritedPokemon', 'searchQuery']);
const emit = defineEmits(['view', 'favorite']);

const PAGINATION_LIMIT = 40;
const currentPage = ref(1);

const filteredPokemon = computed(() => {
    const query = props.searchQuery?.toLowerCase();
    if (!query) return props.allPokemon;
    return props.allPokemon.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(query)
    );
});

const pageCount = computed(() =>
    Math.ceil(filteredPokemon.value.length / PAGINATION_LIMIT)
);

const pokemonPaginated = computed(() => {
    const start = (currentPage.value - 1) * PAGINATION_LIMIT;
    return filteredPokemon.value.slice(start, start + PAGINATION_LIMIT);
});

function updatePagination(direction) {
    if (direction === 'previous' && currentPage.value > 1) currentPage.value--;
    else if (direction === 'next' && currentPage.value < pageCount.value) currentPage.value++;
}

function changePage(pageInput) {
    currentPage.value = Math.min(Math.max(Number(pageInput), 1), pageCount.value);
}

// Reset to page 1 whenever the search or total pages change
watch([() => props.searchQuery, pageCount], () => { currentPage.value = 1; });
</script>

<template>
    <PaginationButtons :current-page="currentPage" :page-count="pageCount" @previous="updatePagination('previous')"
        @next="updatePagination('next')" @change="changePage" />
    <PokemonList :pokemon="pokemonPaginated" :favorited="favoritedPokemon" @view="$emit('view', $event)"
        @favorite="$emit('favorite', $event)" />
</template>