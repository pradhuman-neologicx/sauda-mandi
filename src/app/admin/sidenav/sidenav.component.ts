import { Component, OnInit, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { JwtService } from 'src/app/core/services/jwt.service';
import { LoginService } from 'src/app/core/services/login.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { MatNavList, MatListItem, MatListItemIcon, MatListItemTitle } from '@angular/material/list';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';

interface MenuItem {
  index: number;
  icon: string;
  label: string;
  route: string;
  subItems?: MenuItem[];
}

@Component({
    selector: 'app-sidenav',
    standalone: true,
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatNavList, MatExpansionPanel, MatExpansionPanelHeader, MatIcon, MatListItem, RouterLinkActive, RouterLink, MatListItemIcon, MatListItemTitle]
})
export class SidenavComponent implements OnInit {
  menuItems: MenuItem[] = [];
  readonly collapsed = input<boolean>(false);
  readonly isMobile = input<boolean>(false);
  readonly closeSidenav = output<void>();

  constructor(
    private jwtService: JwtService,
    private router: Router,
    private loginService: LoginService,
    private notificationService: NotificationService,
  ) {}

  roles: any;
  ngOnInit(): void {
    this.roles = this.jwtService.getadmiRole();
    this.menuItems = [
      {
        index: 1,
        icon: 'dashboard',
        label: 'Dashboard',
        route: '/admin/dashboard',
      },
      {
        index: 2,
        icon: 'business',
        label: 'Firm Management',
        route: '/admin/firm-management',
      },
      {
        index: 3,
        icon: 'tune',
        label: 'Masters',
        route: '/admin/masters',
        subItems: [
          {
            index: 31,
            icon: 'storefront',
            label: 'Seller Master',
            route: '/admin/masters/seller',
          },
          {
            index: 32,
            icon: 'groups',
            label: 'Buyer Master',
            route: '/admin/masters/buyer',
          },
          {
            index: 33,
            icon: 'inventory_2',
            label: 'Commodity Master',
            route: '/admin/masters/commodity',
          },
        ],
      },
      {
        index: 4,
        icon: 'receipt_long',
        label: 'Sauda Management',
        route: '/admin/sauda-management',
      },
      {
        index: 5,
        icon: 'local_shipping',
        label: 'Truck Management',
        route: '/admin/truck-management',
      },
      {
        index: 6,
        icon: 'inventory_2',
        label: 'Inventory Management',
        route: '/admin/inventory-management',
        subItems: [
          {
            index: 61,
            icon: 'category',
            label: 'Categories',
            route: '/admin/inventory-management/categories',
          },
          {
            index: 62,
            icon: 'inventory',
            label: 'Product Master',
            route: '/admin/inventory-management/product-master',
          },
          {
            index: 63,
            icon: 'warehouse',
            label: 'Inventory Stock',
            route: '/admin/inventory-management/inventory',
          },
        ],
      },
    ];

    if (this.router.url.startsWith('/admin/masters')) {
      this.expandedSubmenu = '/admin/masters';
    } else if (this.router.url.startsWith('/admin/inventory-management')) {
      this.expandedSubmenu = '/admin/inventory-management';
    }
  }

  isExpanded: boolean = false;
  expandedSubmenu: string | null = null;

  isSubmenuExpanded(route: string): boolean {
    return this.expandedSubmenu === route;
  }

  toggleSubmenu(route: string): void {
    if (this.expandedSubmenu === route) {
      this.expandedSubmenu = null;
    } else {
      this.expandedSubmenu = route;
    }
  }

  closeSubmenu(): void {
    this.expandedSubmenu = null;
  }

  logout() {
    // Static logout while backend is not ready
    this.jwtService.clearStorage();
    this.router.navigate(['/sign_in']);
    this.notificationService.show('Logged out successfully', 'success', 3000);

    /* Uncomment when backend API is ready:
    this.loginService.Adminlogout().subscribe({
      next: (response: any) => {
        this.jwtService.clearStorage();
        this.router.navigate(['/sign_in']);
        this.notificationService.show(response.message, 'success', 3000);
      },
      error: (err: any) => {
        this.jwtService.clearStorage();
        this.router.navigate(['/sign_in']);
        this.notificationService.show(err.message, 'error', 3000);
      },
    });
    */
  }
}
