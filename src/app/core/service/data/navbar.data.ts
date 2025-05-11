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
    tittle: 'categories',
    route: '/categories',
    base: 'categories',
    separateRoute: true,
    translationKey: 'navbar.categories',
  },
  {
    tittle: 'Courses',
    route: '/auth/courses',
    base: 'courses',
    separateRoute: false,
    translationKey: 'navbar.courses',
    menu: [
      {
        menuValue: 'my Courses',
        route: 'my-courses',
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
    tittle: 'categories',
    route: '/categories',
    base: 'categories',
    separateRoute: true,
    translationKey: 'navbar.categories',
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
export const navbarAuthMobileMenu: MainMenuItem[] = [
  {
    tittle: 'login',
    route: '/login',
    base: 'courses',
    separateRoute: true,
    translationKey: 'navbar.login',
  },
  {
    tittle: 'signup',
    route: '/signup',
    base: 'courses',
    separateRoute: true,
    translationKey: 'navbar.signUp',
  },

  {
    tittle: 'Languages',

    base: 'courses',
    separateRoute: false,
    translationKey: 'navbar.language',
    menu: [
      {
        menuValue: 'English',
        route: '',
        base: 'courses',
        page: 'all',
        hasSubRoute: false,
        translationKey: 'English',
      },
      {
        menuValue: 'العربية',
        route: '',
        base: 'courses',
        page: 'all',
        hasSubRoute: false,
        translationKey: 'العربية',
      },
    ],
  },
];
export const navbarMobileMenu: MainMenuItem[] = [
  {
    tittle: 'Languages',

    base: 'courses',
    separateRoute: false,
    translationKey: 'navbar.language',
    menu: [
      {
        menuValue: 'English',
        route: '',
        base: 'courses',
        page: 'all',
        hasSubRoute: false,
        translationKey: 'English',
      },
      {
        menuValue: 'العربية',
        route: '',
        base: 'courses',
        page: 'all',
        hasSubRoute: false,
        translationKey: 'العربية',
      },
    ],
  },
];
