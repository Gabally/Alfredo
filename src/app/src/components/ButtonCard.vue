<template>
  <div class="card">
    <div class="title">
      {{ name }}
    </div>
    <button class="push-btn">
    </button>
  </div>
</template>

<script>
export default {
  name: 'ButtonCard',
  props: {
    name: String
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
    -webkit-box-shadow: -1px 0px 12px 0px rgba(141,138,235,1);
    -moz-box-shadow: -1px 0px 12px 0px rgba(141,138,235,1);
    box-shadow: -1px 0px 12px 0px rgba(141,138,235,1);
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 200px;
    margin: 5px;
    padding: 10px;
    border-radius: 3px;
}
.push-btn {
    cursor: pointer;
    background: rgba(50, 134, 230, 0.842);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid rgb(73, 73, 73);
    transition: .1s;
}
.push-btn:hover {
    background: rgba(44, 118, 202, 0.842);
    transform: scale(0.98);
}
.push-btn:active {
    background: rgba(36, 100, 173, 0.842);
    transform: scale(0.95);
}
</style>
