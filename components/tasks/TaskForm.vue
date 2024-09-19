<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useTasksStore } from '~/stores/tasks';
import { useMembersStore } from '~/stores/members';
import { priorityEnum } from '~/stores/utils';

const props = defineProps<{
  id?: number;
  status?: string;
}>();

const emit = defineEmits<{
  (event: 'closeDialog'): void;
}>();

const tasksStore = useTasksStore();
const membersStore = useMembersStore();

const title = ref('');
const description = ref('');
const members = ref<number[]>([]);
const responsible = ref<number | ''>('');
const priority = ref<priorityEnum>(priorityEnum.low);
const status = ref<string | undefined>(props.status);
const isEdit = ref(false);
const isSubmitting = ref(false);

const priorityOptions = Object.values(priorityEnum);
const allMembers = computed(() =>
    membersStore.members.map(member => ({
      value: member.id,
      title: `${member.firstName} ${member.lastName}`
    }))
);
const selectedMembers = computed(() =>
    members.value.map(memberId => {
      const member = membersStore.member(memberId);
      return member ? {
        value: member.id,
        title: `${member.firstName} ${member.lastName}`
      } : null;
    }).filter((item): item is { value: number; title: string } => item !== null)
);

const setValues = (id: number) => {
  const task = tasksStore.task(id);

  if (task) {
    title.value = task.title;
    description.value = task.description;
    members.value = task.members.map(member => member.id);
    responsible.value = task.responsible.id;
    priority.value = task.priority;
    status.value = task.status;

    isEdit.value = true;
  }
};

const submitTask = () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  const data = {
    title: title.value,
    description: description.value,
    members: members.value.map(memberId => membersStore.member(memberId)!),
    responsible: membersStore.member(responsible.value as number)!,
    priority: priority.value,
    status: status.value!
  };

  if (isEdit.value) {
    tasksStore.updateTask({ id: props.id!, ...data });
  } else {
    tasksStore.addTask(data);
  }

  emit('closeDialog');
  isSubmitting.value = false;
};

watch(() => props.id, newValue => {
  if (newValue) {
    setValues(newValue);
  } else {
    title.value = '';
    description.value = '';
    members.value = [];
    responsible.value = '';
    priority.value = priorityEnum.low;
    isEdit.value = false;
  }
}, { immediate: true });

watch(selectedMembers, newSelectedMembers => {
  if (!newSelectedMembers.some(member => member.value === responsible.value)) {
    responsible.value = '';
  }
});
</script>

<template>
  <v-form @submit.prevent="submitTask">
    <v-text-field v-model="title" label="Title" required />
    <v-textarea v-model="description" label="Description" />
    <v-select v-model="members" multiple :items="allMembers" label="Members" />
    <v-select v-model="responsible" :items="selectedMembers" label="Responsible" />
    <v-select v-model="priority" :items="priorityOptions" label="Priority" />
    <v-btn type="submit">{{ isEdit ? 'Update' : 'Create' }}</v-btn>
  </v-form>
</template>
