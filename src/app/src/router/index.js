import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import SettingsView from '../views/SettingsView.vue';
import NewUser from '../views/NewUser.vue';
import EditUser from '../views/EditUser.vue';

const isAuthenticated = ({ next, router }) => {
  if (!window.localStorage.getItem("token")) {
    router.push({ name: "login" });
  }
  return next();
};

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      middleware: [isAuthenticated]
    },
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/settings',
    name: 'settings',
    meta: {
      middleware: [isAuthenticated]
    },
    component: SettingsView
  },
  {
    path: '/newuser',
    name: 'newuser',
    meta: {
      middleware: [isAuthenticated]
    },
    component: NewUser
  },
  {
    path: '/edituser/:id',
    name: 'edituser',
    meta: {
      middleware: [isAuthenticated]
    },
    component: EditUser
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
