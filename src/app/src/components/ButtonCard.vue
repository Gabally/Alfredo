<template>
  <div class="card">
    <div class="title">
      {{ name }}
    </div>
    <img @click="trigger()" class="push-btn crisp-image" v-if="!down" src="../assets/imgs/ui/button_up.png" alt="">
    <img class="push-btn crisp-image" v-show="down" src="../assets/imgs/ui/button_down.png" alt="">
  </div>
</template>

<script>
export default {
  name: 'ButtonCard',
  props: {
    name: String
  },
  data() {
    return {
      down: false
    }
  },
  methods: {
    trigger() {
      this.down = true;
      this.$emit("trigger");
      setTimeout(() => {
        this.down = false;
      }, 200);
    }
  }
}
</script>

<style scoped>
.title {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
}
.card {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 200px;
    height: 40px;
    margin: 5px;
    padding: 10px;
    border-radius: 3px;
    font-size: 25px;
    background: url("@/assets/imgs/card-bg.png");
    background-size: cover;
}
.push-btn {
    cursor: pointer;
    width: 40px;
    height: 40px;
}
</style>
