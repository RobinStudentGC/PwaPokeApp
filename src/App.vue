<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { MDCTopAppBar } from '@material/top-app-bar'

const topBar = ref(null)

const searchMode = ref(false)
const searchQuery = ref('')

const searchInput = ref(null)

function updateSearchResults(query) {
  console.log('Live search:', query)

  // Example later:
  // filteredList.value = fullList.value.filter(p =>
  //   p.name.toLowerCase().includes(query.toLowerCase())
  // )
}

// Bekijkt de input veranderingen en roept de live search functie aan.
watch(searchQuery, (newValue) => {
  updateSearchResults(newValue)
})

function openSearch() {
  searchMode.value = true

  nextTick(() => {
    searchInput.value?.focus()
  })
}

function closeSearch() {
  searchMode.value = false
}

function clearSearch() {
  searchQuery.value = ''
}

onMounted(() => {
  if (topBar.value) {
    new MDCTopAppBar(topBar.value)
  }
})
</script>

<template>
  <header ref="topBar" class="mdc-top-app-bar mdc-top-app-bar--fixed">
    <div class="mdc-top-app-bar__row">

      <!-- LEFT SIDE -->
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">

        <button v-if="!searchMode" class="material-icons mdc-icon-button">
          menu
        </button>

        <button v-if="searchMode" class="material-icons mdc-icon-button" @click="closeSearch">
          arrow_back
        </button>

        <span v-if="!searchMode" class="mdc-top-app-bar__title">
          PokeApp
        </span>

        <form v-if="searchMode" class="search-form" style="display:flex; align-items: center; justify-content: center;"
          @submit.prevent="submitSearch">
          <input ref="searchInput" v-model="searchQuery" class="search-input" type="text"
            placeholder="Search Pokémon..." />
          <button v-if="searchQuery" class="material-icons mdc-icon-button" @click="clearSearch">
            close
          </button>
        </form>

      </section>

      <!-- RIGHT SIDE -->
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end">

        <button v-if="!searchMode" class="material-icons mdc-icon-button" @click="openSearch">
          search
        </button>

        <button v-if="!searchMode" class="material-icons mdc-icon-button">
          more_vert
        </button>

      </section>

    </div>
  </header>

  <main class="mdc-top-app-bar--fixed-adjust">
    <ul class="mdc-image-list my-image-list">
      <li class="mdc-image-list__item" style v-for="n in 10" :key="n">
        <div class="mdc-image-list__image-aspect-container">
          <img class="mdc-image-list__image" src="https://static.wikia.nocookie.net/pokemon/images/4/4a/0025Pikachu.png/revision/latest/scale-to-width-down/1000?cb=20260203145744">
        </div>
        <div class="mdc-image-list__supporting">
          <span class="mdc-image-list__label">Pokemon name</span>
        </div>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.mdc-image-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  padding: 10px;
  list-style: none;
  margin: 0;
}

.mdc-image-list__item {
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

.search-wrapper {
  position: relative;
  display: inline-block;
}

.search-dropdown {
  position: absolute;
  top: 100%;
  right: 0;

  margin-top: 8px;
  background: white;

  border-radius: 8px;
  padding: 8px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);

  width: 220px;
  z-index: 1000;
}

.search-input {
  width: 100%;
  border: none;
  outline: none;
  padding: 8px;
  font-size: 14px;
}
</style>
