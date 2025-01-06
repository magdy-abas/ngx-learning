import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  OnInit,
} from '@angular/core';
import { CommonService } from '../../core/service/common/common.service';
import { DataService, sideBar } from '../../core/service/data/data.service';
import { SidebarService } from '../../core/service/sidebar/sidebar.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-navbar',
  standalone: true,
  imports: [NgClass, RouterLink, CommonModule],
  templateUrl: './auth-navbar.component.html',
  styleUrls: ['./auth-navbar.component.scss'],
})
export class AuthNavbarComponent implements OnInit {
  @ViewChild('stickyMenu') menuElement!: ElementRef;

  public sidebar: Array<sideBar> = [];
  public isMenuOpened = false;
  public isHomePage = false; // Flag to determine if the current page is home

  base = '';
  page = '';
  last = '';
  sticky = false;
  white_bg = false;
  elementPosition: number = 0;

  constructor(
    private common: CommonService,
    private data: DataService,
    private sidebarService: SidebarService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.sidebar = this.data.sideBar;

    // Subscribe to sidebar state changes
    this.sidebarService.toogleSidebar.subscribe((state) => {
      this.isMenuOpened = state === 'true';
    });

    this.common.base.subscribe((res: string) => (this.base = res));
    this.common.page.subscribe((res: string) => (this.page = res));
    this.common.last.subscribe((res: string) => (this.last = res));
  }

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
    this.sidebarService.openSidebar();
  }

  public hideSidebar(): void {
    this.isMenuOpened = false;
    this.sidebarService.closeSidebar();
  }
}
