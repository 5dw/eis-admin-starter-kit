<template>
  <div id="q-app" :class="`theme-${$store.state.app.theme}`">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>
