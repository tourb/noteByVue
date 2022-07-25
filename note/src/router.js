import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('./components/Login')
    },
    {
      path: '/notebooks',
      component: () => import('./components/NotebookList')
    },
    {
      path: '/note',
      component: () => import('./components/NoteDetail')
    },
    {
      path: '/trash',
      component: () => import('./components/TashDetail')
    }
  ]
})
