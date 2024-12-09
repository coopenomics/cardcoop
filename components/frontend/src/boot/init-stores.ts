// src/boot/init-stores.js
import { boot } from 'quasar/wrappers';
import { useCardStore } from 'src/app/providers/card/store';

export default boot(async ({  }) => {
  const cardStore = useCardStore();

  // Инициализация кошелька
  await cardStore.initWallet();

});
