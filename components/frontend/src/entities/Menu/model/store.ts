import { defineStore } from 'pinia';
import { ComputedRef, Ref, ref, computed } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import { IMenu } from './types';

interface IMenuStore {
  //методы
  setRoutes: (routes: RouteRecordRaw[]) => void;
  //данные
  routes: Ref<RouteRecordRaw[]>;
  getUserDesktopMenu: (role: string | undefined) => IMenu[];
  adminDesktopMenu: ComputedRef<IMenu[]>;
}

const namespace = 'buttonmenu';
export const useMenuStore = defineStore(namespace, (): IMenuStore => {
  const routes: Ref<RouteRecordRaw[]> = ref([]);

  function setRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = newRoutes;
  }

  function flattenRoutes(
    routes: RouteRecordRaw[],
    menuType: 'is_desktop_menu' | 'is_mobile_menu',
    role: string
  ): IMenu[] {
    let flatRoutes: IMenu[] = [];
    routes.forEach((route) => {
      const { path, name, meta } = route;
      if (meta && meta[menuType]) {
        const { title, icon, roles = [] } = meta;

        if (title && icon && (roles.includes(role) || roles.length == 0)) {
          flatRoutes.push({
            path,
            name: name as string,
            meta: {
              is_desktop_menu: menuType === 'is_desktop_menu',
              is_mobile_menu: menuType === 'is_mobile_menu',
              title: title as string,
              icon: icon as string,
              roles: roles as string[],
            },
          });
        }
      }
      // Рекурсивно обрабатываем дочерние маршруты
      if (route.children) {
        flatRoutes = flatRoutes.concat(
          flattenRoutes(route.children, menuType, role)
        );
      }
    });
    return flatRoutes;
  }
  const getUserDesktopMenu = (role: string | undefined) => {
    if (role == undefined) role = '';

    return flattenRoutes(routes.value, 'is_desktop_menu', role);
  };

  const adminDesktopMenu = computed(() => {
    if (!routes.value) return [];
    return flattenRoutes(routes.value, 'is_desktop_menu', 'admin');
  });

  return { routes, setRoutes, adminDesktopMenu, getUserDesktopMenu };
});
