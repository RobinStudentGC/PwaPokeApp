<script setup>
import { ref, computed, watch } from 'vue';
import PokemonList from '../components/PokemonList.vue';
import PaginationButtons from '../components/PaginationButtons.vue';

const props = defineProps(['allPokemon', 'favoritedPokemon', 'searchQuery']);
const emit = defineEmits(['view', 'favorite']);

const PAGINATION_LIMIT = 40;
const currentPage = ref(1);

function getIdFromUrl(url) {
    const parts = url.split('/').filter(Boolean);
    return Number(parts[parts.length - 1]);
}

const favoritedList = computed(() => {
    const query = props.searchQuery?.toLowerCase();
    return props.allPokemon.filter((pokemon) => {
        const isFavorited = props.favoritedPokemon.includes(getIdFromUrl(pokemon.url));
        const matchesSearch = !query || pokemon.name.toLowerCase().includes(query);
        return isFavorited && matchesSearch;
    });
});

const pageCount = computed(() =>
    Math.ceil(favoritedList.value.length / PAGINATION_LIMIT)
);

const pokemonPaginated = computed(() => {
    const start = (currentPage.value - 1) * PAGINATION_LIMIT;
    return favoritedList.value.slice(start, start + PAGINATION_LIMIT);
});

function updatePagination(direction) {
    if (direction === 'previous' && currentPage.value > 1) currentPage.value--;
    else if (direction === 'next' && currentPage.value < pageCount.value) currentPage.value++;
}

function changePage(pageInput) {
    currentPage.value = Math.min(Math.max(Number(pageInput), 1), pageCount.value);
}

watch([() => props.searchQuery, pageCount], () => { currentPage.value = 1; });
</script>

<template>
    <PaginationButtons
        :current-page="currentPage"
        :page-count="pageCount"
        @previous="updatePagination('previous')"
        @next="updatePagination('next')"
        @change="changePage"
    />
    <div v-if="favoritedList.length === 0" style="padding: 24px; text-align: center;">
        {{ props.searchQuery ? 'No favorites match your search.' : 'No favorites yet!' }}
    </div>
    <PokemonList
        v-else
        :pokemon="pokemonPaginated"
        :favorited="favoritedPokemon"
        @view="$emit('view', $event)"
        @favorite="$emit('favorite', $event)"
    />
</template>