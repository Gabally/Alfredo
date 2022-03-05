<template>
  <div class="f-center">
      <div class="form">
        <img src="" alt="">
        <input placeholder="Username" class="txt-field" type="text">
        <input placeholder="Password" class="txt-field" type="password">
        <button class="btn b-ok">Login</button>
      </div>
  </div>
</template>

<script>

export default {
  inject: ["isAuthenticated"],
  name: 'LoginView',
}
</script>

<style scoped>
.form {
  margin-top: 40px;
  width: 40%;
}
</style>