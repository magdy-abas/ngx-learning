// auth-navbar.component.ts
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { navbarMenu, MainMenuItem } from '../../core/service/data/navbar.data';
import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  OnInit,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// Update the interface to include translation keys
interface SidebarMenu {
  tittle: string;
  route?: string;
  base?: string;
  base2?: string;
  base3?: string;
  base4?: string;
  separateRoute: boolean;
  showAsTab?: boolean;
  translationKey: string; // Add translation key
  menu?: {
    menuValue: string;
    route: string;
    base: string;
    page: string;
    hasSubRoute: boolean;
    showSubRoute?: boolean;
    translationKey: string; // Add translation key
    subMenus?: {
      menuValue: string;
      route: string;
      base: string;
      page: string;
      last: string;
      translationKey: string; // Add translation key
    }[];
  }[];
}

@Component({
  selector: 'app-auth-navbar',
  standalone: true,
  imports: [NgClass, RouterLink, CommonModule, TranslateModule],
  templateUrl: './auth-navbar.component.html',
  styleUrls: ['./auth-navbar.component.scss'],
})
export class AuthNavbarComponent implements OnInit {
  @ViewChild('stickyMenu') menuElement!: ElementRef;

  public isMenuOpened = false;
  public isHomePage = false;
  public sidebar: SidebarMenu[] = navbarMenu;

  base = '';
  page = '';
  last = '';
  sticky = false;
  white_bg = false;
  elementPosition: number = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) {
    // Initialize translation service
    translate.setDefaultLang('en');
    translate.use('en');

    // Monitor route changes to update active states
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        const urlParts = url.split('/').filter((part) => part);

        this.base = urlParts[0] || '';
        this.page = urlParts[1] || '';
        this.last = urlParts[2] || '';

        this.checkIfHomePage();
      });
  }

  ngOnInit(): void {
    this.checkIfHomePage();
  }

  private checkIfHomePage(): void {
    const url = this.router.url;
    this.isHomePage = url === '/' || url === '/home';
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

  // Helper methods for active state
  isMainMenuActive(mainMenu: SidebarMenu): boolean {
    return (
      this.base === mainMenu.base ||
      this.base === mainMenu.base2 ||
      this.base === mainMenu.base3 ||
      this.base === mainMenu.base4
    );
  }

  isSubmenuActive(menu: any): boolean {
    return this.base === menu.base && this.page === menu.page;
  }

  isSubSubmenuActive(subMenu: any): boolean {
    return (
      this.base === subMenu.base &&
      this.page === subMenu.page &&
      this.last === subMenu.last
    );
  }

  // Add language switching method
  switchLanguage(lang: string) {
    this.translate.use(lang);
  }
}
