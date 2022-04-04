<template>
  <div>
    <banner-top />
    <div class="nav">
      <div @click="gotoConfig()" v-if="isAdmin" v-bind:class="{'tab-active':(selectedTab === 'config')}">Devices Configuration</div>
      <div @click="gotoAccounts()" v-if="isAdmin" v-bind:class="{'tab-active':(selectedTab === 'accounts')}">Account Management</div>
      <div @click="gotoMyAccount()" v-bind:class="{'tab-active':(selectedTab === 'myaccount')}">My Account Info</div>
      <div @click="selectedTab = 'resetpw'" v-bind:class="{'tab-active':(selectedTab === 'resetpw')}">Reset Password</div>
    </div>
    <main>
        <div v-if="selectedTab === 'config'" class="f-center conf-tab" style="flex-direction: column;">
            <v-ace-editor
            v-model:value="config"
            lang="json"
            theme="chrome"
            class="json-editor" />
            <button @click="saveConfig()" class="btn b-ok">
              <img src="@/assets/imgs/icons/save.png" alt="">
            </button>
            <div v-if="confok" class="ok">Configuration saved and reloaded successfully</div>
            <div v-if="conferror" class="error">{{ conferror }}</div>
        </div>
        <div v-if="selectedTab === 'accounts'" class="f-center conf-tab" style="flex-direction: column;">
          <button class="btn b-ok" @click="$router.push({ name: 'newuser' })">
            <img src="@/assets/imgs/icons/newuser.png" alt="">
          </button>
          <user-account @statechange="gotoAccounts()" v-for="account in accounts" :key="account" :name="account.username" :isAdmin="account.isAdmin === 1" :mac="account.phone_mac" :id="account.id" :logins="account.logins" />
        </div>
        <div v-if="selectedTab === 'myaccount'" class="f-center conf-tab" style="flex-direction: column;">
          <div class="form">
            <h2>Account:</h2>
            <img class="pfp" @click="$refs.pfpfile.click()" :src="'/static/profiles/' + ((accountid !== null) ? accountid : 0) + '.jpg'" ref="pfp" @error="loadDefaultPFP()" alt="">
            <input ref="pfpfile" @change="updatePFP" style="display: none;" type="file">
            <div>Username: {{ username }}</div>
            <div>Role: {{ isAdmin ? "Admin User" : "Normal user" }}</div>
            <div>Phone MAC Address: {{ mymac ? mymac : "None" }}</div>
          </div>
        </div>
        <div v-if="selectedTab === 'resetpw'" class="f-center conf-tab" style="flex-direction: column;">
          <div class="f-center">
            <form @submit.prevent="updatePassword()" class="form resetpw">
              <h2 class="padded">Reset Password:</h2>
              <input
                v-model="oldpassword"
                required
                placeholder="Old Password"
                class="txt-field"
                type="password"
              />
              <input
                v-model="newpassword"
                required
                placeholder="New Password"
                class="txt-field"
                type="password"
              />
              <div v-if="pwupdaterror" class="error">
                {{ pwupdaterror }}
              </div>
              <button class="btn b-ok">Reset</button>
            </form>
          </div>
        </div>
    </main>
  </div>
</template>

<script>
import BannerTop from "../components/BannerTop.vue";
import UserAccount from "../components/UserAccount.vue";
import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-chrome";

export default {
  inject: ["getJSON", "postJSON"],
  name: "SettingsView",
  components: {
    BannerTop,
    VAceEditor,
    UserAccount
  },
  data() {
    return {
        selectedTab: "",
        config: "",
        conferror: "",
        confok: false,
        username: null,
        accountid: null,
        accounts: [],
        isAdmin: false,
        mymac: "",
        oldpassword: "",
        newpassword: "",
        pwupdaterror: ""
    }
  },
  async mounted() {
    this.gotoMyAccount();
  },
  methods: {
    async gotoConfig() {
      this.config = JSON.stringify(await this.getJSON("/api/config/raw"), null, 4);
      this.selectedTab = "config";
    },
    async gotoAccounts() {
      this.accounts = await this.getJSON("/api/accounts/all");
      this.selectedTab = "accounts";
    },
    async gotoMyAccount() {
      if (!this.username) {
        let { username, id, is_admin, phone_mac } = await this.getJSON("/api/accounts/my");
        this.username = username;
        this.accountid = id;
        this.isAdmin = is_admin;
        this.mymac = phone_mac;
      }
      this.selectedTab = "myaccount";
    },
    async saveConfig() {
      let { success, error } = await this.postJSON("/api/config/save", {
        config: this.config
      });
      if (success) {
        this.confok = true;
        setTimeout(() => { this.confok = false; }, 5000);
      } else {
        this.conferror = error;
      }
    },
    loadDefaultPFP() {
      this.$refs.pfp.src = `https://avatars.dicebear.com/api/micah/${this.username}.svg`;
    },
    updatePFP(event) {
      const files = event.target.files;
      const fileReader = new FileReader()
      fileReader.addEventListener("load", async () => {
        let { success } = await this.postJSON("/api/accounts/updatepfp", {
          img: fileReader.result
        });
        if (!success) {
          alert("An unknown error occurred while updating the profile picture");
        } else {
          this.$refs.pfp.src = `/static/profiles/${this.accountid}.jpg?time=${Date.now()}`;
        }
      });
      fileReader.readAsDataURL(files[0]);
    },
    async updatePassword() {
      let { success, error } = await this.postJSON("/api/accounts/updatepassword", {
        oldpassword: this.oldpassword,
        password: this.newpassword
      });
      if (success) {
        alert("Password reset successfully");
      } else {
        this.pwupdaterror = error;
        setTimeout(() => { this.pwupdaterror = ""; }, 5000);
      }
    }
  }
};
</script>

<style scoped>
.form * {
  margin: 10px;
  font-size: 22px;
  text-align: center;
}
.conf-tab {
    margin-top: 30px;
}

.btn {
    font-size: 25px;
}

.ok {
  font-size: 16px;
  color: rgb(64, 90, 64);
  background: rgba(88, 224, 88, 0.76);
  border-radius: 10px;
  padding: 10px;
}

.error {
  font-size: 16px;
  background: rgba(173, 59, 59, 0.76);
  border-radius: 10px;
  padding: 10px;
  color: rgb(66, 55, 55);
}

.resetpw {
  width: 100% !important;
}

.json-editor {
  height: 500px;
  width: 80%;
  font-size: 18px;
}

.pfp {
  background: rgb(189, 188, 188);
  border-radius: 50%;
  width: 200px;
  height: 200px;
  border: 4px solid rgb(202, 202, 202);
  cursor: pointer;
  margin: 20px;
  transition: .3s;
  object-fit: cover;
}

.pfp:hover {
  filter: blur(3px);
  -webkit-filter: blur(3px);
}

.pfp:active {
  transform: translateY(3px);
}

.form {
  background: rgb(87, 114, 126);
  width: 45%;
}

@media only screen and (max-width: 500px) {
  .json-editor {
    width: 97%;
    font-size: 14px;
  }
  .form {
    width: 90%;
    padding: 10px;
  }
}
</style>