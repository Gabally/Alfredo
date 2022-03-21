<template>
  <div class="card" @click="openImage()">
    <img class="capture" :src="`static/doorbell/${img}`" alt="">
    <div>
        Quando: {{ date }}
    </div>
  </div>
</template>

<script>
export default {
  name: "DoorbellEvent",
  props: {
    when: String,
    img: String,
  },
  methods: {
    openImage() {
        let link = document.createElement("a");
        link.href = `static/doorbell/${this.img}`;
        link.click();
    }
  },
  computed: {
      date() {
        let date = new Date(this.when);
        return date.toLocaleString();
      }
  }
}
</script>

<style scoped>
.card {
    width: 60%;
    margin: 5px;
    padding: 20px;
    border-radius: 3px;
    font-size: 22px;
    background: rgb(94, 97, 94);
    text-align: center;
    cursor: pointer;
}
.capture {
    width: 100%;
}

@media only screen and (max-width: 500px) {
    .card {
        width: 90%;
    }
}
</style>
