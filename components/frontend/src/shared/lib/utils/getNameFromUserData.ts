export const getNameFromUserData = (user: any): string => {
  let name = ''

  if (user && user.first_name)
    name += `${user.last_name} ${user.first_name} ${user.middle_name}`
  else name += `${user?.short_name}`

  return name
}
