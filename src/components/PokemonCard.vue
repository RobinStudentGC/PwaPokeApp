<script setup>
const props = defineProps({
  item: { type: Object, required: true },
  favorited: { type: Object, required: true },
});

const emits = defineEmits(["view", "favorite"]);

function getPokemonId(url) {
  return url
    .split("/")
    .filter((string) => string !== "")
    .pop();
}

function listId(id) {
  return "#" + String(id);
}

const id = getPokemonId(props.item.url);

const pokemonId = Number(id);

function isFavorited() {
  return props.favorited.includes(pokemonId);
}
</script>

<template>
  <li class="pokemon-card" @click="$emit('view', id)">
    <div class="card-img-wrap">
      <span
        class="material-icons fav-icon"
        :class="{ favorited: isFavorited() }"
        @click.stop="$emit('favorite', id)"
      >
        {{ isFavorited() ? "favorite" : "favorite_border" }}
      </span>
      <img
        class="card-img"
        :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`"
        :alt="item.name"
      />
    </div>
    <div class="card-body">
      <p class="card-num">{{ listId(id) }}</p>
      <p class="card-name">{{ item.name }}</p>
    </div>
  </li>
</template>

<style scoped>
.favorited {
  color: red;
}
.fav-icon {
  position: absolute;
  z-index: 2;
  top: 8px;
  right: 8px;
  font-size: 30px;
}
.pokemon-card {
  border-radius: 12px;
  border: 0.5px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  overflow: hidden;
  transition: transform 0.18s ease;
  cursor: pointer;
}
.pokemon-card:hover {
  transform: translateY(-4px);
}
.card-img-wrap {
  background: #f4f4f0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 12px 8px;
  position: relative;
  overflow: hidden;
}
.card-img-wrap::before {
  content: "";
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.06);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.card-img {
  width: 72px;
  height: 72px;
  object-fit: contain;
  image-rendering: pixelated;
  position: relative;
  z-index: 1;
  transition: transform 0.2s ease;
}
.pokemon-card:hover .card-img {
  transform: scale(1.1) translateY(-3px);
}
.card-body {
  padding: 10px 12px 12px;
  border-top: 0.5px solid rgba(0, 0, 0, 0.08);
}
.card-num {
  font-size: 11px;
  color: #999;
  margin: 0 0 2px;
}
.card-name {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  text-transform: capitalize;
  margin: 0;
}
</style>
