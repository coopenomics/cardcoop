// src/router/index.js
import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { routes } from 'src/app/providers/routes';

// Helper function to determine router history mode
function getHistoryMode() {
  if (process.env.SERVER) return createMemoryHistory;
  return process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory;
}

// Main route export
export default route(function () {
  const Router = createRouter({
    history: getHistoryMode()(process.env.VUE_ROUTER_BASE),
    routes, // Базовые маршруты
    scrollBehavior(to, from, savedPosition) {
      return savedPosition || { top: 0 };
    },
  });

  return Router;
});
