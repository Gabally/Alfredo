<template>
  <div class="card">
    <div class="title">
        {{ name }}
    </div>
    <img @click="viewFullScreen" class="video" :src="still" alt="">
  </div>
</template>

<script>
export default {
  name: 'VideoCard',
  props: {
    name: String,
    still: String,
    src: String
  },
  methods: {
    viewFullScreen() {
      window.location.href = this.src;
    }
  }
}
</script>

<style scoped>
.title {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    margin: 10px;
}
.card {
    display: flex;
    flex-direction: column;
    width: 200px;
    height: 200px;
    margin: 5px;
    padding: 20px;
    padding-bottom: 25px;
    font-size: 25px;
    border-radius: 3px;
    background: url("@/assets/imgs/video-bg.png");
    background-size: cover;
}

.video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
}
</style>
