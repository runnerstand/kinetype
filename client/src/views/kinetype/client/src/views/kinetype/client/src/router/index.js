import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      // This defines the route for our Leaderboard page.
      // When a user goes to the '/leaderboard' URL...
      path: '/leaderboard',
      name: 'leaderboard',
      // ...Vue will render the LeaderboardView component.
      // We use a dynamic import for better performance.
      component: () => import('../views/LeaderboardView.vue')
    },
    // We can add the settings page route here later
    {
      path: '/settings',
      name: 'settings',
      // For now, let's just create a simple placeholder component for settings
      component: () => import('../views/SettingsView.vue') // We will create this file next
    }
  ]
})

export default router
