<template>
  <div class="banner">
    <div @click="toHome">
      Alfredo
    </div>
  </div>
</template>

<script>
export default {
  name: 'BannerTop',
  props: {
  },
  methods: {
    toHome() {
      this.$router.push({ name: "home" });
    }
  }
}
</script>

<style scoped>
.banner {
  background: rgba(101, 157, 231, 0.856);
  padding: 15px;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
}
</style>
