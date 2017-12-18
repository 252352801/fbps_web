/**
 *菜单
 */
export interface AsideMenu {
  text: string,
  link?: string,
  icon?: string,
  render: boolean,
  subMenus?: AsideMenu[]
}
