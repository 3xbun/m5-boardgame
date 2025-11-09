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
        class="searchItem"
        v-for="item in result"
        @click="
          bg = item;
          result = '';
          // getBG(item.id);
          // bgName = item.name;
        "
      >
        <i class="fa-duotone fa-solid fa-chevron-right"></i>
        <span v-if="item.name"> {{ item.name }} </span>
        <span v-if="item.yearpublished"> ({{ item.yearpublished }}) </span>
        <img v-if="item.image" :src="item.image" />
      </li>
    </ul>

    <div class="boardgame" v-if="bg">
      <img :src="bg.image" />
      <h3>
        <span>
          {{ bg.name }}
        </span>
        <span v-if="bg.yearpublished"> ({{ bg.yearpublished }}) </span>
        <i
          v-if="isInCollection"
          class="fa-duotone fa-solid fa-circle-check success"
        ></i>
      </h3>
      <div class="stats">
        <p>
          <i class="fa-duotone fa-solid fa-users"></i> :
          {{
            bg.minplayers === bg.maxplayers
              ? bg.minplayers
              : `${bg.minplayers}-${bg.maxplayers}`
          }}
          คน
        </p>
        <p>
          <i class="fa-duotone fa-regular fa-timer"></i> :
          {{ bg.playingtime }} นาที
        </p>
      </div>
      <div class="control">
        <!-- <input type="text" placeholder="ชื่อเจ้าของ" v-model="owner" /> -->
        <div class="btn" @click="addToCollection()">เพิ่มเข้าคอลเลคชั่น</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { xml2js } from "xml-js";

const searchText = ref("");
const owner = ref("");
const DB = ref([]);
const result = ref("");
const bg = ref("");
const bgName = ref("");

const search = () => {
  axios
    .post("https://n8n.3xbun.com/webhook/bgg-api/search", {
      keyword: searchText.value,
    })
    .then((res) => {
      result.value = res.data[0].items;
      console.log(result.value);
    });
};

const getBG = (id) => {
  axios
    .post("https://n8n.3xbun.com/webhook/bgg-api/get-bg", { id: id })
    .then((res) => {
      const data = res.data.boardgames.boardgame;
      const name = data.name;
      const thaiLang = /[ก-๙]/;

      bg.value = data;

      if (name.length > 0) {
        name.forEach((n) => {
          if (thaiLang.test(n._)) {
            bg.value.name = n._;
          } else if (n.primary == "true") {
            bg.value.name = n._;
          } else {
            bg.name = n._;
          }
        });
      } else {
        bg.value.name = name._;
      }
    });
};

const addToCollection = () => {
  // const playtime = bg.value.playingtime
  // const player = bg.value.minplayers === bg.value.maxplayers ? bg.value.minplayers : `${bg.value.minplayers}-${bg.value.maxplayers}`

  const payload = {
    BGG_ID: bg.value.id,
    Name: bg.value.name,
  };

  axios
    .post("https://n8n.3xbun.com/webhook/bgg-api/add", payload)
    .then((res) => {
      console.log(res.data);
      // updateDB();
    });
};

const isInCollection = computed(() => {
  if (DB.value.filter((b) => b.ID == bg.value.objectid).length > 0) {
    return true;
  }

  return false;
});

const updateDB = () => {
  axios.get("https://n8n.3xbun.com/webhook/bgg-api").then((res) => {
    DB.value = res.data;
    localStorage.setItem("BoardgameDB", JSON.stringify(res.data));
  });
};

onMounted(() => {
  // if (localStorage.getItem("BoardgameDB")) {
  //   DB.value = JSON.parse(localStorage.getItem("BoardgameDB"));
  // }
  // axios.get("https://n8n.3xbun.com/webhook/bgg-api").then((res) => {
  //   DB.value = res.data;
  //   localStorage.setItem("BoardgameDB", JSON.stringify(res.data));
  // });
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
