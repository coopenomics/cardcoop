/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

declare global {
  interface Window {
    YooMoneyCheckoutWidget: any;
    chatwootSDK: any;
  }
}

import 'vue-router';

declare module 'vue-router' {
  // Расширяем интерфейс RouteMeta, добавляя новые свойства
  interface RouteMeta {
    roles?: string[];
    agreements?: string[]
    title: string
    icon: string
  }
}
