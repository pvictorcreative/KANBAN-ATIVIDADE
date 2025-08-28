import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'

const routes = [
    {path: '/', component: HomePage, meta: { title: 'Meu Kanban' }},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Global hook para atualizar o title do navegador
router.beforeEach((to, from, next) => {
  const defaultTitle = 'Kanban';
  const maybeTitle = (to.meta as Record<string, unknown>).title;
  document.title = typeof maybeTitle === 'string' ? maybeTitle : defaultTitle;
  next();
});

export default router
