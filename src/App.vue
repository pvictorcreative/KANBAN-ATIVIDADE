<template>
  <v-app>
    <SideBarComponents/>
    <v-main>
      <v-container fluid class="py-6">
        <HeaderComponents />
        <router-view />
      </v-container>
    </v-main>
    <FooterComponents />
  </v-app>
  
</template>
  
<script lang="ts">
import FooterComponents from './components/FooterComponents.vue';
import HeaderComponents from './components/HeaderComponents.vue';
import SideBarComponents from './components/SideBarComponents.vue';

export default {
  components: {
    FooterComponents,
    HeaderComponents,
    SideBarComponents
  }
}
</script>


<style lang="scss">
  tml, body, #app {
  height: 100%;
}
body {
  font-family: 'Poppins', sans-serif !important;
}
.v-application {
  background: #f6f7fb;
}
</style>
