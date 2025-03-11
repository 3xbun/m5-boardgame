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
      <input type="text" v-model="searchText" @input="search()">
    </div>

    <ul v-if="result">
      <li v-for="item in result" @click="getBG(item._attributes.id); bgName = item.name._attributes.value">
        <span>
          >
        </span>
        <span v-if="item.name">
          {{ item.name._attributes.value }}
        </span>
        <span v-if="item.yearpublished">
          ({{ item.yearpublished._attributes.value }})
        </span>
        <img v-if="item.image" :src="item.image">
      </li>
    </ul>

    <div class="boardgame" v-if="bg">
      <img :src="bg.image">
      <h3>
        <span v-if="bg.name._">
          {{ bg.name._ }}
        </span>
        <span v-else>
          {{bg.name.filter(name => name.primary === 'true')[0]._}}
        </span>
        <span v-if="bg.yearpublished">
          ({{ bg.yearpublished }})
        </span>
        <i v-if="isInCollection" class="fa-duotone fa-solid fa-circle-check success"></i>
      </h3>
      <div class="stats">
        <p><i class="fa-duotone fa-solid fa-users"></i> : {{ bg.minplayers === bg.maxplayers ? bg.minplayers :
          `${bg.minplayers}-${bg.maxplayers}` }} คน</p>
        <p><i class="fa-duotone fa-regular fa-timer"></i> : {{ bg.playingtime }} นาที</p>
      </div>
      <div class="control">
        <input type="text" placeholder="ชื่อเจ้าของ" v-model="owner">
        <div class="btn" @click="addToCollection()">เพิ่มเข้าคอลเลคชั่น</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { xml2js } from 'xml-js';

const searchText = ref('');
const owner = ref('')
const DB = ref([])
const result = ref('')
const bg = ref('')
const bgName = ref('')

const search = () => {
  axios.get(`https://boardgamegeek.com/xmlapi2/search?query=${searchText.value}`).then(res => {
    const r = xml2js(res.data, { compact: true, spaces: 4 }).items.item
    if (!r.length) {
      result.value = [r]
    } else
      result.value = r
  }
  )
}

const getBG = (id) => {
  axios.get(`https://n8n.3xbun.com/webhook/d188e5a6-029a-4dd6-bd4c-e366a35dce6b/bgg-api/${id}`).then(res => {
    bg.value = res.data.boardgames.boardgame
  })
}

const addToCollection = () => {
  const playtime = bg.value.playingtime
  const player = bg.value.minplayers === bg.value.maxplayers ? bg.value.minplayers : `${bg.value.minplayers}-${bg.value.maxplayers}`

  const payload = {
    ID: bg.value.objectid,
    name: bgName.value,
    link: '/boardgame/' + bg.value.objectid,
    image: bg.value.image,
    playtime: playtime,
    player: player,
    owner: owner.value
  }

  axios.post('https://n8n.3xbun.com/webhook/bgg-api/add', payload).then(res => {
    console.log(res.data)
  })
}

const isInCollection = computed(() => {
  if (DB.value.filter(b => b.ID == bg.value.objectid).length > 0) {
    return true
  }

  return false
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

.search {
  display: flex;
  border: 1px solid black;
  border-radius: .5em;
  width: 100%;
  align-items: center;
  gap: .5em;
  padding-left: 1em;
}

.search input {
  width: 100%;
  padding: .5em 1em;
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
  padding: .5em .5em 1em;
  border-radius: .5em;
}

li {
  list-style: none;
  cursor: pointer;
  font-weight: bold;
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
  border-radius: .5em;
  padding: .5em 1em;
}

.btn {
  background-color: aquamarine;
  padding: .5em 1em;
  border-radius: .5em;
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