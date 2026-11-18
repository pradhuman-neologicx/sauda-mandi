import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  CommodityRecord,
  FirmRecord,
  InvCategoryRecord,
  InvProductRecord,
  InvSubCategoryRecord,
  InventoryRecord,
  PackagingUom,
  SaudaErpMockService,
  StockAdjustmentRecord,
  StockMovementRecord,
  WarehouseRecord,
} from '../../../core/services/sauda-erp-mock.service';
import { NotificationService } from '../../../core/services/notificationnew.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, NgxPaginationModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent implements OnInit {
  protected readonly Math = Math;
  private readonly erp = inject(SaudaErpMockService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notification = inject(NotificationService);

  // Active Tab
  activeTab: 'current-stock' | 'adjustments' | 'history' = 'current-stock';

  // Role Switcher & Access Scope (UC-INV-01, UC-INV-06, Cross-Use-Case Rules)
  currentActorRole: 'Operations Executive (Maker)' | 'Business Owner / Admin (Checker)' =
    'Business Owner / Admin (Checker)';
  currentActorName = 'Rajesh Sharma';
  readonly assignedPrimaryFirm = 'Desert Fresh Traders';

  get isChecker(): boolean {
    return this.currentActorRole === 'Business Owner / Admin (Checker)';
  }

  get isMaker(): boolean {
    return this.currentActorRole === 'Operations Executive (Maker)';
  }

  // Master Data
  inventoryList: InventoryRecord[] = [];
  filteredInventory: InventoryRecord[] = [];

  stockAdjustments: StockAdjustmentRecord[] = [];
  filteredAdjustments: StockAdjustmentRecord[] = [];

  stockMovements: StockMovementRecord[] = [];
  filteredMovements: StockMovementRecord[] = [];

  warehouses: WarehouseRecord[] = [];
  commodities: CommodityRecord[] = [];
  firms: FirmRecord[] = [];
  products: InvProductRecord[] = [];
  categories: InvCategoryRecord[] = [];
  subCategories: InvSubCategoryRecord[] = [];

  readonly packagingUoms: PackagingUom[] = [
    'Bag',
    'Crate',
    'Box',
    'Carton',
    'Sack',
    'Loose',
  ];
  readonly tableSizes: Array<number | 'all'> = [10, 25, 50, 'all'];

  // ── Tab 1: Current Stock Filters & State (UC-INV-01) ──
  stockSearchTerm = '';
  appliedStockSearchTerm = '';
  stockWarehouseFilter = 'All';
  stockCommodityFilter = 'All';
  stockUomFilter = 'All';
  stockAvailabilityFilter: 'All' | 'Available Stock' | 'Zero Stock' = 'All';
  stockFirmFilter = 'All';
  showStockReset = false;
  stockPage = 1;
  stockTableSize: number | 'all' = 10;

  // ── Tab 2: Adjustments State (UC-INV-04 & UC-INV-05) ──
  adjSubView: 'pending' | 'history' = 'pending';
  adjSearchTerm = '';
  appliedAdjSearchTerm = '';
  adjWarehouseFilter = 'All';
  adjFirmFilter = 'All';
  showAdjReset = false;
  adjPage = 1;
  adjTableSize: number | 'all' = 10;

  // Create Adjustment Modal (UC-INV-04)
  showCreateAdjModal = false;
  createAdjError = '';
  createAdjForm = {
    clientFirm: '',
    warehouseId: '',
    commodity: '',
    productId: '',
    adjustmentType: 'Increase' as 'Increase' | 'Decrease',
    packagingUom: 'Bag' as PackagingUom,
    quantity: null as number | null,
    totalWeightMt: null as number | null,
    reason: '',
    adjustmentDate: '',
  };

  // Review Adjustment Modal (UC-INV-05)
  showReviewAdjModal = false;
  selectedAdj: StockAdjustmentRecord | null = null;
  reviewError = '';
  isRejecting = false;
  rejectionReasonInput = '';

  // ── Tab 3: Movement History Filters & State (UC-INV-06) ──
  movSearchTerm = '';
  appliedMovSearchTerm = '';
  movFirmFilter = 'All';
  movWarehouseFilter = 'All';
  movCommodityFilter = 'All';
  movTypeFilter: 'All' | 'Purchase Receipt' | 'Sales Dispatch' | 'Stock Adjustment' = 'All';
  movDirectionFilter: 'All' | 'Stock In' | 'Stock Out' = 'All';
  movFromDate = '';
  movToDate = '';
  showMovReset = false;
  movPage = 1;
  movTableSize: number | 'all' = 10;

  ngOnInit(): void {
    // Inventory stream
    this.erp.inventory$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.inventoryList = list;
        this.applyStockFilters();
      });

    // Stock Adjustments stream
    this.erp.stockAdjustments$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.stockAdjustments = list;
        this.applyAdjFilters();
      });

    // Stock Movements stream
    this.erp.stockMovements$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.stockMovements = list;
        this.applyMovFilters();
      });

    // Warehouses stream
    this.erp.warehouses$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.warehouses = list;
      });

    // Commodities stream
    this.erp.commodities$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.commodities = list.filter((c) => c.isActive);
      });

    // Firms stream
    this.erp.firms$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.firms = list.filter((f) => f.isActive);
      });

    // Products stream
    this.erp.invProducts$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.products = list;
      });

    // Categories & sub-categories
    this.erp.invCategories$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.categories = list;
      });

    this.erp.invSubCategories$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.subCategories = list;
      });
  }

  // ── Actor Role Toggle ──
  switchActorRole(role: 'Operations Executive (Maker)' | 'Business Owner / Admin (Checker)'): void {
    this.currentActorRole = role;
    if (this.isMaker) {
      this.currentActorName = 'Amit Patel';
      this.stockFirmFilter = this.assignedPrimaryFirm;
      this.adjFirmFilter = this.assignedPrimaryFirm;
      this.movFirmFilter = this.assignedPrimaryFirm;
    } else {
      this.currentActorName = 'Rajesh Sharma';
    }
    this.notification.show(`Switched active role to: ${role}`, 'info', 2500);
    this.applyStockFilters();
    this.applyAdjFilters();
    this.applyMovFilters();
  }

  setActiveTab(tab: 'current-stock' | 'adjustments' | 'history'): void {
    this.activeTab = tab;
  }

  // ── Tab 1: Current Stock Helpers & Filtering (UC-INV-01) ──
  get stockPageSize(): number {
    return this.stockTableSize === 'all'
      ? Math.max(this.filteredInventory.length, 1)
      : this.stockTableSize;
  }

  get totalCommoditiesCount(): number {
    const unique = new Set(this.filteredInventory.map((i) => i.commodity.trim().toLowerCase()));
    return unique.size;
  }

  get totalStockWeightMt(): number {
    return Number(
      this.filteredInventory
        .reduce((sum, item) => sum + item.availableWeightMt, 0)
        .toFixed(2),
    );
  }

  get totalUnitsByUomSummary(): string {
    const uomMap = new Map<string, number>();
    for (const item of this.filteredInventory) {
      if (item.availableUnits > 0) {
        const uom = item.packagingUom || 'Units';
        uomMap.set(uom, (uomMap.get(uom) || 0) + item.availableUnits);
      }
    }
    if (uomMap.size === 0) {
      return '0 Units';
    }
    const parts: string[] = [];
    uomMap.forEach((qty, uom) => {
      parts.push(`${qty.toLocaleString()} ${uom}${qty > 1 ? 's' : ''}`);
    });
    return parts.join(' • ');
  }

  get zeroStockCount(): number {
    return this.filteredInventory.filter((i) => i.availableUnits <= 0 || i.availableWeightMt <= 0).length;
  }

  onStockSearch(): void {
    this.appliedStockSearchTerm = (this.stockSearchTerm || '').trim().toLowerCase();
    this.stockPage = 1;
    this.showStockReset =
      !!this.appliedStockSearchTerm ||
      this.stockWarehouseFilter !== 'All' ||
      this.stockCommodityFilter !== 'All' ||
      this.stockUomFilter !== 'All' ||
      this.stockAvailabilityFilter !== 'All' ||
      (this.isChecker && this.stockFirmFilter !== 'All');
    this.applyStockFilters();
  }

  resetStockFilters(): void {
    this.stockSearchTerm = '';
    this.appliedStockSearchTerm = '';
    this.stockWarehouseFilter = 'All';
    this.stockCommodityFilter = 'All';
    this.stockUomFilter = 'All';
    this.stockAvailabilityFilter = 'All';
    this.stockFirmFilter = this.isMaker ? this.assignedPrimaryFirm : 'All';
    this.showStockReset = false;
    this.stockPage = 1;
    this.applyStockFilters();
  }

  applyStockFilters(): void {
    const term = this.appliedStockSearchTerm;
    this.filteredInventory = this.inventoryList.filter((item) => {
      // Role scope: Maker restricted to primary firm
      if (this.isMaker && item.clientFirm !== this.assignedPrimaryFirm) {
        return false;
      }
      if (this.isChecker && this.stockFirmFilter !== 'All' && item.clientFirm !== this.stockFirmFilter) {
        return false;
      }

      // Warehouse filter
      if (
        this.stockWarehouseFilter !== 'All' &&
        item.warehouseId !== this.stockWarehouseFilter &&
        item.warehouseName !== this.stockWarehouseFilter
      ) {
        return false;
      }

      // Commodity filter
      if (this.stockCommodityFilter !== 'All' && item.commodity !== this.stockCommodityFilter) {
        return false;
      }

      // UOM filter
      if (this.stockUomFilter !== 'All' && item.packagingUom !== this.stockUomFilter) {
        return false;
      }

      // Availability filter
      const isZero = item.availableUnits <= 0 || item.availableWeightMt <= 0;
      if (this.stockAvailabilityFilter === 'Available Stock' && isZero) {
        return false;
      }
      if (this.stockAvailabilityFilter === 'Zero Stock' && !isZero) {
        return false;
      }

      // Text search
      if (!term) return true;
      return (
        item.warehouseName.toLowerCase().includes(term) ||
        item.clientFirm.toLowerCase().includes(term) ||
        item.commodity.toLowerCase().includes(term) ||
        (item.productName || '').toLowerCase().includes(term) ||
        (item.categoryName || '').toLowerCase().includes(term)
      );
    });
  }

  // ── Tab 2: Stock Adjustments Helpers & Workflow (UC-INV-04 & UC-INV-05) ──
  get pendingAdjustmentsCount(): number {
    return this.stockAdjustments.filter((a) => a.status === 'Pending Approval').length;
  }

  get adjPageSize(): number {
    return this.adjTableSize === 'all'
      ? Math.max(this.filteredAdjustments.length, 1)
      : this.adjTableSize;
  }

  setAdjSubView(view: 'pending' | 'history'): void {
    this.adjSubView = view;
    this.adjPage = 1;
    this.applyAdjFilters();
  }

  onAdjSearch(): void {
    this.appliedAdjSearchTerm = (this.adjSearchTerm || '').trim().toLowerCase();
    this.adjPage = 1;
    this.showAdjReset =
      !!this.appliedAdjSearchTerm ||
      this.adjWarehouseFilter !== 'All' ||
      (this.isChecker && this.adjFirmFilter !== 'All');
    this.applyAdjFilters();
  }

  resetAdjFilters(): void {
    this.adjSearchTerm = '';
    this.appliedAdjSearchTerm = '';
    this.adjWarehouseFilter = 'All';
    this.adjFirmFilter = this.isMaker ? this.assignedPrimaryFirm : 'All';
    this.showAdjReset = false;
    this.adjPage = 1;
    this.applyAdjFilters();
  }

  applyAdjFilters(): void {
    const term = this.appliedAdjSearchTerm;
    this.filteredAdjustments = this.stockAdjustments.filter((adj) => {
      // Sub-view: Pending vs History
      if (this.adjSubView === 'pending' && adj.status !== 'Pending Approval') {
        return false;
      }
      if (this.adjSubView === 'history' && adj.status === 'Pending Approval') {
        return false;
      }

      // Role scope
      if (this.isMaker && adj.clientFirm !== this.assignedPrimaryFirm) {
        return false;
      }
      if (this.isChecker && this.adjFirmFilter !== 'All' && adj.clientFirm !== this.adjFirmFilter) {
        return false;
      }

      // Warehouse
      if (
        this.adjWarehouseFilter !== 'All' &&
        adj.warehouseId !== this.adjWarehouseFilter &&
        adj.warehouseName !== this.adjWarehouseFilter
      ) {
        return false;
      }

      // Text search
      if (!term) return true;
      return (
        adj.adjNo.toLowerCase().includes(term) ||
        adj.commodity.toLowerCase().includes(term) ||
        adj.warehouseName.toLowerCase().includes(term) ||
        adj.clientFirm.toLowerCase().includes(term) ||
        adj.makerName.toLowerCase().includes(term) ||
        adj.reason.toLowerCase().includes(term)
      );
    });
  }

  // Create Adjustment Modal (UC-INV-04)
  openCreateAdjModal(preset?: InventoryRecord): void {
    this.createAdjError = '';
    const today = new Date().toISOString().slice(0, 10);
    const defaultFirm = preset?.clientFirm || (this.isMaker ? this.assignedPrimaryFirm : this.firms[0]?.name || '');
    const defaultWh = preset?.warehouseId || this.warehouses[0]?.id || '';
    const defaultComm = preset?.commodity || this.commodities[0]?.name || 'Bajra';
    const defaultUom = preset?.packagingUom || 'Bag';

    this.createAdjForm = {
      clientFirm: defaultFirm,
      warehouseId: defaultWh,
      commodity: defaultComm,
      productId: preset?.productId || '',
      adjustmentType: 'Increase',
      packagingUom: defaultUom,
      quantity: null,
      totalWeightMt: null,
      reason: '',
      adjustmentDate: today,
    };
    this.showCreateAdjModal = true;
  }

  closeCreateAdjModal(): void {
    this.showCreateAdjModal = false;
    this.createAdjError = '';
  }

  get liveSelectedStock(): InventoryRecord | undefined {
    if (!this.createAdjForm.clientFirm || !this.createAdjForm.warehouseId || !this.createAdjForm.commodity) {
      return undefined;
    }
    return this.inventoryList.find(
      (i) =>
        i.clientFirm.toLowerCase() === this.createAdjForm.clientFirm.toLowerCase() &&
        (i.warehouseId === this.createAdjForm.warehouseId ||
          i.warehouseName.toLowerCase() === this.createAdjForm.warehouseId.toLowerCase()) &&
        i.commodity.toLowerCase() === this.createAdjForm.commodity.toLowerCase(),
    );
  }

  get computedAverageWeightKg(): number {
    const qty = Number(this.createAdjForm.quantity);
    const wt = Number(this.createAdjForm.totalWeightMt);
    if (!qty || qty <= 0 || !wt || wt <= 0) return 0;
    return Number(((wt * 1000) / qty).toFixed(2));
  }

  submitCreateAdjustment(): void {
    this.createAdjError = '';
    const form = this.createAdjForm;
    if (!form.clientFirm || !form.warehouseId || !form.commodity) {
      this.createAdjError = 'Client Firm, Warehouse and Commodity are mandatory.';
      return;
    }
    const qty = Number(form.quantity);
    const wt = Number(form.totalWeightMt);
    if (!qty || qty <= 0 || !wt || wt <= 0) {
      this.createAdjError = 'Quantity (Units) and Total Weight (MT) must be greater than zero.';
      return;
    }
    if (!form.reason?.trim()) {
      this.createAdjError = 'Reason for adjustment is mandatory.';
      return;
    }

    // Call mock service (UC-INV-04)
    const res = this.erp.createStockAdjustment(
      {
        clientFirm: form.clientFirm,
        warehouseId: form.warehouseId,
        commodity: form.commodity,
        productId: form.productId || undefined,
        adjustmentType: form.adjustmentType,
        packagingUom: form.packagingUom,
        quantity: qty,
        totalWeightMt: wt,
        reason: form.reason.trim(),
        adjustmentDate: form.adjustmentDate,
      },
      this.currentActorRole,
      this.currentActorName,
    );

    if (!res.ok) {
      this.createAdjError = res.message;
      return;
    }

    this.notification.show(res.message, 'success', 3500);
    this.closeCreateAdjModal();
    this.activeTab = 'adjustments';
    this.adjSubView = 'pending';
    this.applyAdjFilters();
  }

  // Review / Decision Modal (UC-INV-05)
  openReviewAdjModal(adj: StockAdjustmentRecord): void {
    this.selectedAdj = adj;
    this.reviewError = '';
    this.isRejecting = false;
    this.rejectionReasonInput = '';
    this.showReviewAdjModal = true;
  }

  closeReviewAdjModal(): void {
    this.showReviewAdjModal = false;
    this.selectedAdj = null;
    this.reviewError = '';
    this.isRejecting = false;
    this.rejectionReasonInput = '';
  }

  approveAdjustment(adj: StockAdjustmentRecord): void {
    this.reviewError = '';
    const res = this.erp.approveStockAdjustment(
      adj.id,
      this.currentActorRole,
      this.currentActorName,
    );
    if (!res.ok) {
      this.reviewError = res.message;
      this.notification.show(res.message, 'error', 3500);
      return;
    }

    this.notification.show(res.message, 'success', 3500);
    this.closeReviewAdjModal();
    this.applyStockFilters();
    this.applyAdjFilters();
    this.applyMovFilters();
  }

  startRejectFlow(): void {
    this.isRejecting = true;
    this.reviewError = '';
  }

  cancelRejectFlow(): void {
    this.isRejecting = false;
    this.rejectionReasonInput = '';
  }

  confirmRejectAdjustment(): void {
    if (!this.selectedAdj) return;
    this.reviewError = '';
    const reason = (this.rejectionReasonInput || '').trim();
    if (!reason) {
      this.reviewError = 'Rejection reason is mandatory.';
      return;
    }

    const res = this.erp.rejectStockAdjustment(
      this.selectedAdj.id,
      reason,
      this.currentActorRole,
      this.currentActorName,
    );

    if (!res.ok) {
      this.reviewError = res.message;
      this.notification.show(res.message, 'error', 3500);
      return;
    }

    this.notification.show(res.message, 'success', 3500);
    this.closeReviewAdjModal();
    this.applyAdjFilters();
  }

  // ── Tab 3: Stock Movement History (UC-INV-06) ──
  get movPageSize(): number {
    return this.movTableSize === 'all'
      ? Math.max(this.filteredMovements.length, 1)
      : this.movTableSize;
  }

  get totalStockInKpi(): { unitsSummary: string; weightMt: number } {
    const inMovs = this.filteredMovements.filter((m) => m.movementDirection === 'Stock In');
    const uomMap = new Map<string, number>();
    let weight = 0;
    for (const m of inMovs) {
      const uom = m.packagingUom || 'Units';
      uomMap.set(uom, (uomMap.get(uom) || 0) + m.quantity);
      weight += m.totalWeightMt;
    }
    const parts: string[] = [];
    uomMap.forEach((qty, uom) => {
      parts.push(`${qty.toLocaleString()} ${uom}${qty > 1 ? 's' : ''}`);
    });
    return {
      unitsSummary: parts.length > 0 ? parts.join(' • ') : '0 Units',
      weightMt: Number(weight.toFixed(2)),
    };
  }

  get totalStockOutKpi(): { unitsSummary: string; weightMt: number } {
    const outMovs = this.filteredMovements.filter((m) => m.movementDirection === 'Stock Out');
    const uomMap = new Map<string, number>();
    let weight = 0;
    for (const m of outMovs) {
      const uom = m.packagingUom || 'Units';
      uomMap.set(uom, (uomMap.get(uom) || 0) + m.quantity);
      weight += m.totalWeightMt;
    }
    const parts: string[] = [];
    uomMap.forEach((qty, uom) => {
      parts.push(`${qty.toLocaleString()} ${uom}${qty > 1 ? 's' : ''}`);
    });
    return {
      unitsSummary: parts.length > 0 ? parts.join(' • ') : '0 Units',
      weightMt: Number(weight.toFixed(2)),
    };
  }

  get netStockMovementKpi(): { unitsSummary: string; weightMt: number } {
    const uomMap = new Map<string, number>();
    let netWeight = 0;
    for (const m of this.filteredMovements) {
      const sign = m.movementDirection === 'Stock In' ? 1 : -1;
      const uom = m.packagingUom || 'Units';
      uomMap.set(uom, (uomMap.get(uom) || 0) + sign * m.quantity);
      netWeight += sign * m.totalWeightMt;
    }
    const parts: string[] = [];
    uomMap.forEach((qty, uom) => {
      const prefix = qty >= 0 ? '+' : '';
      parts.push(`${prefix}${qty.toLocaleString()} ${uom}`);
    });
    return {
      unitsSummary: parts.length > 0 ? parts.join(' • ') : '0 Units',
      weightMt: Number(netWeight.toFixed(2)),
    };
  }

  onMovSearch(): void {
    this.appliedMovSearchTerm = (this.movSearchTerm || '').trim().toLowerCase();
    this.movPage = 1;
    this.showMovReset =
      !!this.appliedMovSearchTerm ||
      this.movWarehouseFilter !== 'All' ||
      this.movCommodityFilter !== 'All' ||
      this.movTypeFilter !== 'All' ||
      this.movDirectionFilter !== 'All' ||
      !!this.movFromDate ||
      !!this.movToDate ||
      (this.isChecker && this.movFirmFilter !== 'All');
    this.applyMovFilters();
  }

  resetMovFilters(): void {
    this.movSearchTerm = '';
    this.appliedMovSearchTerm = '';
    this.movWarehouseFilter = 'All';
    this.movCommodityFilter = 'All';
    this.movTypeFilter = 'All';
    this.movDirectionFilter = 'All';
    this.movFromDate = '';
    this.movToDate = '';
    this.movFirmFilter = this.isMaker ? this.assignedPrimaryFirm : 'All';
    this.showMovReset = false;
    this.movPage = 1;
    this.applyMovFilters();
  }

  applyMovFilters(): void {
    const term = this.appliedMovSearchTerm;
    this.filteredMovements = this.stockMovements.filter((m) => {
      // Role scope
      if (this.isMaker && m.clientFirm !== this.assignedPrimaryFirm) {
        return false;
      }
      if (this.isChecker && this.movFirmFilter !== 'All' && m.clientFirm !== this.movFirmFilter) {
        return false;
      }

      // Warehouse
      if (this.movWarehouseFilter !== 'All' && m.warehouseName !== this.movWarehouseFilter) {
        return false;
      }

      // Commodity
      if (this.movCommodityFilter !== 'All' && m.commodity !== this.movCommodityFilter) {
        return false;
      }

      // Type
      if (this.movTypeFilter !== 'All' && m.movementType !== this.movTypeFilter) {
        return false;
      }

      // Direction
      if (this.movDirectionFilter !== 'All' && m.movementDirection !== this.movDirectionFilter) {
        return false;
      }

      // Date Range
      if (this.movFromDate && m.movementDate < this.movFromDate) {
        return false;
      }
      if (this.movToDate && m.movementDate > this.movToDate) {
        return false;
      }

      // Text search
      if (!term) return true;
      return (
        m.movementNo.toLowerCase().includes(term) ||
        m.commodity.toLowerCase().includes(term) ||
        m.warehouseName.toLowerCase().includes(term) ||
        m.clientFirm.toLowerCase().includes(term) ||
        m.sourceRef.toLowerCase().includes(term) ||
        (m.truckNo || '').toLowerCase().includes(term)
      );
    });
  }
}
