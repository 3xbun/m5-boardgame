<template>
  <div class="modal" v-if="showModal">
    <div class="close" @click="close()">
      <i class="fa-duotone fa-solid fa-xmark-large"></i>
    </div>
    <div class=" head">
      <h1>{{ bg.name }}</h1>
      <p class="year">({{ bg.yearpublished }})</p>
    </div>
    <div class="summary">
      <div class="image">
        <img :src="bg.image" />
      </div>
      <div class="information">
        <div class="players">
          <i class="fa-duotone fa-solid fa-users"></i>
          <span>
            {{ bg.minplayers === bg.maxplayers ? bg.minplayers :
              `${bg.minplayers} – ${bg.maxplayers}` }} คน
          </span>
        </div>

        <div class="playtime">
          <i class="fa-duotone fa-regular fa-timer"></i>
          <span>
            {{ bg.minplaytime === bg.maxplaytime ? bg.minplaytime :
              `${bg.minplaytime} – ${bg.maxplaytime}` }} นาที
          </span>
        </div>

        <div class="age">
          <i class="fa-duotone fa-solid fa-child-reaching"></i>
          <span>
            {{ bg.age }}+ ปี
          </span>
        </div>
      </div>
    </div>

    <a target="_blank" class="youtube" :href="'https://www.youtube.com/results?search_query=' + bg.name + ' วิธีเล่น'">
      <i class="fa-brands fa-youtube"></i>
      <span>ดูวิธีเล่น {{ bg.name }}</span>
    </a>

    <div class="categories">
      <i class="fa-duotone fa-solid fa-tags"></i>
      <span class="category" v-for="category in bg.boardgamecategory">{{ category._ }}</span>
    </div>

    <div class="desc">
      <h3>คำอธิบาย</h3>
      <hr>
      <br>
      <p v-html="bg.description"></p>
    </div>
    <!-- <div class="delete" @click="delete (bg.objectid)">นำออกจากคอลเลคชั่น</div> -->
  </div>
</template>

<script setup>
import axios from 'axios';
import { inject, onMounted, ref } from 'vue';

const bg = ref({})
const showModal = inject('showModal')
const props = defineProps(['objectid'])

const close = () => {
  showModal.value = false
}

const getBG = () => {
  axios.get(`https://n8n.3xbun.com/webhook/d188e5a6-029a-4dd6-bd4c-e366a35dce6b/bgg-api/${props.objectid}`).then(res => {
    const data = res.data.boardgames.boardgame
    const name = data.name
    const thaiLang = /[ก-๙]/;

    bg.value = data
    bg.value.name = name._

    if (name.length > 1) {
      name.forEach(n => {
        if (thaiLang.test(n._)) {
          bg.value.name = n._
        } else if (n.primary == 'true') {
          bg.value.name = n._
        } else {
          bg.name = n._
        }
      });
    }
  })
}

onMounted(() => {
  getBG()
}) 
</script>

<style scoped>
.close {
  margin: 0 auto 1em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 2em;
  height: 2em;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.close i {
  margin: 0;
}

.modal {
  max-width: 450px;
  width: 90vw;
  height: 90vh;
  position: fixed;
  background-color: white;
  z-index: 99;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 1em;
  overflow: scroll;
  overflow-x: hidden;
  padding: 1em;
}

.summary {
  display: flex;
  margin: 1em 0;
}

.year {
  font-weight: bold;
  color: lightgray;
  margin-top: -.5em;
}

.image {
  width: 50%;
}

img {
  width: 100%;
  border-radius: 1em;
}

.youtube {
  background-color: #fe0032;
  color: #fff;
  padding: .5em;
  width: fit-content;
  border-radius: .5em;
  cursor: pointer;
  text-decoration: none;
  align-self: center;
}

.information {
  width: 50%;
  display: flex;
  padding-left: 1em;
  flex-direction: column;
  align-items: flex-start;
}

i {
  margin-right: .5em;
  width: 1em;
}

.desc {
  text-align: justify;
}

.categories {
  display: flex;
  gap: .5em;
  flex-wrap: wrap;
  align-items: center;
  margin: 1.5em 0 1em;
}

.categories i {
  margin: 0;
}

.category {
  background-color: lightgrey;
  color: grey;
  border-radius: .5em;
  padding: 0 .5em;
  font-style: italic;
}

.delete {
  width: fit-content;
  margin: auto;
  background-color: #ee636d;
  color: #fff;
  padding: .5em 1em;
  border-radius: .5em;
  cursor: pointer;
}
</style>