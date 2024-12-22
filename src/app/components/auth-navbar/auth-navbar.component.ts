import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonService } from '../../core/service/common/common.service';
import { DataService, sideBar } from '../../core/service/data/data.service';
import { SidebarService } from '../../core/service/sidebar/sidebar.service';
import { routes } from '../../app.routes';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-navbar',
  standalone: true,
  imports: [NgClass, RouterLink, CommonModule],
  templateUrl: './auth-navbar.component.html',
  styleUrl: './auth-navbar.component.scss',
})
export class AuthNavbarComponent {
  @ViewChild('stickyMenu') menuElement!: ElementRef;

  public routes = routes;
  public sidebar: Array<sideBar> = [];
  public isMenuOpened = false;

  base = '';
  page = '';
  last = '';
  sticky = false;
  white_bg = false;
  elementPosition: number = 0;

  constructor(
    private common: CommonService,
    private data: DataService,
    private sidebarService: SidebarService
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
