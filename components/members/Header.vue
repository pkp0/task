<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMembersStore } from '~/stores/members.ts';
import List from '~/components/members/List.vue';
import Dialog from '~/components/Dialog.vue';
import Form from '~/components/members/Form.vue';

const isListVisible = ref<boolean>(false);
const isFormVisible = ref<boolean>(false);

const membersStore = useMembersStore();
const count = computed<number>(() => membersStore.countMembers);

const showList = () => {
  isListVisible.value = true;
};

const closeList = () => {
  isListVisible.value = false;
};

const showForm = () => {
  isFormVisible.value = true;
};

const closeForm = () => {
  isFormVisible.value = false;
};
</script>

<template>
  <div class="header">
    <span>Members ({{ count }})</span>

    <div class="d-flex align-center gap-3">
      <v-btn class="bg-blue-lighten-4" @click="showForm">Add Member</v-btn>
      <v-btn color="primary" @click="showList">Show List</v-btn>
    </div>
  </div>

  <Dialog
      :isDialogVisible="isListVisible"
      dialogTitle="Members List"
      @onClose="closeList"
  >
    <template #form-content="{ closeDialog }">
      <List />
    </template>
  </Dialog>

  <Dialog
      :isDialogVisible="isFormVisible"
      dialogTitle="Add Member"
      @onClose="closeForm"
  >
    <template #form-content="{ closeDialog }">
      <Form @close-dialog="closeForm" />
    </template>
  </Dialog>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24px;
  font-weight: 700;
  padding: 12px;
  background: #c0c0c0;
  border-radius: 4px;
}

.d-flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.gap-3 {
  gap: 12px;
}
</style>
