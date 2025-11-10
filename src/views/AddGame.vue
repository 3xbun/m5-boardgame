<template>
  <div>
    <header>
      <h1><i class="fa-duotone fa-solid fa-game-board"></i> เพิ่มบอร์ดเกม</h1>
      <router-link to="/">
        <p>ดูคอลเลคชั่น</p>
      </router-link>
    </header>

    <div class="search">
      <i class="fa-duotone fa-solid fa-magnifying-glass"></i>
      <input type="text" v-model="searchText" @input="search()" />
    </div>

    <ul v-if="result">
      <li
        v-if="result.length > 0"
        class="searchItem"
        v-for="item in result"
        @click="
          bg = item;
          getBG(item.id);
          result = '';
        "
      >
        <i class="fa-duotone fa-solid fa-chevron-right"></i>
        <span v-if="item.name"> {{ item.name.value }} </span>
        <span v-if="item.yearpublished">
          ({{ item.yearpublished.value }})
        </span>
      </li>
      <li
        class="searchItem"
        v-else
        @click="
          bg = result;
          getBG(result.id);
          result = '';
        "
      >
        <i class="fa-duotone fa-solid fa-chevron-right"></i>
        <span> {{ result.name.value }} </span>
        ({{ result.yearpublished.value }})
      </li>
    </ul>

    <div class="boardgame" v-if="bgData">
      <img :src="bgData.image" />
      <h3>
        <span>
          {{ bgData.name }}
        </span>
        <span v-if="bgData.yearpublished">
          ({{ bgData.yearpublished.value }})
        </span>
        <i
          v-if="isInCollection"
          class="fa-duotone fa-solid fa-circle-check success"
        ></i>
      </h3>
      <div class="stats" v-if="bgData.type">
        <p>
          <i class="fa-duotone fa-solid fa-users"></i> :
          {{
            bgData.minplayers.value === bgData.maxplayers.value
              ? bgData.minplayers.value
              : `${bgData.minplayers.value}-${bgData.maxplayers.value}`
          }}
          คน
        </p>
        <p>
          <i class="fa-duotone fa-regular fa-timer"></i> :
          {{ bgData.playingtime.value }} นาที
        </p>
      </div>
      <div class="control">
        <!-- <input type="text" placeholder="ชื่อเจ้าของ" v-model="owner" />-->
        <div class="btn" @click="addToCollection()">เพิ่มเข้าคอลเลคชั่น</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const searchText = ref("");
const DB = ref([]);
const result = ref("");
const bg = ref("");
const bgData = ref("");

const search = () => {
  axios
    .post("https://n8n.3xbun.com/webhook/bgg-api/search", {
      keyword: searchText.value,
    })
    .then((res) => {
      result.value = res.data[0].items.item;
    });
};

const getBG = (id) => {
  axios
    .post("https://n8n.3xbun.com/webhook/bgg-api/get-bg", { id: id })
    .then((res) => {
      const data = res.data[0].items.item;
      const name = data.name;
      const thaiLang = /[ก-๙]/;

      bgData.value = data;

      if (name.length > 0) {
        bgData.value.name = name.filter((n) => n.type == "primary")[0].value;

        if (name.filter((n) => thaiLang.test(n.value))) {
          bgData.value.name = name.filter((n) =>
            thaiLang.test(n.value)
          )[0].value;
        }
      } else {
        bgData.value.name = name.value;
      }
    });
};

const addToCollection = () => {
  const playtime = bgData.value.playingtime.value;
  const player =
    bgData.value.minplayers.value === bgData.value.maxplayers.value
      ? bgData.value.minplayers.value
      : `${bgData.value.minplayers.value}-${bgData.value.maxplayers.value}`;

  const payload = {
    BGG_ID: bgData.value.id,
    Name: bgData.value.name,
    Image: bgData.value.image,
    Playtime: playtime,
    Player: player,
  };

  axios
    .post("https://n8n.3xbun.com/webhook/bgg-api/add", payload)
    .then((res) => {
      updateDB();
    });
};

const isInCollection = computed(() => {
  if (DB.value.filter((b) => b.BGG_ID == bgData.value.id).length > 0) {
    return true;
  }

  return false;
});

const updateDB = () => {
  axios.get("https://n8n.3xbun.com/webhook/bgg-api/collection").then((res) => {
    DB.value = res.data;
    localStorage.setItem("BoardgameDB", JSON.stringify(res.data));
  });
};

onMounted(() => {
  if (localStorage.getItem("BoardgameDB")) {
    DB.value = JSON.parse(localStorage.getItem("BoardgameDB"));
  }
  updateDB();
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

.search {
  display: flex;
  border: 1px solid black;
  border-radius: 0.5em;
  width: 100%;
  align-items: center;
  gap: 0.5em;
  padding-left: 1em;
}

.search input {
  width: 100%;
  padding: 0.5em 1em;
}

input {
  border: none;
  font-size: inherit;
  font-family: inherit;
}

ul {
  max-height: 20vh;
  overflow: scroll;
  overflow-x: hidden;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  padding: 0.5em 0.5em 0em;
  border-radius: 0.5em;
}

li {
  cursor: pointer;
  font-weight: bold;
  text-align: left;
  margin-bottom: 0.5em;
}

li i {
  margin-right: 0.5em;
}

.boardgame {
  margin-top: 1em;
}

img {
  width: 100%;
}

.control {
  display: flex;
  gap: 1em;
  margin-top: 1em;
  justify-content: space-between;
}

.control input {
  border: 1px solid black;
  border-radius: 0.5em;
  padding: 0.5em 1em;
}

.btn {
  background-color: aquamarine;
  padding: 0.5em 1em;
  border-radius: 0.5em;
  cursor: pointer;
}

.stats {
  display: flex;
  gap: 1em;
}

.success {
  color: #41a04e;
}
</style>
