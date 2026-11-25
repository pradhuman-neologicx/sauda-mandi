import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, DestroyRef } from '@angular/core';
import { Router, RouterLinkActive, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  private jwtService = inject(JwtService);
  private router = inject(Router);
  private loginService = inject(LoginService);
  private notificationService = inject(NotificationService);

  private destroyRef = inject(DestroyRef);

  menuItems: MenuItem[] = [];
  readonly collapsed = input<boolean>(false);
  readonly isMobile = input<boolean>(false);
  readonly closeSidenav = output<void>();

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
        icon: 'tune',
        label: 'Configuration',
        route: '/admin/configuration',
        subItems: [
          {
            index: 21,
            icon: 'business',
            label: 'Firm Management',
            route: '/admin/firm-management',
          },
          {
            index: 22,
            icon: 'groups',
            label: 'Party Management',
            route: '/admin/party-management',
          },
          {
            index: 23,
            icon: 'manage_accounts',
            label: 'User Management',
            route: '/admin/user-management',
          },
          {
            index: 24,
            icon: 'category',
            label: 'Product Categories',
            route: '/admin/inventory-management/categories',
          },
          {
            index: 25,
            icon: 'inventory',
            label: 'Product Master',
            route: '/admin/inventory-management/product-master',
          },
          {
            index: 26,
            icon: 'straighten',
            label: 'UOM Master',
            route: '/admin/configuration/uom',
          },
          {
            index: 27,
            icon: 'warehouse',
            label: 'Warehouse Master',
            route: '/admin/configuration/warehouse',
          },
          {
            index: 28,
            icon: 'domain',
            label: 'Godown Master',
            route: '/admin/configuration/godown',
          },
        ],
      },
      {
        index: 3,
        icon: 'inventory_2',
        label: 'Inventory Management',
        route: '/admin/inventory-management/inventory',
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
        icon: 'menu_book',
        label: 'Journal Entries',
        route: '/admin/journal-entries',
      },
      {
        index: 7,
        icon: 'payments',
        label: 'Payment Entry',
        route: '/admin/payments',
      },
    ];

    // Auto-detect active submenu on initial load and route changes
    const activeParent = this.menuItems.find((m) =>
      m.subItems?.some((sub) => this.router.url.startsWith(sub.route))
    );
    if (activeParent) {
      this.expandedSubmenu = activeParent.route;
    }

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        const matching = this.menuItems.find((m) =>
          m.subItems?.some((sub) => event.urlAfterRedirects.startsWith(sub.route))
        );
        this.expandedSubmenu = matching ? matching.route : null;
      });
  }

  isExpanded: boolean = false;
  expandedSubmenu: string | null = null;

  isSubmenuExpanded(route: string): boolean {
    if (this.expandedSubmenu === route) {
      return true;
    }
    if (this.expandedSubmenu === '__closed__') {
      return false;
    }
    if (this.expandedSubmenu !== null) {
      return false;
    }
    const item = this.menuItems.find((m) => m.route === route);
    if (item?.subItems) {
      return item.subItems.some((sub) => this.router.url.startsWith(sub.route));
    }
    return false;
  }

  toggleSubmenu(route: string): void {
    if (this.isSubmenuExpanded(route)) {
      this.expandedSubmenu = '__closed__';
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
