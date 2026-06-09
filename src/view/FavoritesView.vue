<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import PokemonList from '../components/PokemonList.vue';
import PaginationButtons from '@/components/PaginationButtons.vue';

const props = defineProps(['allPokemon', 'favoritedPokemon']);
const emit = defineEmits(['view', 'favorite']);
const router = useRouter();

const favoritedList = computed(() =>
    props.allPokemon.filter((p) => {
        const id = extractId(p.url);
        return props.favoritedPokemon.has(id);
    })
);

function extractId(url) {
    // PokeAPI urls are like https://pokeapi.co/api/v2/pokemon/1/
    const parts = url.split('/').filter(Boolean);
    return Number(parts[parts.length - 1]);
}
</script>

<template>
    
    <PaginationButtons :current-page="currentPage" :page-count="pageCount" @previous="updatePagination('previous')"
        @next="updatePagination('next')" />
    <div v-if="favoritedList.length === 0s" style="padding: 24px; text-align: center;">
        No favorites yet!
    </div>
    <PokemonList v-else :pokemon="favoritedList" :favorited="favoritedPokemon" @view="$emit('view', $event)"
        @favorite="$emit('favorite', $event)" />
</template>