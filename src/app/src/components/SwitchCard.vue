<template>
  <div class="card">
    <div class="title">
        {{ name }}
    </div>
    <img @click="toggleState()" class="toggle crisp-image" v-if="state" src="../assets/imgs/ui/on_toggle.png" alt="">
    <img @click="toggleState()" class="toggle crisp-image" v-else src="../assets/imgs/ui/off_toggle.png" alt="">
  </div>
</template>

<script>
export default {
  name: 'SwitchCard',
  props: {
    name: String,
    state: Boolean,
    type: String
  },
  methods: {
    toggleState() {
      this.$emit("statechange", !this.state, this.name, this.type);
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
    background: url("@/assets/imgs/card-bg.png");
    background-size: cover;
    font-size: 25px;
}

.toggle {
  width: 64px;
  height: 32px;
  cursor: pointer;
}
</style>
