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
      path: '/note/:noteId',
      component: () => import('./components/NoteDetail')
    },
    {
      path: '/trash/:noteId',
      component: () => import('./components/TashDetail')
    }
  ]
})
