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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private AuthService: AuthService
  ) {}

  ngOnInit() {
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

  public isUserDropdownOpen = false;

  public user = {
    name: 'Rolands R',
    role: 'Student',
    image: '',
  };

  public toggleUserDropdown(event: Event): void {
    event.stopPropagation();
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  logout(): void {
    this.AuthService.clearUserData();
    this.router.navigate(['/login']);
  }
  @HostListener('document:click')
  closeUserDropdown() {
    this.isUserDropdownOpen = false;
  }

  public isDarkMode = false;
  toggleDarkMode(event: Event): void {
    event.stopPropagation();
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  toggleLangDropdown(event: Event) {
    event.stopPropagation();
    this.isLangDropdownOpen = !this.isLangDropdownOpen;
  }
}
