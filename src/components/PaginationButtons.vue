<script setup>
defineProps({
    currentPage: {
        type: Number,
    },
    pageCount: {
        type: Number,
    }
});

const emits = defineEmits([
    'previous',
    'next'
]);
</script>

<template>
    <div class="buttons">
        <button class="mdc-button mdc-button--raised mdc-button--leading" @click="emits('previous')">
            <span class="mdc-button__ripple"></span>
            <i class="material-icons" aria-hidden="true">arrow_back</i>
        </button>
         <div style="margin: 0 16px;">
             {{ currentPage }} / {{ pageCount }}
         </div>
        <button class="mdc-button mdc-button--raised mdc-button--leading" @click="emits('next')">
            <span class="mdc-button__ripple"></span>
            <i class="material-icons" aria-hidden="true">arrow_forward</i>
        </button>
    </div>
</template>

<style scoped>
.buttons {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0px;
    padding: 16px;
    width: 100%;
    z-index: 20;
    background-color: var(--mdc-theme-surface);
    border-top: 1px solid lightgray;
}
</style>