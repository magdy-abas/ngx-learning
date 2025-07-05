import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BtnLangComponent } from '../../shared/ui/btn-lang/btn-lang.component';
import { Subscription } from 'rxjs';
import { DarkModeService } from '../../core/service/dark-mode.service';
import { SharedService } from '../../core/service/shared.service';
import { AuthService } from '../../core/service/auth.service';
import { GlobalTranslateService } from '../../core/service/global-translate.service';

interface MenuItem {
  title: string;
  route?: string;
  translationKey: string;
  hasDropdown?: boolean;
  submenu?: MenuItem[];
}

@Component({
  selector: 'app-auth-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, TranslateModule, BtnLangComponent],
  templateUrl: './auth-navbar.component.html',
  styleUrls: ['./auth-navbar.component.scss'],
})
export class AuthNavbarComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('navbar', { static: true }) navbar!: ElementRef;
  @ViewChild('sideMenu', { static: true }) sideMenu!: ElementRef;
  @ViewChild('overlay', { static: true }) overlay!: ElementRef;
  @ViewChild('hamburgerBtn', { static: true }) hamburgerBtn!: ElementRef;
  @ViewChild('closeBtn', { static: true }) closeBtn!: ElementRef;
  public isThemeDropdownOpen = false;
  isDarkMode: boolean = false;
  public isLangDropdownOpen = false;
  public logoUrl: string = '';
  loginWithWats: boolean = false;

  public isMenuOpened = false;
  public isTransparent = true;
  public isScrolled = false;
  public isHomePage = false;
  public activeSubmenu: { [key: string]: boolean } = {};

  private routerSubscription!: Subscription;

  public menuItems: MenuItem[] = [
    { title: 'Home', translationKey: 'navbar.home', route: '/home' },
    { title: 'courses', translationKey: 'navbar.courses', route: '/courses' },
    {
      title: 'categories',
      translationKey: 'navbar.categories',
      route: '/categories',
    },
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private darkModeService: DarkModeService,
    private sharedService: SharedService,
    private _AuthService: AuthService,
    private cdr: ChangeDetectorRef,
    private _GlobalTranslateService: GlobalTranslateService
  ) {}

  ngOnInit() {
    this.darkModeService.applyMode();

    this.sharedService.settings$.subscribe((settings) => {
      if (settings) {
        this.logoUrl = this.darkModeService.getLogo(settings);
      }
    });

    this.sharedService.initialized$.pipe(take(1)).subscribe((initialized) => {
      if (initialized) {
        const method = this.sharedService.getLoginMethod();
        this.loginWithWats = method === 'mobile_whatsapp';
      }
    });

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

  public switchLanguage(lang: 'en' | 'ar') {
    this._GlobalTranslateService.changeLanguage(lang);
  }

  public isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  public toggleLangDropdown(event: Event): void {
    event.stopPropagation();
    this.isLangDropdownOpen = !this.isLangDropdownOpen;
  }

  toggleThemeDropdown() {
    this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
  }

  switchTheme(mode: 'light' | 'dark') {
    if (mode === 'dark') {
      this.darkModeService.setDarkMode(true);
    } else {
      this.darkModeService.setDarkMode(false);
    }
    this.isDarkMode = this.darkModeService.isDarkMode();
    this.isThemeDropdownOpen = false;

    const settings = this.sharedService.getSettings();
    if (settings) {
      this.logoUrl = this.darkModeService.getLogo(settings);
    }
  }
}
