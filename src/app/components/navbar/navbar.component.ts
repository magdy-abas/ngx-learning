// navbar.component.ts
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { FeatherIconModule } from '../../shared/utils/feather-icons.utils';
import { AuthService } from '../../core/service/auth.service';

interface SidebarMenu {
  tittle: string;
  route?: string;
  base?: string;
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

interface CartItem {
  id: number;
  title: string;
  instructor: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
}

interface NotificationItem {
  id: number;
  avatar: string;
  userName: string;
  message: string;
  time: string;
  hasActions?: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgClass, FeatherIconModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  _AuthService = inject(AuthService);
  _Router = inject(Router);

  base = '';
  page = '';
  last = '';
  public isMenuOpened = false;

  // Static Routes
  public routes = {
    home: '/home',
    login: '/login',
    page_course_message: '/course/message',
    page_course_details: '/course/details',
    page_notifications: '/notifications',
    instructor_edit_profile: '/instructor/profile',
    students_subscription: '/student/subscription',
  };

  // Static Cart Items
  cartItems: CartItem[] = [
    {
      id: 1,
      title: 'Learn Angular...',
      instructor: 'Dave Franco',
      image: 'assets/img/course/course-04.jpg',
      originalPrice: 200,
      discountedPrice: 99,
    },
    {
      id: 2,
      title: 'Build Responsive Real...',
      instructor: 'Jenis R.',
      image: 'assets/img/course/course-14.jpg',
      originalPrice: 200,
      discountedPrice: 99,
    },
    {
      id: 3,
      title: 'C# Developers Double ...',
      instructor: 'Jesse Stevens',
      image: 'assets/img/course/course-15.jpg',
      originalPrice: 200,
      discountedPrice: 99,
    },
  ];

  // Static Notifications
  notifications: NotificationItem[] = [
    {
      id: 1,
      avatar: 'assets/img/user/user1.jpg',
      userName: 'Lex Murphy',
      message: 'requested access to UNIX directory tree hierarchy',
      time: 'Today at 9:42 AM',
      hasActions: true,
    },
    {
      id: 2,
      avatar: 'assets/img/user/user2.jpg',
      userName: 'Ray Arnold',
      message: 'left 6 comments on Isla Nublar SOC2 compliance report',
      time: 'Yesterday at 11:42 PM',
    },
    {
      id: 3,
      avatar: 'assets/img/user/user3.jpg',
      userName: 'Dennis Nedry',
      message: 'commented on Isla Nublar SOC2 compliance report',
      time: 'Yesterday at 5:42 PM',
    },
    {
      id: 4,
      avatar: 'assets/img/user/user1.jpg',
      userName: 'John Hammond',
      message: 'created Isla Nublar SOC2 compliance report',
      time: 'Last Wednesday at 11:15 AM',
    },
  ];

  // Static User Data
  currentUser = {
    name: 'Rolands R',
    role: 'Student',
    avatar: 'assets/img/user/user11.jpg',
    status: 'online',
  };

  // Static Sidebar Menu
  sidebar: SidebarMenu[] = [
    {
      tittle: 'Home',
      route: '/home',
      base: 'home',
      separateRoute: true,
    },
    {
      tittle: 'Courses',
      base: 'courses',
      route: '/courses',
      separateRoute: false,
      menu: [
        {
          menuValue: 'All Courses',
          route: '/courses/all',
          base: 'courses',
          page: 'all',
          hasSubRoute: false,
        },
        {
          menuValue: 'My Courses',
          route: '/courses/my',
          base: 'courses',
          page: 'my',
          hasSubRoute: false,
        },
        {
          menuValue: 'Categories',
          route: '/courses/categories',
          base: 'courses',
          page: 'categories',
          hasSubRoute: true,
          subMenus: [
            {
              menuValue: 'Development',
              route: '/courses/category/development',
              base: 'courses',
              page: 'categories',
              last: 'development',
            },
            {
              menuValue: 'Design',
              route: '/courses/category/design',
              base: 'courses',
              page: 'categories',
              last: 'design',
            },
          ],
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
          menuValue: 'Contact',
          route: '/pages/contact',
          base: 'pages',
          page: 'contact',
          hasSubRoute: false,
        },
        {
          menuValue: 'FAQ',
          route: '/pages/faq',
          base: 'pages',
          page: 'faq',
          hasSubRoute: false,
        },
      ],
    },
  ];

  public toggleSidebar(): void {
    this.isMenuOpened = !this.isMenuOpened;
    if (this.isMenuOpened) {
      document.body.classList.add('menu-opened');
    } else {
      document.body.classList.remove('menu-opened');
    }

    const sidebarPosition = localStorage.getItem('sidebarPosition');
    if (sidebarPosition) {
      localStorage.removeItem('sidebarPosition');
    } else {
      localStorage.setItem('sidebarPosition', 'true');
    }
  }

  public hideSidebar(): void {
    this.isMenuOpened = false;
    document.body.classList.remove('menu-opened');
    localStorage.removeItem('sidebarPosition');
  }

  // Cart Methods
  getCartTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.discountedPrice,
      0
    );
  }

  removeFromCart(itemId: number): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
  }

  // Notification Methods
  markAllAsRead(): void {
    // Implementation for marking all notifications as read
    console.log('Marked all as read');
  }

  acceptRequest(notificationId: number): void {
    // Implementation for accepting request
    console.log('Accepted request:', notificationId);
  }

  rejectRequest(notificationId: number): void {
    // Implementation for rejecting request
    console.log('Rejected request:', notificationId);
  }

  // Theme Toggle
  toggleDarkMode(): void {
    const nightMode = document.getElementById('night-mode') as HTMLInputElement;
    if (nightMode) {
      nightMode.checked = !nightMode.checked;
      document.body.classList.toggle('dark-mode');
    }
  }

  logout(): void {
    this._AuthService.clearUserData();
    this._Router.navigate(['/login']);
  }
}
