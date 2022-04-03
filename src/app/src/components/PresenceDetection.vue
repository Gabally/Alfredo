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
  </div>
</template>

<script>
export default {
  inject: ["getJSON"],
  name: "PresenceDetection",
  props: {
    room: String,
  },
  data() {
    return {
      people: [],
    };
  },
  async mounted() {
      let { success, people } = await this.getJSON(`/api/presence/${this.room}`);
      if (success) {
          this.people = people;
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
