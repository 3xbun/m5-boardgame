import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from './views/Dashboard.vue';
import AddGame from './views/AddGame.vue';

const routes = [
  { path: '/', component: Dashboard },
  { path: '/dashboard', component: Dashboard },
  { path: '/add', component: AddGame },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
