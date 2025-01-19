export interface SubMenuItem {
  menuValue: string;
  route: string;
  base: string;
  page: string;
  last: string;
  translationKey: string;
}

export interface MenuItem {
  menuValue: string;
  route: string;
  base: string;
  page: string;
  hasSubRoute: boolean;
  showSubRoute?: boolean;
  subMenus?: SubMenuItem[];
  translationKey: string;
}

export interface MainMenuItem {
  tittle: string;
  route?: string;
  base: string;
  separateRoute: boolean;
  showAsTab?: boolean;
  menu?: MenuItem[];
  translationKey: string;
}
export const navbarMenu: MainMenuItem[] = [
  {
    tittle: 'Home',
    route: '/home',
    base: 'home',
    separateRoute: true,
    translationKey: 'navbar.home',
  },
  {
    tittle: 'Courses',
    route: '/auth/courses',
    base: 'courses',
    separateRoute: false,
    translationKey: 'navbar.courses',
    menu: [
      {
        menuValue: 'All Courses',
        route: '/courses/all',
        base: 'courses',
        page: 'all',
        hasSubRoute: false,
        translationKey: 'navbar.allCourses',
      },
      // {
      //   menuValue: 'Categories',
      //   route: '/courses/categories',
      //   base: 'courses',
      //   page: 'categories',
      //   hasSubRoute: true,
      //   translationKey: 'navbar.allcourses',
      //   subMenus: [
      //     {
      //       menuValue: 'Development',
      //       route: '/courses/category/development',
      //       base: 'courses',
      //       page: 'categories',
      //       last: 'development',
      //       translationKey: 'MENU.COURSES.CATEGORIES.DEVELOPMENT',
      //     },
      //     {
      //       menuValue: 'Design',
      //       route: '/courses/category/design',
      //       base: 'courses',
      //       page: 'categories',
      //       last: 'design',
      //       translationKey: 'MENU.COURSES.CATEGORIES.DESIGN',
      //     },
      //   ],
      // },
    ],
  },
];

export const navbarAuthMenu: MainMenuItem[] = [
  {
    tittle: 'Home',
    route: '/home',
    base: 'home',
    separateRoute: true,
    translationKey: 'navbar.home',
  },
  {
    tittle: 'Courses',
    route: '/courses',
    base: 'courses',
    separateRoute: false,
    translationKey: 'navbar.courses',
    menu: [
      {
        menuValue: 'All Courses',
        route: '/courses/all',
        base: 'courses',
        page: 'all',
        hasSubRoute: false,
        translationKey: 'navbar.allCourses',
      },
      // {
      //   menuValue: 'Categories',
      //   route: '/courses/categories',
      //   base: 'courses',
      //   page: 'categories',
      //   hasSubRoute: true,
      //   translationKey: 'navbar.allcourses',
      //   subMenus: [
      //     {
      //       menuValue: 'Development',
      //       route: '/courses/category/development',
      //       base: 'courses',
      //       page: 'categories',
      //       last: 'development',
      //       translationKey: 'MENU.COURSES.CATEGORIES.DEVELOPMENT',
      //     },
      //     {
      //       menuValue: 'Design',
      //       route: '/courses/category/design',
      //       base: 'courses',
      //       page: 'categories',
      //       last: 'design',
      //       translationKey: 'MENU.COURSES.CATEGORIES.DESIGN',
      //     },
      //   ],
      // },
    ],
  },
];
