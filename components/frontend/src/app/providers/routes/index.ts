import layout from 'src/pages/_layouts/default.vue';
import index from 'src/pages/index.vue';
import blank from 'src/pages/blank/blank.vue';
import permissionDenied from 'src/pages/_layouts/permissionDenied.vue';
import { SignUpPage } from 'src/pages/Registrator/SignUp';
import { SignInPage } from 'src/pages/Registrator/SignIn';
import { RouteRecordRaw } from 'vue-router';
import { LostKeyPage } from 'src/pages/Registrator/LostKey/ui';
import { ResetKeyPage } from 'src/pages/Registrator/ResetKey';
import { CoopCardPage } from 'src/pages/User/CardPage';
import { markRaw } from 'vue';


const baseRoutes = [
  {
    path: '/',
    component: layout,
    name: 'base',
    children: [
      {
        path: '',
        name: 'index',
        component: index,
      },
      {
        path: '/something-bad',
        name: 'somethingBad',
        component: blank,
      },
      {
        path: '/permission-denied',
        name: 'permissionDenied',
        component: permissionDenied,
      },
      {
        path: ':coopname/auth/signin',
        name: 'signin',
        component: SignInPage,
        children: [],
      },
      {
        path: ':coopname/auth/lost-key',
        name: 'lostkey',
        component: LostKeyPage,
        children: [],
      },
      {
        path: ':coopname/auth/reset-key',
        name: 'resetkey',
        component: ResetKeyPage,
        children: [],
      },
      {
        path: ':coopname/auth/signup',
        name: 'signup',
        component: SignUpPage,
        children: [],
      },

      {
        meta: {
          title: 'Карта пайщика',
          icon: '',
          roles: [],
        },
        path: 'coop-card',
        name: 'coop-card',
        component: markRaw(CoopCardPage),
        children: [],
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: blank,
      },
    ],
  },
];

// const baseRoutes = [
//   {
//     path: '/',
//     component: layout,
//     children: [
//       {
//         path: '',
//         name: 'index',
//         component: index,
//       },

//       //страница кошелька пользователя
//       {
//         path: '/:coopname/home',
//         name: 'home',
//         component: UserHomePage,
//         children: [],
//         meta: {
//           is_desktop_menu: true,
//           title: 'Профиль',
//           icon: 'fa-solid fa-id-card',
//           roles: [],
//         },
//       },

//       //страница управления кооперативом
//       {
//         path: ':coopname/settings',
//         name: 'soviet',
//         component: CoopSettingsPage,
//         meta: {
//           is_desktop_menu: true,
//           title: 'Настройки',
//           icon: 'fa-solid fa-cog',
//           roles: ['chairman', 'member'],
//         },
//       },
//       {
//         path: ':coopname/agenda',
//         name: 'agenda',
//         component: decisions,
//         meta: {
//           is_desktop_menu: true,
//           title: 'Повестка',
//           icon: 'fa-solid fa-check-to-slot',
//           roles: ['chairman', 'member'],
//         },
//       },
//       {
//         path: ':coopname/participants',
//         name: 'participants',
//         component: participants,
//         meta: {
//           is_desktop_menu: true,
//           title: 'Пайщики',
//           icon: 'fa-solid fa-users',
//           roles: ['chairman', 'member'],
//         },
//       },
//       {
//         path: ':coopname/documents',
//         name: 'documents',
//         component: documents,
//         meta: {
//           is_desktop_menu: true,
//           title: 'Документы',
//           icon: 'fa-solid fa-file-invoice',
//           roles: ['chairman', 'member'],
//         },
//       },
//       {
//         path: ':coopname/auth/signin',
//         name: 'signin',
//         component: SignInPage,
//         children: [],
//       },
//       {
//         path: ':coopname/auth/signup',
//         name: 'signup',
//         component: SignUpPage,
//         children: [],
//       },


//       {
//         path: '/something-bad',
//         name: 'somethingBad',
//         component: blank,
//       },
//       {
//         path: '/permission-denied',
//         name: 'permissionDenied',
//         component: permissionDenied,
//       },
//       {
//         path: '/:pathMatch(.*)*',
//         name: 'NotFound',
//         component: blank,
//       },
//     ],
//   },
// ];

const rs = baseRoutes;

export const routes = rs as RouteRecordRaw[];
