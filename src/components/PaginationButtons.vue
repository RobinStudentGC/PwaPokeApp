<script setup>
const props = defineProps({
  currentPage: { type: Number },
  pageCount: { type: Number },
});

const emit = defineEmits(["previous", "next", "change"]);

function onPageInput(event) {
  const value = Number(event.target.value);

  if (!isNaN(value)) {
    emit("change", value);
  }
}
</script>

<template>
  <div class="pagination">
    <button
      class="pagination__button"
      :disabled="props.currentPage <= 1"
      @click="emit('previous')"
    >
      <i class="material-icons" aria-hidden="true">arrow_back</i>
    </button>

    <div class="pagination__label">
      <span class="pagination__text">Page</span>
      <input
        type="number"
        class="pagination__input"
        min="1"
        :max="props.pageCount"
        :value="props.currentPage"
        @change="onPageInput"
      />
      <span class="pagination__text">of {{ props.pageCount }}</span>
    </div>

    <button
      class="pagination__button"
      :disabled="props.currentPage >= props.pageCount"
      @click="emit('next')"
    >
      <i class="material-icons" aria-hidden="true">arrow_forward</i>
    </button>
  </div>
</template>

<style scoped>
.pagination {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: var(--mdc-theme-surface);
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
}

.pagination__button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 36px;
  flex-shrink: 0;
  border: none;
  border-radius: 10%;
  background-color: var(--mdc-theme-primary, #6200ee);
  color: #fff;
  cursor: pointer;
}

.pagination__button:disabled {
  background-color: rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.38);
  cursor: default;
}

.pagination__button .material-icons {
  font-size: 18px;
}

.pagination__label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.pagination__text {
  color: var(--mdc-theme-on-surface, #555);
}

.pagination__input {
  -moz-appearance: textfield;
  width: 3.5ch;
  padding: 4px 6px;
  font-size: inherit;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.24);
  border-radius: 4px;
  background: var(--mdc-theme-surface);
  color: inherit;
  transition: border-color 0.2s;
}

.pagination__input:focus {
  outline: none;
  border-color: var(--mdc-theme-primary, #6200ee);
}

.pagination__input::-webkit-inner-spin-button,
.pagination__input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>
