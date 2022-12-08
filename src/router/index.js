import { createRouter, createWebHistory } from '@ionic/vue-router';
// import TabsPage from '../views/TabsPage.vue'
import HomePage from '../views/HomePage.vue';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  // {
  //   path: '/tabs/',
  //   component: TabsPage,
  //   children: [
  //     {
  //       path: '',
  //       redirect: '/tabs/tab1'
  //     },
  //     {
  //       path: 'tab1',
  //       component: () => import('@/components/SongList.vue')
  //     },
  //     {
  //       path: 'tab2',
  //       component: () => import('@/components/BindAli.vue'),
  //     },
  //     {
  //       path: 'tab3',
  //       component: () => import('@/components/PlayCenter.vue')
  //     }
  //   ]
  // },
  {
    path: '/player',
    component: () => import('@/components/PlayCenter.vue')
  },
  {
    path: '/home',
    component: HomePage,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
