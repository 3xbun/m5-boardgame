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

    <div class="sort">
      <p>เรียงตาม: </p>
      <p class="btn" @click="sortBy = 'alphabetically'">ตัวอักษร</p>
      <p class="btn" @click="sortBy = 'playtime'">เวลาเล่น</p>
      <p class="btn" @click="sortBy = 'players'">จำนวนผู้เล่น</p>
    </div>

    <ul class="cards">
      <li v-for="item in filterDB" class="card">
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
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';

const DB = ref([])
const sortBy = ref('playtime')
const filterDB = computed(() => {
  if (sortBy.value === 'alphabetically') {
    return DB.value.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      }

      return 0
    });
  } else if (sortBy.value === 'playtime') {
    return DB.value.sort((a, b) => {
      if (a.playtime < b.playtime) {
        return -1;
      } else if (a.playtime > b.playtime) {
        return 1;
      }

      return 0
    });
  } else if (sortBy.value === 'players') {
    return DB.value.sort((a, b) => {
      if (a.player.split('-')[0] < b.player.split('-')[0]) {
        return -1;
      } else if (a.player.split('-')[0] > b.player.split('-')[0]) {
        return 1;
      }

      return 0
    });
  }

})

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

.sort {
  display: flex;
  gap: 1em;
  padding: .5em 1em 1em;
  align-items: center;
}

.sort .btn {
  cursor: pointer;
  background-color: #3f3a60;
  padding: .5em;
  border-radius: .5em;
  color: white;
}
</style>