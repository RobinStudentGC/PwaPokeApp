<script setup>
import { ref, watch, nextTick } from "vue";

const emit = defineEmits(["search", "clear"]);

const searchMode = ref(false);
const searchQuery = ref("");
const searchInput = ref(null);

watch(searchQuery, (value) => {
  emit("search", value);
});

function openSearch() {
  searchMode.value = true;

  nextTick(() => {
    searchInput.value?.focus();
  });
}

function closeSearch() {
  searchMode.value = false;
  searchQuery.value = "";

  emit("clear");
}

function clearSearch() {
  searchQuery.value = "";

  emit("clear");
}
</script>

<template>
  <header class="mdc-top-app-bar mdc-top-app-bar--fixed">
    <div class="mdc-top-app-bar__row">
      <section
        class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start"
      >
        <button
          v-if="searchMode"
          class="material-icons mdc-icon-button"
          @click="closeSearch"
        >
          arrow_back
        </button>

        <RouterLink v-if="!searchMode" class="mdc-top-app-bar__title" to="/">
          PokeApp
        </RouterLink>

        <form
          v-if="searchMode"
          class="search-form"
          style="display: flex; align-items: center"
          @submit.prevent
        >
          <input
            ref="searchInput"
            v-model="searchQuery"
            class="search-input"
            type="text"
            placeholder="Search Pokémon..."
          />

          <button
            v-if="searchQuery"
            type="button"
            class="material-icons mdc-icon-button"
            @click="clearSearch"
          >
            close
          </button>
        </form>
      </section>

      <section
        class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
      >
        <button
          v-if="!searchMode"
          class="material-icons mdc-icon-button"
          @click="openSearch"
        >
          search
        </button>

        <RouterLink
          v-if="!searchMode"
          class="material-icons mdc-icon-button"
          to="/favorites"
        >
          favorite_border
        </RouterLink>
      </section>
    </div>
  </header>
</template>

<style scoped>
.search-input {
  width: 100%;
  border: none;
  outline: none;
  padding: 8px;
  font-size: 14px;
}

.mdc-top-app-bar__title {
  color: white;
}
</style>
