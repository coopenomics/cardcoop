const modules = import.meta.glob('/src/locales/ru/*.yml');
const msg: any[] = [];

for (const path in modules) {
  modules[path]().then((module: any) => {
    msg.push(module.default);
  });
}

export default msg.reduce((pre, cur) => {
  return { ...pre, ...cur }
}, {});
