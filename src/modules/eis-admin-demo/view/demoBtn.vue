<template>
<q-btn>{{label}}</q-btn>
</template>

<script>
export default {
  name: 'DemoBtn',
  props: {
    label: { type: String, default: 'Demo' },
  },
};
</script>
