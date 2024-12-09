export interface IMenu {
  path: string
  name: string
  meta: {
    is_desktop_menu: boolean
    is_mobile_menu: boolean
    title: string
    icon: string
    roles: string[]
  }
}
