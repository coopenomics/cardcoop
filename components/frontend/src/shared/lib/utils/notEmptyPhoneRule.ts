export const notEmptyPhone = (val: any) => {
  return val != '+7 (___) ___-__-__' || 'Это поле обязательно для заполнения'
}
