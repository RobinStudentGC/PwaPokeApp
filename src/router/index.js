import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../view/HomeView.vue"), // ← view not views
    },
    {
      path: "/favorites",
      name: "favorites",
      component: () => import("../view/FavoritesView.vue"), // ← view not views
    },
  ],
});

export default router;
