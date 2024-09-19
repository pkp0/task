<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTasksStore } from '~/stores/tasks';
import { useMembersStore } from '~/stores/members';
import Dialog from '~/components/Dialog.vue';
import TaskForm from '~/components/tasks/TaskForm.vue';
import { priorityEnum } from '~/stores/utils';
import type { Task } from "~/stores/tasks.ts";

const props = defineProps<{
  task: Task;
}>();

const isDialogVisible = ref(false);
const task = ref(props.task);

const tasksStore = useTasksStore();
const membersStore = useMembersStore();

const priorityColor = computed(() => {
  switch (task.value.priority) {
    case priorityEnum.high:
      return 'red';
    case priorityEnum.medium:
      return 'orange';
    default:
      return 'green';
  }
});

const fullName = (id: number) => {
  const member = membersStore.member(id);
  return member ? `${member.firstName} ${member.lastName}` : 'Unknown';
};

const closeDialog = () => {
  isDialogVisible.value = false;
};

const onEdit = () => {
  isDialogVisible.value = true;
};

const onDelete = () => {
  tasksStore.deleteTask(task.value.id);
};

watch(() => props.task, newValue => {
  if (newValue) {
    task.value = newValue;
  }
}, { immediate: true });
</script>

<template>
  <v-card class="task-card pa-4" outlined>
    <div class="d-flex align-center justify-space-between">
      <v-card-title>{{ task.title }}</v-card-title>
      <v-card-subtitle>
        <v-chip class="chip" :color="priorityColor">{{ task.priority }}</v-chip>
      </v-card-subtitle>
    </div>

    <v-card-text>
      <p class="mb-2">{{ task.description }}</p>
      <v-list>
        <v-list-item>
          <v-list-item-title>Responsible:</v-list-item-title>
          <v-list-item-subtitle>
            {{ fullName(task.responsible?.id) }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Members:</v-list-item-title>
          <div class="members">
            <span v-for="(member, index) in task.members" :key="member.id">
              {{ fullName(member.id) }}{{ index < task.members.length - 1 ? ', ' : '.' }}
            </span>
          </div>
        </v-list-item>
      </v-list>
    </v-card-text>

    <div class="d-flex align-center justify-space-between pa-3 pt-0">
      <v-btn color="secondary" @click="onEdit">Edit</v-btn>
      <v-btn class="bg-red-lighten-1" @click="onDelete">Delete</v-btn>
    </div>
  </v-card>

  <Dialog
      :isDialogVisible="isDialogVisible"
      dialogTitle="Edit Task"
      @onClose="closeDialog"
  >
    <template #form-content="{ closeDialog }">
      <TaskForm @closeDialog="closeDialog" :id="task.id" />
    </template>
  </Dialog>
</template>

<style scoped>
.task-card {
  background: #e5f0ff;
  box-shadow: 0 2px 8px 0 #00000033;
  padding: 0 !important;
  margin: 8px 12px;
}

.chip {
  background: white;
}

.members {
  color: #808080;
}
</style>
