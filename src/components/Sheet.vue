<script setup>
import { ref, watch, computed } from 'vue'

const isOpen = ref(false)

// Zorgt ervoor dat scrollen niet meer kan als de sheet open is.
watch(isOpen, (open) => {
  document.body.classList.toggle('no-scroll', open)
})

const pokemon = ref(null)
const pokemonId = ref(null)

function openSheet({ detail, id }) {
  pokemon.value = detail
  pokemonId.value = id
  isOpen.value = true
}

function closeSheet() {
  isOpen.value = false
  // Wacht tot de uitschuif-animatie klaar is voordat we de data wissen.
  setTimeout(() => {
    pokemon.value = null
    pokemonId.value = null
  }, 300)
}

defineExpose({ openSheet, closeSheet })

// Waarde die we tonen als een gegeven ontbreekt.
const EMPTY = '-'

// Afgeleide gegevens uit het pokemon-object.
const types = computed(() => pokemon.value?.types?.map(t => t.type.name) || [])
const stats = computed(() => pokemon.value?.stats || [])
const totalStats = computed(() => stats.value.reduce((sum, s) => sum + s.base_stat, 0))

const height = computed(() => {
  // De API geeft de hoogte in decimeters, wij tonen meters.
  return pokemon.value?.height != null
    ? (pokemon.value.height / 10).toFixed(1) + ' m'
    : EMPTY
})

const weight = computed(() => {
  // De API geeft het gewicht in hectogrammen, wij tonen kilo's.
  return pokemon.value?.weight != null
    ? (pokemon.value.weight / 10).toFixed(1) + ' kg'
    : EMPTY
})

const abilities = computed(() =>
  pokemon.value?.abilities?.map(a => a.ability.name).join(', ') || EMPTY
)

const imageUrl = computed(() =>
  pokemonId.value
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId.value}.png`
    : ''
)

const name = computed(() => pokemon.value?.name || `Pokémon #${pokemonId.value}`)

// De hoogst voorkomende waarde per stat. Hiermee rekenen we de balk uit als
// percentage, zodat de langste balk ongeveer vol is.
const statMax = { hp: 255, attack: 190, defense: 250, 'special-attack': 194, 'special-defense': 250, speed: 200 }
const statLabel = { hp: 'HP', attack: 'Atk', defense: 'Def', 'special-attack': 'Sp.Atk', 'special-defense': 'Sp.Def', speed: 'Spd' }

function statPercent(statName, value) {
  return Math.round((value / (statMax[statName] || 255)) * 100)
}

function statColor(value) {
  if (value >= 100) return '#1D9E75' // goede stats
  if (value >= 60) return '#EF9F27' // gemiddelde stats
  return '#D85A30' // lage stats
}

const typeColors = {
  fire:     { bg: '#FAECE7', text: '#993C1D' },
  water:    { bg: '#E6F1FB', text: '#185FA5' },
  grass:    { bg: '#EAF3DE', text: '#3B6D11' },
  poison:   { bg: '#FBEAF0', text: '#993556' },
  electric: { bg: '#FAEEDA', text: '#854F0B' },
  psychic:  { bg: '#FBEAF0', text: '#72243E' },
  ice:      { bg: '#E6F1FB', text: '#0C447C' },
  dragon:   { bg: '#EEEDFE', text: '#3C3489' },
  dark:     { bg: '#D3D1C7', text: '#2C2C2A' },
  fairy:    { bg: '#FBEAF0', text: '#D4537E' },
  fighting: { bg: '#FAECE7', text: '#712B13' },
  flying:   { bg: '#E6F1FB', text: '#378ADD' },
  ground:   { bg: '#FAEEDA', text: '#633806' },
  rock:     { bg: '#D3D1C7', text: '#5F5E5A' },
  bug:      { bg: '#EAF3DE', text: '#639922' },
  ghost:    { bg: '#EEEDFE', text: '#534AB7' },
  steel:    { bg: '#D3D1C7', text: '#444441' },
  normal:   { bg: '#F1EFE8', text: '#5F5E5A' },
}

function typeStyle(typeName) {
  const c = typeColors[typeName] || { bg: '#F1EFE8', text: '#5F5E5A' }
  return `background:${c.bg}; color:${c.text};`
}
</script>

<template>
  <section class="sheet" :class="{ 'sheet-out-of-view': !isOpen }">

    <header class="sheet-header">
      <button class="close-btn" @click="closeSheet" aria-label="Close">✕</button>
      <span class="pokemon-num" v-if="pokemonId">
        #{{ String(pokemonId).padStart(3, '0') }}
      </span>
    </header>

    <div class="sheet-body">

      <div class="artwork-wrap">
        <img :src="imageUrl" :alt="name" class="artwork" />
      </div>

      <div class="info-panel">

        <h1 class="pokemon-name">{{ name }}</h1>

        <div class="types" v-if="types.length">
          <span v-for="type in types" :key="type" class="type-badge" :style="typeStyle(type)">
            {{ type }}
          </span>
        </div>

        <div class="metrics">
          <div class="metric">
            <span class="metric-label">Height</span>
            <span class="metric-value">{{ height }}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Weight</span>
            <span class="metric-value">{{ weight }}</span>
          </div>
          <div class="metric wide">
            <span class="metric-label">Abilities</span>
            <span class="metric-value capitalize">{{ abilities }}</span>
          </div>
        </div>

        <div class="stats-section">
          <div class="stats-header">
            <span class="section-title">Base stats</span>
            <span class="total-badge">{{ totalStats }} total</span>
          </div>

          <div v-for="stat in stats" :key="stat.stat.name" class="stat-row">
            <span class="stat-name">{{ statLabel[stat.stat.name] || stat.stat.name }}</span>
            <span class="stat-val">{{ stat.base_stat }}</span>
            <div class="stat-bar-bg">
              <div class="stat-bar-fill"
                :style="`width:${statPercent(stat.stat.name, stat.base_stat)}%; background:${statColor(stat.base_stat)}`" />
            </div>
          </div>
        </div>

      </div>
    </div>

  </section>
</template>

<style scoped>
.sheet {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100dvh;
  background: var(--mdc-theme-surface, #fff);
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
  z-index: 30;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sheet-out-of-view {
  transform: translateX(-100%);
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  flex-shrink: 0;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  color: inherit;
  line-height: 1;
}

.pokemon-num {
  font-size: 13px;
  color: #999;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.sheet-body {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.artwork-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f7f7f3;
  padding: 24px 16px 16px;
  flex-shrink: 0;
}

.artwork {
  width: 180px;
  height: 180px;
  object-fit: contain;
}

.info-panel {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pokemon-name {
  font-size: 26px;
  font-weight: 600;
  text-transform: capitalize;
  margin: 0;
  line-height: 1.1;
}

.types {
  display: flex;
  gap: 8px;
}

.type-badge {
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
  padding: 4px 12px;
  border-radius: 999px;
}

.metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.metric {
  background: #f7f7f3;
  border-radius: 10px;
  padding: 10px 12px;
}

.metric.wide {
  grid-column: span 2;
}

.metric-label {
  display: block;
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 3px;
}

.metric-value {
  font-size: 15px;
  font-weight: 500;
}

.capitalize {
  text-transform: capitalize;
}

.stats-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #999;
}

.total-badge {
  font-size: 12px;
  font-weight: 600;
  background: #f0f0eb;
  padding: 3px 10px;
  border-radius: 999px;
  color: #555;
}

.stat-row {
  display: grid;
  grid-template-columns: 60px 32px 1fr;
  align-items: center;
  gap: 8px;
}

.stat-name {
  font-size: 12px;
  color: #888;
  white-space: nowrap;
}

.stat-val {
  font-size: 13px;
  font-weight: 600;
  text-align: right;
}

.stat-bar-bg {
  height: 6px;
  background: #ebebeb;
  border-radius: 999px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}
</style>