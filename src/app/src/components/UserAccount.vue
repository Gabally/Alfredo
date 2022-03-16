<template>
  <div class="f-center form user-card" style="flex-direction: column;">
    <div class="profile f-center">
        <img class="pfp" :src="'/static/profiles/' + ((id !== null) ? id : 0) + '.jpg'" ref="pfp" @error="loadDefaultPFP()" alt="">
        <div class="p-data">
          <div>Username: {{ name }}</div>
          <div>Admin: {{ isAdmin ? 'Yes' : 'No' }} </div>
          <div>Phone MAC Address: {{ mac ? mac : 'None' }} </div>
          <button @click="deleteAccount()" class="btn danger">Delete</button>
        </div>
    </div>
    <h3>Logins:</h3>
    <div>
      <div class="f-center" v-for="login in logins" :key="login">
        <div>
          {{ login.device }}
        </div>
        <img class="login-type" v-if="login.isMobile === 1" src="@/assets/imgs/icons/phone.png" alt="">
        <img class="login-type" v-else src="@/assets/imgs/icons/computer.png" alt="">
        <button class="btn danger" @click="deleteLoginToken(login.id)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["deleteReq"],
  name: 'UserAccount',
  props: {
    name: String,
    mac: String,
    isAdmin: Boolean,
    id: Number,
    logins: Array
  },
  methods: {
    toggleState() {
      this.$emit("statechange", !this.state, this.name, this.type);
    },
    loadDefaultPFP() {
        this.$refs.pfp.src = `https://avatars.dicebear.com/api/micah/${this.name}.svg`;
    },
    async deleteLoginToken(id) {
      if (confirm("Are you sure you want to delete the login ?")) {
        let { success } = await this.deleteReq(`/api/accounts/deletelogin/${id}`);
        if (!success) {
          alert("An error occurred while deleting the login token");
        } else {
          this.$emit("statechange");
        }
      }
    },
    async deleteAccount() {
      if (confirm("Are you sure you want to delete this account ?")) {
        let { success } = await this.deleteReq(`/api/deleteaccount/${this.id}`);
        if (!success) {
          alert("An error occurred while deleting the login token");
        } else {
          this.$emit("statechange");
        }
      }
    } 
  }
}
</script>

<style scoped>
.user-card {
  margin-top: 15px;
}
.login-type {
  margin: 10px;
  width: 64px;
  height: 64px;
}
.form {
  flex-direction: row;
}
.pfp {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 50%;
}
.profile {
  align-items: center;
}
.p-data {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}
.p-data > div {
  font-size: 18px;
  margin-top: 10px;
}

.danger {
  background: rgb(204, 59, 59);
}

.danger:hover {
  background: rgb(172, 49, 49);
}

.danger:active {
  background: rgb(155, 42, 42);
}
</style>
