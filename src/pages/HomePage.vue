<template>
    <main>
      <pre>
        {{ task.title }}
        {{ task.description }}
        {{ task.status }}
      </pre>
    </main>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import TasksApiService from '@/services/tasks/tasks-api-service';
import CardType from '@/types/CardType';

export default defineComponent({
    name: 'HomePage',
    components: {
        
    },
    data() {
        return {
            tasks:[] as CardType [],
            task: {} as CardType
        }
    },
    async created() {
    await TasksApiService.getAll().then((lista: CardType[]) => {
        this.tasks = lista;
        console.table(this.tasks);
        }).catch((error: any) => {
            console.error(`Erro: ${error.message}`)
        }).finally(() => {
            console.log('Requisição finalizada');
        });
    },
watch: {
    async tasks(novoValor) {
            console.log('Id da tarefa' ,novoValor[0].id);

            const tarefa = await TasksApiService.getId(novoValor[0].id);
            this.task = tarefa; 
        }
    },
})
</script>
<style scoped></style>