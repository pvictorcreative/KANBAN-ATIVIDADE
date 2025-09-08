<template>
  <main>
    <KanBanBoardComponenets />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import KanBanBoardComponenets from '@/components/KanBanBoardComponenets.vue';

export default defineComponent({
  name: 'HomePage',
  components: { KanBanBoardComponenets }
});
</script>

<style scoped></style>
