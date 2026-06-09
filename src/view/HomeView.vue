<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import PokemonList from '../components/PokemonList.vue';
import PaginationButtons from '../components/PaginationButtons.vue';

const props = defineProps(['allPokemon', 'favoritedPokemon']);
const emit = defineEmits(['view', 'favorite', 'search', 'clear']);

const pokemonPaginated = ref([]);
const paginationLimit = 40;
const currentPage = ref(1);
const filteredPokemon = ref([]);

const pageCount = computed(() =>
    Math.ceil(filteredPokemon.value.length / paginationLimit)
);

function applySearch(query) {
    currentPage.value = 1;
    if (!query) {
        filteredPokemon.value = props.allPokemon;
    } else {
        const q = query.toLowerCase();
        filteredPokemon.value = props.allPokemon.filter((p) =>
            p.name.toLowerCase().includes(q)
        );
    }
    pokemonPaginated.value = filteredPokemon.value.slice(0, paginationLimit);
}

let timer = null;
function updateSearchResults(query) {
    clearTimeout(timer);
    timer = setTimeout(() => applySearch(query), 200);
}

function updatePagination(direction) {
    if (direction === 'previous' && currentPage.value > 1) {
        currentPage.value--;
    } else if (direction === 'next' && currentPage.value < pageCount.value) {
        currentPage.value++;
    }
    const start = (currentPage.value - 1) * paginationLimit;
    pokemonPaginated.value = filteredPokemon.value.slice(start, start + paginationLimit);
}

// Re-run search when allPokemon is populated from parent
watch(() => props.allPokemon, (val) => {
    if (val?.length) applySearch('');
}, { immediate: true });

defineExpose({ updateSearchResults });
</script>

<template>
    <PaginationButtons :current-page="currentPage" :page-count="pageCount" @previous="updatePagination('previous')"
        @next="updatePagination('next')" />
    <PokemonList :pokemon="pokemonPaginated" :favorited="favoritedPokemon" @view="$emit('view', $event)"
        @favorite="$emit('favorite', $event)" />
</template>