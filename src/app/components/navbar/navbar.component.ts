import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  RouterModule,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BtnLangComponent } from '../../shared/ui/btn-lang/btn-lang.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/service/auth.service';
import { SharedService } from '../../core/service/shared.service';
import { DarkModeService } from '../../core/service/dark-mode.service';

interface MenuItem {
  title: string;
  route?: string;
  translationKey: string;
  hasDropdown?: boolean;
  submenu?: MenuItem[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    TranslateModule,
    BtnLangComponent,
    RouterModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('navbar', { static: true }) navbar!: ElementRef;
  @ViewChild('sideMenu', { static: true }) sideMenu!: ElementRef;
  @ViewChild('overlay', { static: true }) overlay!: ElementRef;
  @ViewChild('hamburgerBtn', { static: true }) hamburgerBtn!: ElementRef;
  @ViewChild('closeBtn', { static: true }) closeBtn!: ElementRef;

  public isLangDropdownOpen = false;
  public isMenuOpened = false;
  public isTransparent = true;
  public isScrolled = false;
  public isHomePage = false;
  public activeSubmenu: { [key: string]: boolean } = {};
  public userName: string = 'Guest';
  public logoUrl: string = '';
  public isDarkMode = false;
  public isUserDropdownOpen = false;

  private routerSubscription!: Subscription;

  public menuItems: MenuItem[] = [
    { title: 'Home', translationKey: 'navbar.home', route: '/auth/home' },
    {
      title: 'courses',
      translationKey: 'navbar.courses',
      route: '/auth/courses',
    },
    {
      title: 'categories',
      translationKey: 'navbar.categories',
      route: '/auth/categories',
    },
  ];

  public user = {
    name: 'Rolands R',
    role: 'Student',
    image: '',
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private AuthService: AuthService,
    private sharedService: SharedService,
    private darkModeService: DarkModeService
  ) {}

  ngOnInit() {
    this.darkModeService.applyMode();
    this.isDarkMode = this.darkModeService.isDarkMode();

    this.loadUserData();

    const settings = this.sharedService.getSettings();
    if (settings) {
      this.logoUrl = this.darkModeService.getLogo(settings);
      if (settings.data.icon) {
        this.setFavicon(settings.data.icon);
      }
    }

    this.checkCurrentRoute();
    this.handleNavbarState();

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMobileMenu();
        this.checkCurrentRoute();
        this.handleNavbarState();
      });
  }

  ngAfterViewInit() {
    this.setupEventListeners();
  }

  loadUserData() {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      this.userName = userData.name ? userData.name : `user${userData.id}`;
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private isDesktop(): boolean {
    return window.innerWidth >= 992;
  }

  private handleNavbarState() {
    if (!this.isDesktop()) {
      this.isTransparent = false;
      this.isScrolled = false;
      this.isHomePage = false;
      return;
    }

    if (this.isHomePage) {
      if (window.scrollY === 0) {
        this.isTransparent = true;
        this.isScrolled = false;
      } else {
        this.isTransparent = false;
        this.isScrolled = true;
      }
    } else {
      this.isTransparent = false;
      this.isScrolled = true;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (this.isDesktop()) {
      this.handleNavbarState();
    }
  }

  private checkCurrentRoute() {
    const currentUrl = this.router.url;
    this.isHomePage =
      currentUrl === '/' ||
      currentUrl === '/home' ||
      currentUrl.startsWith('/home?') ||
      currentUrl.startsWith('/?');
  }

  private setupEventListeners() {
    if (this.hamburgerBtn) {
      this.hamburgerBtn.nativeElement.addEventListener('click', () =>
        this.openMobileMenu()
      );
    }
    if (this.closeBtn) {
      this.closeBtn.nativeElement.addEventListener('click', () =>
        this.closeMobileMenu()
      );
    }
    if (this.overlay) {
      this.overlay.nativeElement.addEventListener('click', () =>
        this.closeMobileMenu()
      );
    }
  }

  public openMobileMenu() {
    this.isMenuOpened = true;
    this.sideMenu?.nativeElement.classList.add('active');
    this.overlay?.nativeElement.classList.add('active');
  }

  public closeMobileMenu() {
    this.isMenuOpened = false;
    this.sideMenu?.nativeElement.classList.remove('active');
    this.overlay?.nativeElement.classList.remove('active');
    this.activeSubmenu = {};
  }

  public toggleSubmenu(menuTitle: string, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.activeSubmenu[menuTitle] = !this.activeSubmenu[menuTitle];
  }

  public isSubmenuActive(menuTitle: string): boolean {
    return !!this.activeSubmenu[menuTitle];
  }

  public navigateTo(route: string) {
    if (route) {
      this.router.navigate([route]);
    }
  }

  public switchLanguage(lang: string) {
    this.translate.use(lang);
  }

  public isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  public toggleUserDropdown(event: Event): void {
    event.stopPropagation();
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  @HostListener('document:click')
  closeUserDropdown() {
    this.isUserDropdownOpen = false;
  }

  toggleDarkMode(event: Event): void {
    event.stopPropagation();
    this.darkModeService.toggleDarkMode();
    this.isDarkMode = this.darkModeService.isDarkMode();

    const settings = this.sharedService.getSettings();
    if (settings) {
      this.logoUrl = this.darkModeService.getLogo(settings);
    }
  }
  logout(): void {
    this.AuthService.logout();
  }
  setFavicon(iconUrl: string) {
    let link: HTMLLinkElement | null =
      document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = iconUrl;
  }

  toggleLangDropdown(event: Event) {
    event.stopPropagation();
    this.isLangDropdownOpen = !this.isLangDropdownOpen;
  }
}
