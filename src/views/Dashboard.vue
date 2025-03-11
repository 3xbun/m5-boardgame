<template>
  <div>
    <header>
      <h1><i class="fa-duotone fa-solid fa-game-board"></i> คอลเลคชั่น</h1>
      <router-link to="/add">
        <p>เพิ่มเกม</p>
      </router-link>
    </header>

    <div class="stats">
      <p>เกมที่มี: {{ DB.length }}</p>
    </div>
    <ul class="cards">
      <li v-for="item in DB" class="card">
        <img :src="item.image" alt="">
        <div class="information">
          <p><strong>{{ item.name }}</strong></p>
          <p><i class="fa-duotone fa-solid fa-users"></i> : {{ item.player }} คน</p>
          <p><i class="fa-duotone fa-regular fa-timer"></i> : {{ item.playtime }} นาที</p>
          <p v-if="item.owner">
            By: {{ item.owner }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

const DB = ref([])

onMounted(() => {
  if (localStorage.getItem("BoardgameDB")) {
    DB.value = JSON.parse(localStorage.getItem("BoardgameDB"))
  }

  axios.get('https://n8n.3xbun.com/webhook/bgg-api').then(res => {
    DB.value = res.data
    localStorage.setItem("BoardgameDB", JSON.stringify(res.data))
  })
})
</script>

<style scoped>
header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

header p {
  color: lightgray;
  text-decoration: underline;
  cursor: pointer;
  margin-bottom: .5em;
}

.imgs {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

img {
  height: 6em;
  width: auto;
  border-radius: .5em;
}

.stats p {
  text-align: right;
  padding: .5em 0;
}

.cards {
  display: flex;
  gap: 1em;
  justify-content: center;
  flex-wrap: wrap;
}

.card {
  padding: 1em 1em;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 1em;
}

li {
  text-align: center;
  list-style: none;
  align-items: center;
  width: 45%;
  gap: 1em;
  justify-content: center;
}
</style>