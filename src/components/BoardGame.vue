<template>
  <div class="modal" v-if="showModal && ready">
    <div class="close" @click="close()">
      <i class="fa-duotone fa-solid fa-xmark-large"></i>
    </div>
    <div class="head">
      <h1>{{ bgData.name }}</h1>
      <p class="year">({{ bgData.yearpublished.value }})</p>
    </div>

    <div class="summary">
      <div class="image">
        <img :src="bgData.image" />
      </div>
      <div class="information">
        <div class="players">
          <i class="fa-duotone fa-solid fa-users"></i>
          <span>
            {{
              bgData.minplayers.value === bgData.maxplayers.value
                ? bgData.minplayers.value
                : `${bgData.minplayers.value} – ${bgData.maxplayers.value}`
            }}
            คน
          </span>
        </div>

        <div class="playtime">
          <i class="fa-duotone fa-regular fa-timer"></i>
          <span>
            {{
              bgData.minplaytime.value === bgData.maxplaytime.value
                ? bgData.minplaytime.value
                : `${bgData.minplaytime.value} – ${bgData.maxplaytime.value}`
            }}
            นาที
          </span>
        </div>

        <div class="age">
          <i class="fa-duotone fa-solid fa-child-reaching"></i>
          <span> {{ bgData.minage.value }}+ ปี </span>
        </div>
      </div>
    </div>

    <a
      target="_blank"
      class="youtube"
      :href="
        'https://www.youtube.com/results?search_query=' +
        bgData.name +
        ' วิธีเล่น'
      "
    >
      <i class="fa-brands fa-youtube"></i>
      <span>ดูวิธีเล่น {{ bgData.name }}</span>
    </a>

    <div class="categories">
      <i class="fa-duotone fa-solid fa-tags"></i>

      <span class="category" v-for="link in categories">
        <span>{{ link.value }}</span>
      </span>
    </div>

    <div class="desc">
      <h3>คำอธิบาย</h3>
      <hr />
      <br />
      <p v-html="bgData.description"></p>
    </div>
    <!-- <div class="delete" @click="delete (bgData.objectid)">นำออกจากคอลเลคชั่น</div> -->
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, inject, onMounted, ref } from "vue";

const bgData = ref({});
const showModal = inject("showModal");
const props = defineProps(["objectid"]);
const ready = ref(false);

const categories = computed(() => {
  const links = bgData.value.link;

  return links.filter(
    (link) =>
      link.type == "boardgamecategory" || link.type == "boardgamemechanic"
  );
});

const close = () => {
  showModal.value = false;
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

        if (name.filter((n) => thaiLang.test(n.value)) == true) {
          bgData.value.name = name.filter((n) =>
            thaiLang.test(n.value)
          )[0].value;
        }
      } else {
        bgData.value.name = name.value;
      }

      ready.value = true;
    });
};

onMounted(() => {
  getBG(props.objectid);
});
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
  margin-top: -0.5em;
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
  padding: 0.5em;
  width: fit-content;
  border-radius: 0.5em;
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
  margin-right: 0.5em;
  width: 1em;
}

.desc {
  text-align: justify;
}

.categories {
  display: flex;
  gap: 0.5em;
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
  border-radius: 0.5em;
  padding: 0 0.5em;
  font-style: italic;
}

.delete {
  width: fit-content;
  margin: auto;
  background-color: #ee636d;
  color: #fff;
  padding: 0.5em 1em;
  border-radius: 0.5em;
  cursor: pointer;
}

.reservation {
  background-color: #6babfa;
  margin: 1em auto;
  padding: 0.5em 1em;
  border-radius: 0.5em;
  color: #fff;
  width: fit-content;
}

.played-btn {
  background: #6babfa;
  width: fit-content;
  padding: 0.5em 1em;
  border-radius: 0.5em;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  margin: 1em auto;
}

.played {
  color: lightgray;
  font-style: italic;
}
</style>
