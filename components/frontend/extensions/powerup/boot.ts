import { boot } from 'quasar/wrappers'
import { App } from 'vue'
import { Router } from 'vue-router'

export default boot(({ app, router }: { app: App<Element>; router: Router }) => {
  // Пример инициализации компонента
  // app.component('MyExtensionComponent', () => import('./MyExtensionComponent.vue'))

  // Пример добавления маршрута, если нужно
  // router.addRoute({
  //   path: '/my-extension',
  //   component: () => import('./MyExtensionPage.vue')
  // })

  console.log('Расширение загружено успешно')
})
