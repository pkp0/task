<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMembersStore } from '~/stores/members';
import Dialog from '~/components/Dialog.vue';
import Form from '~/components/members/Form.vue';

const membersStore = useMembersStore();
const members = computed(() => membersStore.members);
const id = ref<number>(0);

const isDialogVisible = ref<boolean>(false);

const closeDialog = () => {
  isDialogVisible.value = false;
};

const onEdit = (itemId: number) => {
  id.value = itemId;
  isDialogVisible.value = true;
};

const onDelete = (itemId: number) => {
  membersStore.deleteMember(itemId);
};
</script>

<template>
  <v-list>
    <v-list-item
        v-for="member in members"
        :key="member.id"
        :draggable="true"
    >
      <div class="member-item">
        <span>{{ member.firstName }} {{ member.lastName }}</span>
        <div class="d-flex align-center gap-3">
          <v-btn color="secondary" @click="onEdit(member.id)">Edit</v-btn>
          <v-btn class="bg-red-lighten-1" @click="onDelete(member.id)">Delete</v-btn>
        </div>
      </div>
    </v-list-item>

    <div v-if="members.length === 0" class="text-center">
      List is empty
    </div>
  </v-list>

  <Dialog
      :isDialogVisible="isDialogVisible"
      dialogTitle="Edit Member"
      @onClose="closeDialog"
  >
    <template #form-content="{ closeDialog }">
      <Form @close-dialog="closeDialog" :id="id" />
    </template>
  </Dialog>
</template>

<style scoped>
.member-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #bdbdbd;
  border-radius: 4px;
  padding: 8px 12px;
  color: #1c1818;
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
