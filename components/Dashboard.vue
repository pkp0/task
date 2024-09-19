<template>
  <div class="container">
    <Header />
    <TaskList />
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/members/Header.vue';
import TaskList from '~/components/tasks/TaskList.vue';
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  padding: 24px 48px;
  background: #eaeaea;
}
</style>
