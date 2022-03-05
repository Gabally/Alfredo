<template>
  <div class="card">
    <div class="title">
        {{ name }}
    </div>
    <input v-model="state" class="toggle" type="checkbox" />
  </div>
</template>

<script>
export default {
  name: 'SwitchCard',
  props: {
    name: String,
    state: Boolean
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

.toggle {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 62px;
  height: 32px;
  display: inline-block;
  position: relative;
  border-radius: 50px;
  overflow: hidden;
  outline: none;
  border: none;
  cursor: pointer;
  background-color: #707070;
  transition: background-color ease 0.3s;
}

.toggle:before {
  content: "on off";
  display: block;
  position: absolute;
  z-index: 2;
  width: 28px;
  height: 28px;
  background: #fff;
  left: 2px;
  top: 2px;
  border-radius: 50%;
  font: 10px/28px Helvetica;
  text-transform: uppercase;
  font-weight: bold;
  text-indent: -22px;
  word-spacing: 37px;
  color: #fff;
  text-shadow: -1px -1px rgba(0,0,0,0.15);
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  transition: all cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;
}

.toggle:checked {
  background-color: #4CD964;
}

.toggle:checked:before {
  left: 32px;
}
</style>
