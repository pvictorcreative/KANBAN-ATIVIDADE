<template>
    <main>
      <KanBanBoardComponents/>
    </main>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import api from '@/services/interceptor.ts';
import KanBanBoardComponents from '@/components/KanBanBoardComponents.vue';

export default defineComponent({
    name: 'HomePage',
    components: {
        KanBanBoardComponents
    },
    data() {
        return {
            tasks:[]
        }
    };
  },

})
</script>
<style scoped></style>