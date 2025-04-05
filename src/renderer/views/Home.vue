<template>
    <div>
        <h1 class="text-2xl font-semibold">Test</h1>
        <x-button @click="handleClick()">Test Button</x-button>
    </div>
</template>

<script setup lang="ts">
function handleClick() {
    console.log("Hello")
}
</script>

<style scoped>

</style>