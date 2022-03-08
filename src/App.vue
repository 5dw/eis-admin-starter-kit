<template>
    <div id="q-app">
      <router-view
        :class="`eis-app theme-${$store.state.app.theme || 'default'}`"
      />
    </div>
</template>

<script>
export default {
  name: 'App',
};
</script>
