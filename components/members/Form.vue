<template>
  <v-form @submit.prevent="submit">
    <v-text-field v-model="firstName" label="First Name" />

    <v-text-field v-model="lastName" label="Last Name" />

    <v-btn type="submit">{{ isEdit ? 'Update' : 'Create' }}</v-btn>
  </v-form>
</template>

<script setup>
import { ref, watchEffect, watch } from 'vue';
import { useMembersStore } from '@/stores/members.ts';

const props = defineProps(['id']);
const emit = defineEmits(['closeDialog']);

const membersStore = useMembersStore();

const firstName = ref('');
const lastName = ref('');

const isEdit = ref(false);
const isSubmitting = ref(false);

const setValues = (id) => {
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

  const data = {
    firstName: firstName.value,
    lastName: lastName.value
  };

  if (isEdit.value) {
    membersStore.updateMember({
      id: props.id,
      ...data
    });
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
}, { immediate: true, deep: true });
</script>
