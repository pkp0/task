<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTasksStore } from '~/stores/tasks';
import TaskCard from '~/components/tasks/TaskCard.vue';
import Dialog from '~/components/Dialog.vue';
import TaskForm from '~/components/tasks/TaskForm.vue';
import { statusesEnum } from '~/stores/utils';

const tasksStore = useTasksStore();
const statuses = Object.values(statusesEnum);
const draggedTask = ref<Task | null>(null);

const isDialogVisible = ref(false);
const status = ref<string>('');

const tasks = computed(() => tasksStore.tasks);

const closeDialog = () => {
  isDialogVisible.value = false;
};

const filteredTasks = (status: string) => tasks.value.filter(task => task.status === status);

const startDrag = (task: Task) => {
  draggedTask.value = task;
};

const dropTask = (newStatus: string) => {
  if (draggedTask.value) {
    tasksStore.updateTaskStatus(draggedTask.value.id, newStatus as statusesEnum);
    draggedTask.value = null;
  }
};

const addTask = (selectedStatus: string) => {
  isDialogVisible.value = true;
  status.value = selectedStatus;
};
</script>

<template>
  <v-row>
    <v-col
        v-for="status in statuses"
        :key="status"
        cols="12" sm="6" md="4"
    >
      <v-card class="pa-2" outlined>
        <div class="d-flex align-center justify-space-between">
          <v-card-title>{{ status }}</v-card-title>
          <v-card-subtitle>
            <v-btn @click="addTask(status)" color="primary">Add Task</v-btn>
          </v-card-subtitle>
        </div>
        <v-list>
          <v-list-item
              v-for="task in filteredTasks(status)"
              :key="task.id"
              class="task-card"
              :draggable="true"
              @dragstart="startDrag(task)"
              @dragover.prevent
              @drop="dropTask(status)"
          >
            <TaskCard :task="task" />
          </v-list-item>
          <v-list-item
              v-if="filteredTasks(status).length === 0"
              class="drop-placeholder"
              @dragover.prevent
              @drop="dropTask(status)"
          >
            Drop tasks here
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>

  <Dialog
      :isDialogVisible="isDialogVisible"
      dialogTitle="Add Task"
      @onClose="closeDialog"
  >
    <template #form-content="{ closeDialog }">
      <TaskForm @closeDialog="closeDialog" :status="status" />
    </template>
  </Dialog>
</template>

<style scoped>
.task-card {
  cursor: move;
}

.drop-placeholder {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f7f7;
  border: 1px solid #ccc;
  color: #888;
  box-shadow: 0 4px 12px 0 #00000033 inset;
  border-radius: 4px !important;
  margin: 8px 16px;
}
</style>
