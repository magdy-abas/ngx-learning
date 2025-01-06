import { Component } from '@angular/core';
import { DataService, sideBar } from '../../core/service/data/data.service';
import { CommonService } from '../../core/service/common/common.service';
import { SidebarService } from '../../core/service/sidebar/sidebar.service';
import { routes } from '../../core/service/routes/routes';
import { RouterLink } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { FeatherIconModule } from '../../shared/utils/feather-icons.utils';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgClass, FeatherIconModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  base = '';
  page = '';
  last = '';
  public routes = routes;

  sidebar: sideBar[] = [];
  constructor(
    private common: CommonService,
    private data: DataService,
    private sidebarService: SidebarService
  ) {
    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.last.subscribe((res: string) => {
      this.last = res;
    });
    this.sidebar = this.data.sideBar;
  }

  public toggleSidebar(): void {
    this.sidebarService.openSidebar();
  }
  public hideSidebar(): void {
    this.sidebarService.closeSidebar();
  }
}
