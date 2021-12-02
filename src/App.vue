<template>
  <router-view :class="`eis-app theme-${$store.state.app.theme || 'default'}`"/>
</template>

<script>
export default {
  name: 'App',
};
</script>
