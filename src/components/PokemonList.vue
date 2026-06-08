<script setup>
defineProps({
    pokemon: {
        type: Array,
        required: true
    }
});

const emits = defineEmits(['view']);

function getPokemonId(url) {
    return url.split('/').filter(Boolean).pop();
}

function padId(id) {
    return '#' + String(id).padStart(3, '0');
}
</script>

<template>
    <ul class="pokemon-grid">
        <li v-for="item in pokemon" :key="item.name" class="pokemon-card"
            @click="$emit('view', getPokemonId(item.url))">
            <div class="card-img-wrap">
                <img class="card-img"
                    :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(item.url)}.png`"
                    :alt="item.name"
                    @error="e => { if (!e.target.dataset.fallback) { e.target.dataset.fallback = '1'; e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonId(item.url)}.png` } }">
            </div>
            <div class="card-body">
                <p class="card-num">{{ padId(getPokemonId(item.url)) }}</p>
                <p class="card-name">{{ item.name }}</p>
            </div>
        </li>
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
    content: '';
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