import { MenuType, RouteInfo } from './navbar.metadata';

export const ROUTES: RouteInfo[] = [
  { path: '', title: 'Maprentals', menuType: MenuType.BRAND },
  { path: 'about', title: 'About Us', menuType: MenuType.UNAUTH },
  { path: 'contact', title: 'Contact', menuType: MenuType.UNAUTH },
  { path: 'profile', title: 'My Profile', menuType: MenuType.AUTH },
  { path: 'myrentals', title: 'My Rentals', menuType: MenuType.AUTH }
  //{ path: 'logout', title: 'Logout', menuType: MenuType.AUTH }
];
