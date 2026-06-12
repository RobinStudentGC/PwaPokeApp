<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import PokemonList from '../components/PokemonList.vue';
import PaginationButtons from '../components/PaginationButtons.vue';

const props = defineProps(['allPokemon', 'favoritedPokemon']);
const emit = defineEmits(['view', 'favorite']);

const paginationLimit = 40;
const currentPage = ref(1);

function generateId(url) {
    const parts = url.split('/').filter(Boolean);
    return Number(parts[parts.length - 1]);
}

const favoritedList = computed(() =>
    props.allPokemon.filter((p) => props.favoritedPokemon.includes(generateId(p.url)))
);

const pageCount = computed(() =>
    Math.ceil(favoritedList.value.length / paginationLimit)
);

const pokemonPaginated = computed(() => {
    const start = (currentPage.value - 1) * paginationLimit;
    return favoritedList.value.slice(start, start + paginationLimit);
});

function updatePagination(direction) {
    if (direction === 'previous' && currentPage.value > 1) currentPage.value--;
    else if (direction === 'next' && currentPage.value < pageCount.value) currentPage.value++;
}

watch(pageCount, (val) => {
    if (currentPage.value > val) currentPage.value = 1;
});
</script>

<template>
    <PaginationButtons :current-page="currentPage" :page-count="pageCount" @previous="updatePagination('previous')"
        @next="updatePagination('next')" />
    <div v-if="favoritedList.length === 0" style="padding: 24px; text-align: center;">
        No favorites yet!
    </div>
    <PokemonList v-else :pokemon="pokemonPaginated" :favorited="favoritedPokemon" @view="$emit('view', $event)"
        @favorite="$emit('favorite', $event)" />
</template>