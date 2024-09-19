<template>
  <v-form @submit.prevent="submitTask">
    <v-text-field v-model="title" label="Title" required />
    <v-textarea v-model="description" label="Description" />

    <v-select
        v-model="members"
        multiple
        :items="allMembers"
        label="Members"
    />

    <v-select
        v-model="responsible"
        :items="selectedMembers"
        label="Responsible"
    />

    <v-select
        v-model="priority"
        :items="priorityOptions"
        label="Priority"
    />

    <v-btn type="submit">{{ isEdit ? 'Update' : 'Create' }}</v-btn>
  </v-form>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import { useTasksStore } from "~/stores/tasks.ts";
import { useMembersStore } from "~/stores/members.ts";
import {priorityEnum} from "~/stores/utils.ts";

const props = defineProps(['id', 'status']);
const emit = defineEmits(['closeDialog'])

const tasksStore = useTasksStore()
const membersStore = useMembersStore()

const title = ref('');
const description = ref('');
const members = ref([]);
const responsible = ref('');
const priority = ref('');
const status = ref(props.status);

const isEdit = ref(false);
const isSubmitting = ref(false);

const priorityOptions = [priorityEnum.high, priorityEnum.medium, priorityEnum.low];
const allMembers = computed(() =>
    membersStore.members.map(item => ({
      value: item.id,
      title: `${item.firstName} ${item.lastName}`
    }))
);
const selectedMembers = computed(() =>
    members.value.map(memberId => {
      const member = membersStore.member(memberId);
      return member ? { value: member.id, title: `${member.firstName} ${member.lastName}` } : null;
    }).filter(item => item !== null)
);

const setValues = (id) => {
  const task = tasksStore.task(id);

  if (task) {
    title.value = task.title;
    description.value = task.description;
    members.value = task.members;
    responsible.value = task.responsible;
    priority.value = task.priority;
    status.value = task.status;

    isEdit.value = true;
  }
};

const submitTask = () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  const data = {
    title,
    description,
    members,
    responsible,
    priority,
    status,
  };

  if (isEdit.value) {
    tasksStore.updateTask({
      id: props.id,
      ...data
    });
  } else {
    tasksStore.addTask(data);
  }

  emit('closeDialog');
  isSubmitting.value = false;
};

watch(() => props.id, (newValue) => {
  if (newValue) {
    setValues(newValue);
  } else {
    title.value = '';
    description.value = '';
    members.value = [];
    responsible.value = '';
    priority.value = '';

    isEdit.value = false;
  }
}, { immediate: true, deep: true });
watch(selectedMembers, (newSelectedMembers) => {
  const responsibleExists = newSelectedMembers.some(member => member.value === responsible.value);

  if (!responsibleExists) {
    responsible.value = '';
  }
});
</script>
