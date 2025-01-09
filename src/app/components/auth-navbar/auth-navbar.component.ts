import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  OnInit,
} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

interface SidebarMenu {
  tittle: string;
  route?: string;
  base?: string;
  base2?: string;
  base3?: string;
  base4?: string;
  separateRoute: boolean;
  showAsTab?: boolean;
  menu?: {
    menuValue: string;
    route: string;
    base: string;
    page: string;
    hasSubRoute: boolean;
    showSubRoute?: boolean;
    subMenus?: {
      menuValue: string;
      route: string;
      base: string;
      page: string;
      last: string;
    }[];
  }[];
}

@Component({
  selector: 'app-auth-navbar',
  standalone: true,
  imports: [NgClass, RouterLink, CommonModule],
  templateUrl: './auth-navbar.component.html',
  styleUrls: ['./auth-navbar.component.scss'],
})
export class AuthNavbarComponent implements OnInit {
  @ViewChild('stickyMenu') menuElement!: ElementRef;

  public isMenuOpened = false;
  public isHomePage = false;

  base = '';
  page = '';
  last = '';
  sticky = false;
  white_bg = false;
  elementPosition: number = 0;

  // Static sidebar data
  public sidebar: SidebarMenu[] = [
    {
      tittle: 'Home',
      route: '/home',
      base: 'home',
      separateRoute: true,
    },
    {
      tittle: 'Courses',
      route: '/courses',
      base: 'home',
      separateRoute: true,
    },
    {
      tittle: 'Blog',
      base: 'blog',
      separateRoute: false,
      menu: [
        {
          menuValue: 'Blog Grid',
          route: '/blog/grid',
          base: 'blog',
          page: 'grid',
          hasSubRoute: false,
        },
        {
          menuValue: 'Blog List',
          route: '/blog/list',
          base: 'blog',
          page: 'list',
          hasSubRoute: false,
        },
        {
          menuValue: 'Blog Details',
          route: '/blog/details',
          base: 'blog',
          page: 'details',
          hasSubRoute: false,
        },
      ],
    },
    {
      tittle: 'Pages',
      base: 'pages',
      separateRoute: false,
      menu: [
        {
          menuValue: 'About Us',
          route: '/pages/about',
          base: 'pages',
          page: 'about',
          hasSubRoute: false,
        },
        {
          menuValue: 'Categories',
          route: '/pages/categories',
          base: 'pages',
          page: 'categories',
          hasSubRoute: true,
          subMenus: [
            {
              menuValue: 'Category List',
              route: '/pages/categories/list',
              base: 'pages',
              page: 'categories',
              last: 'list',
            },
            {
              menuValue: 'Category Grid',
              route: '/pages/categories/grid',
              base: 'pages',
              page: 'categories',
              last: 'grid',
            },
          ],
        },
        {
          menuValue: 'Help Center',
          route: '/pages/help',
          base: 'pages',
          page: 'help',
          hasSubRoute: false,
        },
      ],
    },
    {
      tittle: 'Contact',
      route: '/contact',
      base: 'contact',
      separateRoute: true,
    },
  ];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.checkIfHomePage();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkIfHomePage();
      });
  }

  private checkIfHomePage(): void {
    const currentRoute =
      this.activatedRoute.snapshot.firstChild?.routeConfig?.path;
    this.isHomePage = !currentRoute || currentRoute === 'home';
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset;
    this.sticky = windowScroll >= this.elementPosition;
    this.white_bg = windowScroll !== 0;
  }

  public toggleSidebar(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  public hideSidebar(): void {
    this.isMenuOpened = false;
  }
}
