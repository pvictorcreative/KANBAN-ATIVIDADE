<template>
    <header>
        {{ title }}
    </header>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'HeaderComponents',
    data () {
       return {
        title: "Meu Kanban"
       }
    }
})
</script>
<style scoped></style>