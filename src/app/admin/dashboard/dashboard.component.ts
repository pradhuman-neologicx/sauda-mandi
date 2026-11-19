import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
  type: 'Sales' | 'Purchase' | 'Direct Sale' | 'Brokerage';
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
  selectedPeriod = 'November 2026';
  periodOptions: string[] = [
    'This Month (01 Jan 2025 – 31 Jan 2025)',
    'Last Month (01 Dec 2024 – 31 Dec 2024)',
    'This Quarter (Q4 2024-25)',
    'This Financial Year (2024-25)',
  ];

  // Year & Multi-Month Filter State
  availableYears: number[] = [2026, 2025, 2024, 2023];
  selectedYear = 2026;
  isMonthDropdownOpen = false;

  readonly monthsList = [
    { index: 1, name: 'January', short: 'Jan' },
    { index: 2, name: 'February', short: 'Feb' },
    { index: 3, name: 'March', short: 'Mar' },
    { index: 4, name: 'April', short: 'Apr' },
    { index: 5, name: 'May', short: 'May' },
    { index: 6, name: 'June', short: 'Jun' },
    { index: 7, name: 'July', short: 'Jul' },
    { index: 8, name: 'August', short: 'Aug' },
    { index: 9, name: 'September', short: 'Sep' },
    { index: 10, name: 'October', short: 'Oct' },
    { index: 11, name: 'November', short: 'Nov' },
    { index: 12, name: 'December', short: 'Dec' },
  ];

  selectedMonthIndexes: number[] = [11];

  @ViewChild('monthPickerContainer') monthPickerContainer?: ElementRef;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (
      this.isMonthDropdownOpen &&
      this.monthPickerContainer &&
      !this.monthPickerContainer.nativeElement.contains(event.target)
    ) {
      this.isMonthDropdownOpen = false;
    }
  }

  toggleMonthDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isMonthDropdownOpen = !this.isMonthDropdownOpen;
  }

  closeMonthDropdown(): void {
    this.isMonthDropdownOpen = false;
  }

  isMonthSelected(mIndex: number): boolean {
    return this.selectedMonthIndexes.includes(mIndex);
  }

  toggleMonth(mIndex: number): void {
    const idx = this.selectedMonthIndexes.indexOf(mIndex);
    if (idx > -1) {
      this.selectedMonthIndexes.splice(idx, 1);
    } else {
      this.selectedMonthIndexes.push(mIndex);
      this.selectedMonthIndexes.sort((a, b) => a - b);
    }
    this.updateSelectedPeriodText();
  }

  selectAllMonths(): void {
    this.selectedMonthIndexes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.updateSelectedPeriodText();
  }

  clearAllMonths(): void {
    this.selectedMonthIndexes = [];
    this.updateSelectedPeriodText();
  }

  selectCurrentMonth(): void {
    const current = new Date().getMonth() + 1;
    this.selectedMonthIndexes = [current];
    this.updateSelectedPeriodText();
  }

  selectQuarter(q: 1 | 2 | 3 | 4): void {
    if (q === 1) this.selectedMonthIndexes = [1, 2, 3];
    else if (q === 2) this.selectedMonthIndexes = [4, 5, 6];
    else if (q === 3) this.selectedMonthIndexes = [7, 8, 9];
    else if (q === 4) this.selectedMonthIndexes = [10, 11, 12];
    this.updateSelectedPeriodText();
  }

  onYearChange(): void {
    this.updateSelectedPeriodText();
  }

  get selectedMonthsDisplay(): string {
    if (this.selectedMonthIndexes.length === 12) {
      return `All Months (${this.selectedYear})`;
    }
    if (this.selectedMonthIndexes.length === 0) {
      return `Select Months (${this.selectedYear})`;
    }
    if (this.selectedMonthIndexes.length === 1) {
      const m = this.monthsList.find((item) => item.index === this.selectedMonthIndexes[0]);
      return `${m?.name || ''} ${this.selectedYear}`;
    }
    if (this.selectedMonthIndexes.length <= 3) {
      const names = this.monthsList
        .filter((item) => this.selectedMonthIndexes.includes(item.index))
        .map((item) => item.short)
        .join(', ');
      return `${names} ${this.selectedYear}`;
    }
    return `${this.selectedMonthIndexes.length} Months (${this.selectedYear})`;
  }

  private updateSelectedPeriodText(): void {
    this.selectedPeriod = this.selectedMonthsDisplay;
  }

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
      type: 'Direct Sale',
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
    this.updateSelectedPeriodText();
    this.closeMonthDropdown();
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
    this.router.navigate(['/admin/party-ledger']);
  }

  // Row navigation for Recent Saudas
  openSauda(item: RecentSaudaItem): void {
    this.router.navigate(['/admin/sauda-management'], {
      queryParams: { q: item.saudaNo },
    });
  }
}
