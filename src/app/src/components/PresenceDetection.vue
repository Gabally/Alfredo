<template>
  <div class="card">
    <h4 class="padded">Presence Detection</h4>
    <div class="row f-center" v-for="p in people" :key="p">
      <div class="title">
        {{ p.name }}
      </div>
      <div v-if="p.present">
        <img src="@/assets/imgs/icons/house.png" alt="">
      </div>
      <div v-else>
        <img src="@/assets/imgs/icons/door-out.png" alt="">
      </div>
    </div>
    <div v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  inject: ["getJSON"],
  name: "PresenceDetection",
  data() {
    return {
      people: [],
      error: ""
    };
  },
  async mounted() {
      let { success, people, error } = await this.getJSON("/api/presence");
      if (success) {
          this.people = people;
      } else {
        this.error = error;
      }
  },
};
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
  flex-direction: column;
  width: 200px;
  margin: 5px;
  padding: 10px;
  border-radius: 3px;
  font-size: 25px;
  background: #777777;
  border: 5px solid #807474;
}
.row {
    width: 100%;
    justify-content: space-evenly;
    margin-top: 5px;
}
</style>
