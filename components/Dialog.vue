<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  isDialogVisible: Boolean,
  dialogTitle: {
    type: String,
    default: 'Task Form'
  }
});

const emit = defineEmits(['onClose'])

const emitClose = () => {
  emit('onClose')
}
</script>

<template>
  <v-dialog v-model="props.isDialogVisible" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ props.dialogTitle }}</span>
      </v-card-title>

      <v-card-text>
        <slot name="form-content" :close-dialog="emitClose"/>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="emitClose">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-dialog__content {
  padding: 0;
}
</style>
