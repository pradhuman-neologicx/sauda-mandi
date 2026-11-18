import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  FirmRecord,
  SaudaErpMockService,
  SaudaRecord,
  TruckEntryRecord,
  WarehouseRecord,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

interface CommodityStockItem {
  commodity: string;
  totalQty: number;
  unit: string;
  totalWeightKg: number;
  iconType: 'groundnut' | 'chana' | 'guar';
}

interface WarehouseStockItem {
  warehouse: string;
  city: string;
  totalQty: number;
  unit: string;
  totalWeightKg: number;
}

interface RecentSaudaItem {
  saudaNo: string;
  date: string;
  type: 'Sales' | 'Purchase' | 'Brokerage';
  party: string;
  commodity: string;
  qty: string;
  value: string;
  saudaId?: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DecimalPipe],
  selector: 'app-dashboard',
  styleUrl: './dashboard.component.scss',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Filter Bar state
  selectedFirm = 'All Firms';
  firmsList: string[] = ['All Firms'];
  selectedPeriod = 'This Month (01 Jan 2025 – 31 Jan 2025)';
  periodOptions: string[] = [
    'This Month (01 Jan 2025 – 31 Jan 2025)',
    'Last Month (01 Dec 2024 – 31 Dec 2024)',
    'This Quarter (Q4 2024-25)',
    'This Financial Year (2024-25)',
  ];

  // Stock view toggle
  stockViewMode: 'commodity' | 'warehouse' = 'commodity';

  // KPI Metrics (matching exact screenshot values)
  kpi = {
    totalPurchases: '₹12.50 L',
    totalSales: '₹16.80 L',
    moneyToReceive: '₹4.20 L',
    moneyToPay: '₹3.10 L',
  };

  // Action Centre Counts
  actionCentre = {
    saudasPendingFulfilment: 5,
    trucksExpectedToday: 3,
    invoicesPendingCreation: 4,
    invoicesAwaitingPayment: 8,
  };

  // Payment Due Summary
  paymentDue = {
    receivable: '₹4.20 L',
    payable: '₹3.10 L',
    overdueReceivables: '₹1.35 L',
    overduePayables: '₹0.80 L',
    paymentsDueNext7Days: '₹0.60 L',
  };

  // Chart data: Total Purchases vs Sales Overview (Y-axis max 20L)
  chartData = {
    purchasesVal: '₹12.50 L',
    purchasesNum: 12.5,
    purchasesHeightPct: 62.5, // 12.50 / 20 * 100
    purchasesSharePct: '42.7%',
    salesVal: '₹16.80 L',
    salesNum: 16.8,
    salesHeightPct: 84.0, // 16.80 / 20 * 100
    salesSharePct: '57.3%',
    netGrowthVal: '+₹4.30 L',
    netGrowthPct: '+34.4%',
  };

  // Current Stock (Available) - By Commodity
  commodityStockList: CommodityStockItem[] = [
    {
      commodity: 'Ground Nut',
      totalQty: 780,
      unit: 'Bags',
      totalWeightKg: 31200,
      iconType: 'groundnut',
    },
    {
      commodity: 'Chana',
      totalQty: 620,
      unit: 'Bags',
      totalWeightKg: 24800,
      iconType: 'chana',
    },
    {
      commodity: 'Guar',
      totalQty: 450,
      unit: 'Bags',
      totalWeightKg: 18000,
      iconType: 'guar',
    },
  ];

  // Current Stock (Available) - By Warehouse
  warehouseStockList: WarehouseStockItem[] = [
    {
      warehouse: 'Desert Mandi Yard A',
      city: 'Jodhpur',
      totalQty: 850,
      unit: 'Bags',
      totalWeightKg: 34000,
    },
    {
      warehouse: 'Kota Grain Silo',
      city: 'Kota',
      totalQty: 600,
      unit: 'Bags',
      totalWeightKg: 24000,
    },
    {
      warehouse: 'Rajasthan Agro Godown 4',
      city: 'Bikaner',
      totalQty: 400,
      unit: 'Bags',
      totalWeightKg: 16000,
    },
  ];

  // Sauda Summary (This Period)
  saudaSummary = {
    purchaseSaudas: 18,
    salesSaudas: 24,
    brokerageSaudas: 6,
  };

  // Recent Saudas list
  recentSaudas: RecentSaudaItem[] = [
    {
      saudaNo: 'SA-000345',
      date: '29 Jan 2025',
      type: 'Sales',
      party: 'M/s Raj Traders',
      commodity: 'Ground Nut',
      qty: '200 Bags',
      value: '₹4.00 L',
    },
    {
      saudaNo: 'SA-000344',
      date: '28 Jan 2025',
      type: 'Purchase',
      party: 'M/s Shree Agri',
      commodity: 'Chana',
      qty: '150 Bags',
      value: '₹2.25 L',
    },
    {
      saudaNo: 'SA-000343',
      date: '27 Jan 2025',
      type: 'Brokerage',
      party: 'M/s Omni Exports',
      commodity: 'Guar',
      qty: '300 Bags',
      value: '₹0.60 L',
    },
  ];

  constructor(
    public erpService: SaudaErpMockService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Populate firms list from ERP service
    this.erpService.firms$
      .pipe(takeUntil(this.destroy$))
      .subscribe((firms: FirmRecord[]) => {
        const names = firms.map((f) => f.name);
        this.firmsList = ['All Firms', ...names];
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Top Filter Apply
  applyFilters(): void {
    this.notificationService.show(
      `Filters applied for ${this.selectedFirm} & ${this.selectedPeriod}.`,
      'success',
      2500,
    );
  }

  // Stock toggle By Commodity / By Warehouse
  setStockView(mode: 'commodity' | 'warehouse'): void {
    this.stockViewMode = mode;
  }

  // Quick action for Create Invoice
  openCreateInvoice(): void {
    this.notificationService.show(
      'Invoice creation workflow opened.',
      'info',
      2500,
    );
    this.router.navigate(['/admin/sauda-management']);
  }

  // Row navigation for Recent Saudas
  openSauda(item: RecentSaudaItem): void {
    this.router.navigate(['/admin/sauda-management'], {
      queryParams: { q: item.saudaNo },
    });
  }
}
