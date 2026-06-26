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
      <p
        :class="['btn', sortBy === 'alphabetically' ? 'active' : '']"
        @click="handleSort('alphabetically')"
      >
        ตัวอักษร
        <span v-if="sortBy === 'alphabetically'">
          <i
            v-if="sortOrder === 'asc'"
            class="fa-duotone fa-solid fa-arrow-down-a-z"
          ></i>
          <i v-else class="fa-duotone fa-solid fa-arrow-up-a-z"></i>
        </span>
      </p>
      <p
        :class="['btn', sortBy === 'playtime' ? 'active' : '']"
        @click="handleSort('playtime')"
      >
        เวลาที่ใช้
        <span v-if="sortBy === 'playtime'">
          <i
            v-if="sortOrder === 'asc'"
            class="fa-duotone fa-solid fa-arrow-down-1-9"
          ></i>
          <i v-else class="fa-duotone fa-solid fa-arrow-up-1-9"></i>
        </span>
      </p>
      <p
        :class="['btn', sortBy === 'players' ? 'active' : '']"
        @click="handleSort('players')"
      >
        ผู้เล่น
        <span v-if="sortBy === 'players'">
          <i
            v-if="sortOrder === 'asc'"
            class="fa-duotone fa-solid fa-arrow-down-1-9"
          ></i>
          <i v-else class="fa-duotone fa-solid fa-arrow-up-1-9"></i>
        </span>
      </p>
      <p
        :class="['btn', sortBy === 'played' ? 'active' : '']"
        @click="handleSort('played')"
      >
        เล่นไปแล้ว
        <span v-if="sortBy === 'played'">
          <i
            v-if="sortOrder === 'asc'"
            class="fa-duotone fa-solid fa-arrow-down-1-9"
          ></i>
          <i v-else class="fa-duotone fa-solid fa-arrow-up-1-9"></i>
        </span>
      </p>
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

          <div class="btns">
            <p
              class="btn view"
              @click="
                showModal = true;
                bgID = item.BGG_ID;
              "
            >
              <i class="fa-solid fa-eye"></i>
            </p>
            <p class="btn play" @click="play(item.Id)">
              <i class="fa-solid fa-play"></i>
            </p>
          </div>

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
const sortOrder = ref("asc");

const handleSort = (criteria) => {
  if (sortBy.value === criteria) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = criteria;
    if (criteria === "played" || criteria === "playtime") {
      sortOrder.value = "desc";
    } else {
      sortOrder.value = "asc";
    }
  }
};

const filterDB = computed(() => {
  const multiplier = sortOrder.value === "asc" ? 1 : -1;

  return [...DB.value].sort((a, b) => {
    if (sortBy.value === "alphabetically") {
      const nameA = a.Name || "";
      const nameB = b.Name || "";
      if (nameA < nameB) return -1 * multiplier;
      if (nameA > nameB) return 1 * multiplier;
      return 0;
    } else if (sortBy.value === "played") {
      const playedA = Number(a.Played) || 0;
      const playedB = Number(b.Played) || 0;
      if (playedA < playedB) return -1 * multiplier;
      if (playedA > playedB) return 1 * multiplier;
      return 0;
    } else if (sortBy.value === "playtime") {
      const playtimeA = Number(a.Playtime) || 0;
      const playtimeB = Number(b.Playtime) || 0;
      if (playtimeA < playtimeB) return -1 * multiplier;
      if (playtimeA > playtimeB) return 1 * multiplier;
      return 0;
    } else if (sortBy.value === "players") {
      const playerA = Number(a.Player ? a.Player.split("-")[0] : 0) || 0;
      const playerB = Number(b.Player ? b.Player.split("-")[0] : 0) || 0;
      if (playerA < playerB) return -1 * multiplier;
      if (playerA > playerB) return 1 * multiplier;
      return 0;
    }
    return 0;
  });
});

const play = (id) => {
  axios
    .patch(
      "https://n8n.3xbun.com/webhook/00325598-78e4-4094-ad41-a5faf5778670/bgg-api/play/" +
        id,
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
  box-shadow:
    0 3px 6px rgba(0, 0, 0, 0.16),
    0 3px 6px rgba(0, 0, 0, 0.23);
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
  gap: 0.5em;
  padding: 0.5em 1em 1em;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.sort .btn {
  cursor: pointer;
  background-color: #3f3a60;
  padding: 0.5em 1em;
  border-radius: 0.5em;
  color: white;
  min-width: 7.5em;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3em;
}

.sort .btn.active {
  background-color: #6babfa;
  font-weight: bold;
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

.btns {
  display: flex;
  align-content: center;
  margin: 0.5em;
  border-radius: 0.5em;
  overflow: hidden;
}

.btn {
  width: fit-content;
  padding: 0.5em 1em;
  font-weight: bold;
  cursor: pointer;
}

.view {
  background: #e6e6e6;
}

.play {
  background: #6babfa;
  color: #fff;
}
</style>
