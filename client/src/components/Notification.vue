<template>
  <transition name="toast">
    <div v-if="visible" class="toast-notification" :class="type">
      <p>{{ message }}</p>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'info', // e.g., info, success, error
  },
  duration: {
    type: Number,
    default: 3000,
  },
});

const emit = defineEmits(['close']);

const visible = ref(false);

onMounted(() => {
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
    // Allow time for the fade-out animation before emitting the close event
    setTimeout(() => emit('close'), 500);
  }, props.duration);
});
</script>

<style scoped>
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: #fff;
  font-family: var(--font-family-main);
  font-weight: bold;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast-notification.info {
  background-color: var(--color-accent);
}
.toast-notification.success {
  background-color: #4caf50;
}
.toast-notification.error {
  background-color: #e3342f;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
