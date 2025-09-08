<template>
  <div class="pa-4 pa-md-6">
    <div class="d-flex align-center justify-space-between mb-6 flex-wrap">
      <div
        v-if="!isEditingTitle"
        class="d-flex align-center flex-grow-1 mb-2 mb-md-0"
      >
        <h2 class="font-weight-bold text-h5">{{ boardTitle }}</h2>
        <v-icon class="icon-only ml-2" @click="startEditingTitle">
          mdi-pencil-outline
        </v-icon>
      </div>
      <div v-else class="d-flex align-center flex-grow-1 mb-2 mb-md-0">
        <v-text-field
          v-model="tempBoardTitle"
          variant="underlined"
          density="compact"
          hide-details
          autofocus
          class="font-weight-bold flex-grow-1"
        />
        <v-icon class="icon-only ml-2" color="purple" @click="saveTitle">
          mdi-content-save-outline
        </v-icon>
        <v-icon
          class="icon-only ml-2"
          color="purple"
          @click="cancelEditingTitle"
        >
          mdi-close
        </v-icon>
      </div>
    </div>

    <div class="d-flex flex-column flex-md-row align-center mb-8">
      <v-btn
        color="primary"
        prepend-icon="mdi-filter-variant"
        class="mr-0 mr-md-4 mb-3 mb-md-0 btn-filter"
      >
        Filtrar
      </v-btn>
      <v-text-field
        class="search-input flex-grow-1"
        prepend-inner-icon="mdi-magnify"
        placeholder="Busque por título..."
        variant="outlined"
        hide-details
        density="comfortable"
        v-model="search"
      />
    </div>

    <v-row dense>
      <v-col
        v-for="(col, index) in columns"
        :key="col.key"
        cols="12"
        sm="6"
        md="4"
      >
        <div class="d-flex align-center mb-3">
          <v-chip size="small" class="mr-2" color="secondary">
            {{ index + 1 }}
          </v-chip>
          <h3 class="text-subtitle-1 font-weight-bold">{{ col.title }}</h3>
          <span
            v-if="col.key === 'todo'"
            class="fab-plus"
            @click="openCreateModal(col.key)"
          >
            <v-icon size="22">mdi-plus</v-icon>
          </span>
        </div>

        <draggable
          v-model="statusLists[col.key]"
          group="tasks"
          item-key="id"
          class="d-flex flex-column card-list"
          :data-status="col.key"
          @end="onDragEnd"
        >
          <template #item="{ element }">
            <v-card class="kanban-card pa-4" @click="openViewModal(element)">
              <div class="d-flex justify-space-between align-center">
                <div class="text-subtitle-2 font-weight-bold">
                  {{ element.title }}
                </div>
              </div>

              <div class="mt-2 text-body-2">
                {{ truncate(element.description, 90) }}
              </div>

              <div class="mt-3">
                <v-chip
                  v-for="l in element.labels"
                  :key="l"
                  size="small"
                  class="ma-1 tag"
                >
                  {{ l }}
                </v-chip>
              </div>

              <div class="delete-area">
                <v-icon
                  class="icon-only delete-icon"
                  size="24"
                  @click.stop="askDelete(element)"
                >
                  mdi-trash-can-outline
                </v-icon>
              </div>
            </v-card>
          </template>
        </draggable>
      </v-col>
    </v-row>

    <v-dialog v-model="viewDialog" max-width="600px">
      <v-card class="pa-6">
        <div class="d-flex justify-space-between align-center mb-3">
          <h3 class="text-h6 font-weight-bold">{{ selectedTask?.title }}</h3>
          <v-icon
            class="icon-only"
            size="20"
            @click="openEditModal(selectedTask)"
          >
            mdi-pencil-outline
          </v-icon>
        </div>
        <div class="mb-4">{{ selectedTask?.description }}</div>
        <div>
          <v-chip
            v-for="l in selectedTask?.labels"
            :key="l"
            size="small"
            class="ma-1 tag"
          >
            {{ l }}
          </v-chip>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" max-width="600px">
      <v-card>
        <v-card-title>
          {{ editingTask ? "Editar Atividade" : "Criar Atividade" }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="form.title"
            label="Título"
            variant="outlined"
          />
          <v-textarea
            v-model="form.description"
            label="Descrição"
            variant="outlined"
            rows="4"
          />
          <v-combobox
            v-model="form.labels"
            label="Labels"
            multiple
            variant="outlined"
            chips
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn class="btn-soft" @click="closeEdit">Cancelar</v-btn>
          <v-btn
            class="btn-primary-gradient"
            :disabled="!form.title.trim() || isSaving"
            :loading="isSaving"
            @click="saveTask"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card class="pa-6 text-center">
        <p class="mb-6">Deseja excluir este item?</p>
        <div class="d-flex justify-center">
          <v-btn class="btn-soft mr-2" @click="deleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn class="btn-primary-gradient" @click="confirmDelete">
            Confirmar
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar"
      color="green"
      location="top end"
      timeout="3000"
      variant="flat"
      class="snackbar-success"
    >
      {{ snackbarMessage }}
      <template #actions>
        <v-btn icon @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import draggable from "vuedraggable";
import TasksApiService, {
  CardType,
  StatusKey,
} from "@/services/tasks/tasks-api-service";

export default defineComponent({
  name: "KanbanBoard",
  components: { draggable },
  setup() {
    const tasks = ref<CardType[]>([]);
    const search = ref("");
    const boardTitle = ref("Meu Kanban");
    const tempBoardTitle = ref(boardTitle.value);
    const isEditingTitle = ref(false);

    const viewDialog = ref(false);
    const editDialog = ref(false);
    const deleteDialog = ref(false);

    const selectedTask = ref<CardType | null>(null);
    const editingTask = ref<CardType | null>(null);
    const taskToDelete = ref<CardType | null>(null);

    const snackbar = ref(false);
    const snackbarMessage = ref("");
    const isSaving = ref(false);

    const form = ref<CardType>({
      title: "",
      description: "",
      labels: [],
      status: "todo",
    });

    const columns = [
      { key: "todo", title: "A fazer" },
      { key: "doing", title: "Fazendo" },
      { key: "done", title: "Feito" },
    ];

    const statusLists = computed(() => ({
      todo: tasks.value.filter(
        (t) =>
          t.status === "todo" &&
          t.title.toLowerCase().includes(search.value.toLowerCase())
      ),
      doing: tasks.value.filter(
        (t) =>
          t.status === "doing" &&
          t.title.toLowerCase().includes(search.value.toLowerCase())
      ),
      done: tasks.value.filter(
        (t) =>
          t.status === "done" &&
          t.title.toLowerCase().includes(search.value.toLowerCase())
      ),
    }));

    const truncate = (text: string, length: number) =>
      text.length > length ? text.substring(0, length) + "..." : text;

    const showSnackbar = (message: string) => {
      snackbarMessage.value = message;
      snackbar.value = true;
    };

    const openViewModal = (task: CardType) => {
      selectedTask.value = task;
      viewDialog.value = true;
    };

    const openEditModal = (task: CardType | null) => {
      if (task) {
        editingTask.value = task;
        form.value = { ...task };
      } else {
        editingTask.value = null;
        form.value = { title: "", description: "", labels: [], status: "todo" };
      }
      viewDialog.value = false;
      editDialog.value = true;
    };

    const openCreateModal = (status: StatusKey) => {
      editingTask.value = null;
      form.value = { title: "", description: "", labels: [], status };
      editDialog.value = true;
    };

    const closeEdit = () => {
      editDialog.value = false;
    };

    const saveTask = async () => {
      if (isSaving.value || !form.value.title.trim()) return;
      isSaving.value = true;

      try {
        if (editingTask.value) {
          const updated = await TasksApiService.update(editingTask.value.id!, {
            ...editingTask.value,
            ...form.value,
            updated_at: new Date().toISOString(),
          });

          tasks.value = tasks.value.map((t) =>
            t.id === updated.id ? updated : t
          );

          if (selectedTask.value?.id === updated.id) {
            selectedTask.value = updated;
          }
        } else {
          const created = await TasksApiService.create({
            title: form.value.title,
            description: form.value.description,
            labels: form.value.labels,
            status: form.value.status,
          });
          tasks.value.push(created);
        }

        editDialog.value = false;
        showSnackbar("Ação realizada com sucesso");
      } catch (err) {
        console.error("Erro ao salvar:", err);
      } finally {
        isSaving.value = false;
      }
    };

    const askDelete = (task: CardType) => {
      taskToDelete.value = task;
      deleteDialog.value = true;
    };

    const confirmDelete = async () => {
      if (!taskToDelete.value) return;

      try {
        await TasksApiService.delete(taskToDelete.value.id!);

        tasks.value = tasks.value.filter(
          (t) => t.id !== taskToDelete.value!.id
        );

        if (selectedTask.value?.id === taskToDelete.value.id) {
          selectedTask.value = null;
          viewDialog.value = false;
        }

        deleteDialog.value = false;
        showSnackbar("Item excluído com sucesso");
      } catch (err) {
        console.error("Erro ao excluir:", err);
      }
    };

    const onDragEnd = async (evt: any) => {
      const task: CardType = evt.item._underlying_vm_;
      const newStatus = evt.to.dataset.status as StatusKey;

      if (task && newStatus && task.status !== newStatus) {
        task.status = newStatus;

        await TasksApiService.update(task.id!, {
          ...task,
          status: newStatus,
          updated_at: new Date().toISOString(),
        });

        tasks.value = tasks.value.map((t) =>
          t.id === task.id ? { ...t, status: newStatus } : t
        ) as CardType[];
      }
    };

    const startEditingTitle = () => {
      tempBoardTitle.value = boardTitle.value;
      isEditingTitle.value = true;
    };

    const saveTitle = () => {
      boardTitle.value = tempBoardTitle.value.trim() || boardTitle.value;
      isEditingTitle.value = false;
    };

    const cancelEditingTitle = () => {
      tempBoardTitle.value = boardTitle.value;
      isEditingTitle.value = false;
    };

    (async () => {
      tasks.value = await TasksApiService.getAll();
    })();

    return {
      columns,
      tasks,
      search,
      truncate,
      boardTitle,
      tempBoardTitle,
      isEditingTitle,
      viewDialog,
      editDialog,
      deleteDialog,
      selectedTask,
      editingTask,
      form,
      taskToDelete,
      statusLists,
      snackbar,
      snackbarMessage,
      isSaving,
      openViewModal,
      openEditModal,
      openCreateModal,
      closeEdit,
      saveTask,
      askDelete,
      confirmDelete,
      onDragEnd,
      startEditingTitle,
      saveTitle,
      cancelEditingTitle,
    };
  },
});
</script>

<style scoped>
.kanban-card {
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(17, 24, 39, 0.08);
  background: #fff;
  cursor: grab;
  margin-bottom: 16px;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.delete-area {
  position: absolute;
  bottom: 14px;
  right: 14px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  pointer-events: all;
}

.delete-icon {
  padding: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
}

.tag {
  background: #f1e7ff !important;
  color: #7c3aed !important;
  font-weight: 600 !important;
  border-radius: 9999px !important;
  height: 26px !important;
}

.icon-only {
  color: #9ca3af;
  cursor: pointer;
  transition: 0.15s;
}
.icon-only:hover {
  color: #7c3aed;
}

.fab-plus {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #7c3aed;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 18px rgba(124, 58, 237, 0.25);
  cursor: pointer;
  margin-left: auto;
}

.btn-primary-gradient {
  background: linear-gradient(90deg, #8b5cf6, #7c3aed) !important;
  color: #fff !important;
}
.btn-soft {
  background: #f1e7ff !important;
  color: #7c3aed !important;
}

.btn-filter {
  border-radius: 12px !important;
  padding: 10px 20px !important;
  font-weight: 600;
  min-width: 120px;
}

.v-col {
  padding-left: 12px !important;
  padding-right: 12px !important;
}

.card-list {
  margin-top: 16px;
}

.search-input .v-field {
  border-radius: 12px;
}
.search-input .v-field--variant-outlined .v-field__outline {
  --v-field-border-opacity: 1;
  border-color: #e5e7eb;
}
.search-input .v-field--focused .v-field__outline {
  border-color: #7c3aed;
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.25);
}

@media (max-width: 600px) {
  .kanban-card {
    min-height: 140px;
    margin-bottom: 20px;
  }
  .delete-area {
    bottom: 10px;
    right: 10px;
  }
}
</style>
