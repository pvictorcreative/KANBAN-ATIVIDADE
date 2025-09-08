<template>
  <v-footer app class="px-4" color="#FBFAFF">
    <div class="text-caption text-medium-emphasis">
      © {{ new Date().getFullYear() }} — Kanban
    </div>
    <v-spacer />
    <div class="text-caption text-medium-emphasis">
      Desenvolvido por Pvictor
    </div>
    <v-spacer />
    <v-btn
      icon
      variant="text"
      href="https://github.com/pvictorcreative"
      target="_blank"
    >
      <v-icon>mdi-github</v-icon>
    </v-btn>
  </v-footer>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FooterComponents",
});
</script>
<style scoped>
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  font-size: 12px;
}
nav a {
  margin-left: 16px;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}
</style>
