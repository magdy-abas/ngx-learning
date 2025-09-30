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
import { filter, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BtnLangComponent } from '../../shared/ui/btn-lang/btn-lang.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/service/auth.service';
import { SharedService } from '../../core/service/shared.service';
import { DarkModeService } from '../../core/service/dark-mode.service';
import { GlobalTranslateService } from '../../core/service/global-translate.service';
import { SettingResponse } from '../../core/interfaces/settings.interface';
import { SweetAlertUtils } from '../../shared/utils/SweetAlert.utils';
import { unsubscribeAll } from '../../shared/utils/unSubscribeObservable.utils';
import { SsrService } from '../../core/service/ssr.service';

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
  private subscriptions: Subscription[] = [];

  @ViewChild('navbar', { static: true }) navbar!: ElementRef;
  @ViewChild('sideMenu', { static: true }) sideMenu!: ElementRef;
  @ViewChild('overlay', { static: true }) overlay!: ElementRef;
  @ViewChild('hamburgerBtn', { static: true }) hamburgerBtn!: ElementRef;
  @ViewChild('hamburgerBtnv', { static: true }) hamburgerBtnv!: ElementRef;
  @ViewChild('closeBtn', { static: true }) closeBtn!: ElementRef;
  setting!: SettingResponse;
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
  isAuth!: boolean;
  loginWithWats: boolean = false;
  private routerSubscription!: Subscription;
  homeVersion: 'v1' | 'v2' = 'v1';

  public menuItems: MenuItem[] = [
    { title: 'Home', translationKey: 'navbar.home', route: '/' },
    {
      title: 'courses',
      translationKey: 'navbar.courses',
      route: '/courses',
    },
    {
      title: 'categories',
      translationKey: 'navbar.categories',
      route: '/categories',
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
    private darkModeService: DarkModeService,
    private _GlobalTranslateService: GlobalTranslateService,
    private ssr: SsrService
  ) {}

  ngOnInit() {
    // this.translate.onLangChange.subscribe((e) => {});

    this.isAuth = this.AuthService.isAuthenticated();
    this.darkModeService.applyMode();
    this.isDarkMode = this.darkModeService.isDarkMode();
    this.homeVersion = this.sharedService.getHomeVersion();
    this.sharedService.settings$.subscribe((settings) => {
      if (settings?.data) {
        this.setting = settings;
        this.logoUrl = this.darkModeService.getLogo(settings);
      }
    });
    this.loadUserData();
    this.sharedService.initialized$.pipe(take(1)).subscribe((initialized) => {
      if (initialized) {
        const method = this.sharedService.getLoginMethod();
        this.loginWithWats = method === 'mobile_whatsapp';
      }
    });

    this.checkCurrentRoute();
    this.handleNavbarState();

    const routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMobileMenu();
        this.checkCurrentRoute();
        this.handleNavbarState();
      });
    this.subscriptions.push(routerSub);
  }
  ngAfterViewInit() {
    this.setupEventListeners();
  }

  loadUserData() {
    const userDataString = this.ssr.getLocal('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      this.userName = userData.name ? userData.name : `user${userData.id}`;
    }
  }

  private isDesktop() {
    if (!this.ssr.isBrowser()) return;
    return window.innerWidth >= 992;
  }

  private handleNavbarState() {
    if (!this.ssr.isBrowser()) return;

    if (!this.isDesktop()) {
      this.isTransparent = false;
      this.isScrolled = false;
      this.isHomePage = false;
      return;
    }

    if (this.isHomePage) {
      if (!this.ssr.isBrowser()) return;
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
    if (!this.ssr.isBrowser()) return;
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
    if (!this.ssr.isBrowser()) return;
    if (this.hamburgerBtn) {
      this.hamburgerBtn.nativeElement.addEventListener('click', () =>
        this.openMobileMenu()
      );
    }
    if (this.hamburgerBtnv) {
      this.hamburgerBtnv.nativeElement.addEventListener('click', () =>
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
    if (!this.ssr.isBrowser()) return;
    this.isMenuOpened = true;
    this.sideMenu?.nativeElement.classList.add('active');
    this.overlay?.nativeElement.classList.add('active');
  }

  public closeMobileMenu() {
    if (!this.ssr.isBrowser()) return;
    this.isMenuOpened = false;
    this.sideMenu?.nativeElement.classList.remove('active');
    this.overlay?.nativeElement.classList.remove('active');
    this.activeSubmenu = {};
  }

  public toggleSubmenu(menuTitle: string, event?: Event) {
    if (!this.ssr.isBrowser()) return;
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
      this.closeMobileMenu();
    }
  }

  public async switchLanguage(lang: 'en' | 'ar') {
    await this._GlobalTranslateService.changeLanguage(lang);
    this.closeMobileMenu();
  }
  public isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  public toggleUserDropdown(event: Event): void {
    if (!this.ssr.isBrowser()) return;
    event.stopPropagation();
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  @HostListener('document:click')
  closeUserDropdown() {
    if (!this.ssr.isBrowser()) return;
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

  toggleThemeManually() {
    this.isDarkMode = !this.isDarkMode;
    this.darkModeService.setDarkMode(this.isDarkMode);

    const settings = this.sharedService.getSettings();
    if (settings) {
      this.logoUrl = this.darkModeService.getLogo(settings);
    }
  }
  logout(): void {
    this.AuthService.logout();
  }

  toggleLangDropdown(event: Event) {
    if (!this.ssr.isBrowser()) return;
    event.stopPropagation();
    this.isLangDropdownOpen = !this.isLangDropdownOpen;
  }
  formatWhatsappNumber(number: any): string {
    return number.replace(/[^0-9]/g, '');
  }
  sarchInCourses(searchInput: string) {
    if (searchInput) {
      this.router.navigate(['/courses'], {
        queryParams: { search: searchInput },
      });
    }
  }
  openSearchPopup() {
    if (!this.ssr.isBrowser()) return;
    this.closeMobileMenu();
    SweetAlertUtils.showSearchDialog().then((result) => {
      if (result.isConfirmed && result.value) {
        this.sarchInCourses(result.value);
      }
    });
  }

  ngOnDestroy(): void {
    unsubscribeAll(...this.subscriptions);
  }
}
