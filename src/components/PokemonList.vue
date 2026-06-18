<script setup>
import PokemonCard from "./PokemonCard.vue";

defineProps({
  pokemon: { type: Array, required: true },
  favorited: { type: Object, required: true },
});

defineEmits(["view", "favorite"]);
</script>

<template>
  <ul class="pokemon-grid">
    <PokemonCard
      v-for="item in pokemon"
      :key="item.name"
      :item="item"
      :favorited="favorited"
      @view="$emit('view', $event)"
      @favorite="$emit('favorite', $event)"
    />
  </ul>
</template>

<style scoped>
.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  padding: 16px;
  list-style: none;
  margin: 0;
  margin-bottom: 64px;
}
</style>
