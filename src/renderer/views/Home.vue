<template>
    <div>
        <h1 class="text-2xl font-semibold">RenCer</h1>
        <x-button @click="handleClick()">hájasbré</x-button>
    </div>
</template>

<script setup lang="ts">
function handleClick() {
    console.log("Hájasbré")
}
</script>

<style scoped>

</style>