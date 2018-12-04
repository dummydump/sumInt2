export enum MenuType {
  BRAND,
  UNAUTH,
  AUTH
}

export interface RouteInfo {
  path: string;
  title: string;
  menuType: MenuType;
}
