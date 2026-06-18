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
      class="mdc-button mdc-button--raised"
      :disabled="props.currentPage <= 1"
      @click="emit('previous')"
    >
      <span class="mdc-button__ripple"></span>
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
      class="mdc-button mdc-button--raised"
      :disabled="props.currentPage >= props.pageCount"
      @click="emit('next')"
    >
      <span class="mdc-button__ripple"></span>
      <i class="material-icons" aria-hidden="true">arrow_forward</i>
    </button>
  </div>
</template>

<style scoped>
.pagination {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--mdc-theme-surface);
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
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
