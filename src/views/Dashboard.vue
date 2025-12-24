<template>
  <div>
    <header>
      <h1><i class="fa-duotone fa-solid fa-game-board"></i> คอลเลคชั่น</h1>
    </header>

    <BoardGame :objectid="bgID" v-if="showModal" />

    <div class="stats">
      <router-link to="/add">เพิ่มเกม</router-link>
      <p>เกมที่มี: {{ DB.length }}</p>
    </div>

    <p>เรียงตาม</p>
    <div class="sort">
      <p class="btn" @click="sortBy = 'alphabetically'">ตัวอักษร</p>
      <p class="btn" @click="sortBy = 'playtime'">เวลาที่ใช้</p>
      <p class="btn" @click="sortBy = 'players'">ผู้เล่น</p>
      <p class="btn" @click="sortBy = 'played'">เล่นไปแล้ว</p>
    </div>

    <ul class="cards">
      <li v-for="item in filterDB" class="card">
        <img
          :src="item.Image"
          alt=""
          @click="
            showModal = true;
            bgID = item.BGG_ID;
          "
        />
        <div class="information">
          <p
            @click="
              showModal = true;
              bgID = item.BGG_ID;
            "
          >
            <strong>{{ item.Name }}</strong>
          </p>

          <p class="btn" @click="play(item.Id)">เล่น</p>
          <p>
            <i class="fa-duotone fa-solid fa-users"></i> : {{ item.Player }} คน
          </p>
          <p>
            <i class="fa-duotone fa-regular fa-timer"></i> :
            {{ item.Playtime }} นาที
          </p>
          <p>
            <i class="fa-duotone fa-solid fa-gamepad"></i> :
            {{ item.Played }} ครั้ง
          </p>
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
const showModal = ref(false);
provide("showModal", showModal);

const DB = ref([]);
const sortBy = ref("alphabetically");
const filterDB = computed(() => {
  if (sortBy.value === "alphabetically") {
    return DB.value.sort((a, b) => {
      if (a.Name < b.Name) {
        return -1;
      } else if (a.Name > b.Name) {
        return 1;
      }

      return 0;
    });
  } else if (sortBy.value === "played") {
    return DB.value.sort((a, b) => {
      if (a.Played < b.Played) {
        return -1;
      } else if (a.Played > b.Played) {
        return 1;
      }

      return 0;
    });
  } else if (sortBy.value === "playtime") {
    return DB.value.sort((a, b) => {
      if (a.Playtime < b.Playtime) {
        return -1;
      } else if (a.Playtime > b.Playtime) {
        return 1;
      }

      return 0;
    });
  } else if (sortBy.value === "players") {
    return DB.value.sort((a, b) => {
      if (a.Player.split("-")[0] < b.Player.split("-")[0]) {
        return -1;
      } else if (a.Player.split("-")[0] > b.Player.split("-")[0]) {
        return 1;
      }

      return 0;
    });
  }
});

const play = (id) => {
  axios
    .patch(
      "https://n8n.3xbun.com/webhook/00325598-78e4-4094-ad41-a5faf5778670/bgg-api/play/" +
        id
    )
    .then((res) => location.reload());
};

onMounted(() => {
  if (localStorage.getItem("BoardgameDB")) {
    DB.value = JSON.parse(localStorage.getItem("BoardgameDB"));
  }

  axios.get("https://n8n.3xbun.com/webhook/bgg-api/collection").then((res) => {
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

.imgs {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

img {
  cursor: pointer;
  height: 6em;
  width: auto;
  border-radius: 0.5em;
}

.stats {
  display: flex;
  justify-content: space-between;
}

.stats p {
  text-align: right;
}

.stats a {
  color: lightgray;
  text-decoration: underline;
  cursor: pointer;
}

.cards {
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
  width: 100%;
  display: flex;
  /* gap: 0.5em; */
  padding: 0.5em 1em 1em;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.sort .btn {
  cursor: pointer;
  background-color: #3f3a60;
  padding: 0.5em;
  border-radius: 0.5em;
  color: white;
  width: 6em;
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

.information {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.btn {
  background: #6babfa;
  width: fit-content;
  padding: 0.5em 1em;
  border-radius: 0.5em;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  margin: 0.5em;
}
</style>
