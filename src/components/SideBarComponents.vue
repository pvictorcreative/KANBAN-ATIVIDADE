<template>
  <v-navigation-drawer
    app
    v-model="drawer"
    :rail="rail"
    color="primary"
    elevation="1"
    permanent
  >
    <v-img
      :src="logoKanban"
      :height="rail ? 30 : 50"
      class="mt-3 mb-3"
      @click="rail = !rail"
    />
    <v-list density="comfortable" nav>
      <v-list-item
        prepend-icon="mdi-card-outline"
        title="Boards"
        to="/"
        exact
      />
    </v-list>
  </v-navigation-drawer>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import logoKanban from "@/assets/img/Logo.png";

export default defineComponent({
  name: "SideBarComponents",
  data() {
    return {
      rail: false,
      drawer: true,
      logoKanban,
    };
  },
  methods: {
    toggleDrawer() {
      this.$emit("update:drawer", !this.drawer);
    },
  },
});
</script>
<style scoped></style>
