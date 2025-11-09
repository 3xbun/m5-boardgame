<template>
  <div>
    <header>
      <h1><i class="fa-duotone fa-solid fa-game-board"></i> คอลเลคชั่น</h1>
      <router-link to="/add">
        <p>เพิ่มเกม</p>
      </router-link>
    </header>

    <BoardGame :objectid="bgID" v-if="showModal" />

    <div class="stats">
      <p>เกมที่มี: {{ DB.length }}</p>
    </div>

    <div class="sort">
      <p>เรียงตาม:</p>
      <p class="btn" @click="sortBy = 'alphabetically'">ตัวอักษร</p>
      <p class="btn" @click="sortBy = 'playtime'">เวลาเล่น</p>
      <p class="btn" @click="sortBy = 'players'">จำนวนผู้เล่น</p>
    </div>

    <ul class="cards">
      <li
        v-for="item in DB"
        class="card"
        @click="
          showModal = true;
          bgID = item.ID;
        "
      >
        <!-- <img :src="item.image" alt="" /> -->
        <div class="information">
          <p>
            <strong>{{ item.Name }}</strong>
          </p>
          <!-- <p>
            <i class="fa-duotone fa-solid fa-users"></i> : {{ item.player }} คน
          </p>
          <p>
            <i class="fa-duotone fa-regular fa-timer"></i> :
            {{ item.playtime }} นาที
          </p> -->
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onMounted, provide, ref } from "vue";
import axios from "axios";

import BoardGame from "../components/BoardGame.vue";

const bgID = ref("");
const reservedName = ref("");
const reservedDate = ref("");
const showModal = ref(false);
provide("showModal", showModal);

const DB = ref([]);
const sortBy = ref("alphabetically");
const filterDB = computed(() => {
  if (sortBy.value === "alphabetically") {
    return DB.value.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      }

      return 0;
    });
  } else if (sortBy.value === "playtime") {
    return DB.value.sort((a, b) => {
      if (a.playtime < b.playtime) {
        return -1;
      } else if (a.playtime > b.playtime) {
        return 1;
      }

      return 0;
    });
  } else if (sortBy.value === "players") {
    return DB.value.sort((a, b) => {
      if (a.player.split("-")[0] < b.player.split("-")[0]) {
        return -1;
      } else if (a.player.split("-")[0] > b.player.split("-")[0]) {
        return 1;
      }

      return 0;
    });
  }
});

onMounted(() => {
  if (localStorage.getItem("BoardgameDB")) {
    DB.value = JSON.parse(localStorage.getItem("BoardgameDB"));
  }
  axios
    .get("https://n8n.3xbun.com/webhook-test/bgg-api/collection")
    .then((res) => {
      DB.value = res.data;
      localStorage.setItem("BoardgameDB", JSON.stringify(res.data));
    });
});
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
  margin-bottom: 0.5em;
}

.imgs {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

img {
  height: 6em;
  width: auto;
  border-radius: 0.5em;
}

.stats p {
  text-align: right;
  padding: 0.5em 0;
}

.cards {
  cursor: pointer;
  display: flex;
  gap: 1em;
  justify-content: center;
  flex-wrap: wrap;
}

.card {
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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
  padding: 0.5em 1em 1em;
  align-items: center;
}

.sort .btn {
  cursor: pointer;
  background-color: #3f3a60;
  padding: 0.5em;
  border-radius: 0.5em;
  color: white;
}

.reserved {
  width: 7em;
  position: absolute;
  right: -2em;
  top: 1em;
  transform: rotate(45deg);
  padding: 0 0.5em;
  background-color: #6babfa;
  color: #fff;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
