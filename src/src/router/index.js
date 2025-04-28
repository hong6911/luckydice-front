import { createRouter, createWebHistory } from 'vue-router'

// 示例路由配置
const routes = [
  {
    path: '/',
    name: 'Game',
    component: () => import('@/views/Game.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router