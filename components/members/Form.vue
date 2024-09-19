<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { useMembersStore } from '@/stores/members.ts';
import type { Member } from '@/stores/members.ts';

const props = defineProps<{
  id?: number;
}>();
const emit = defineEmits<{
  (event: 'closeDialog'): void;
}>();

const membersStore = useMembersStore();

const firstName = ref<string>('');
const lastName = ref<string>('');

const isEdit = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);

const setValues = (id: number) => {
  const member = membersStore.member(id);

  if (member) {
    firstName.value = member.firstName;
    lastName.value = member.lastName;
    isEdit.value = true;
  }
};

const submit = () => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  const data: Omit<Member, 'id'> = {
    firstName: firstName.value,
    lastName: lastName.value
  };

  if (isEdit.value) {
    membersStore.updateMember({ id: props.id!, ...data });
  } else {
    membersStore.addMember(data);
  }

  emit('closeDialog');
  isSubmitting.value = false;
};

watch(() => props.id, (newValue) => {
  if (newValue) {
    setValues(newValue);
  } else {
    firstName.value = '';
    lastName.value = '';
    isEdit.value = false;
  }
}, { immediate: true });
</script>

<template>
  <v-form @submit.prevent="submit">
    <v-text-field v-model="firstName" label="First Name" />
    <v-text-field v-model="lastName" label="Last Name" />
    <v-btn type="submit">{{ isEdit ? 'Update' : 'Create' }}</v-btn>
  </v-form>
</template>
