import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { combineLatest } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ChamberConfig,
  CommodityLineItem,
  GodownRecord,
  PackagingUom,
  PackagingUomRecord,
  SaudaErpMockService,
  SaudaRecord,
  SaudaType,
  TruckEntryRecord,
  TruckStatus,
  WarehouseRecord,
  WeightUom,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DecimalPipe,
    NgxPaginationModule,
  ],
  selector: 'app-truck-management',
  templateUrl: './truck-management.component.html',
  styleUrl: './truck-management.component.scss',
})
export class TruckManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  public erpService = inject(SaudaErpMockService);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  viewMode: 'listing' | 'details' | 'form' = 'listing';
  activeDetailTab: 'details' | 'commodities' | 'revisions' = 'details';

  allTrucks: TruckEntryRecord[] = [];
  filteredTrucks: TruckEntryRecord[] = [];
  allSaudas: SaudaRecord[] = [];
  allWarehouses: WarehouseRecord[] = [];
  godowns: GodownRecord[] = [];

  // 4-Level Location Cascades for Form
  availableGodowns: GodownRecord[] = [];
  availableChambers: ChamberConfig[] = [];
  availableStacks: string[] = [];

  // Party & Sauda Linking Filter / Search
  allPartyOptions: string[] = [];
  selectedParty: string = '';
  saudaSearchTerm: string = '';

  // Listing Filters (applied on Search click)
  searchTerm = '';
  linkedSaudaFilter = 'All';
  saudaTypeFilter: 'All' | SaudaType = 'All';
  warehouseFilter = 'All';
  entryDateFilter = '';

  appliedSearchTerm = '';
  appliedLinkedSaudaFilter = 'All';
  appliedSaudaTypeFilter: 'All' | SaudaType = 'All';
  appliedWarehouseFilter = 'All';
  appliedEntryDateFilter = '';
  showReset = false;

  // Pagination
  page = 1;
  tableSize: number | 'all' = 10;
  tableSizes: (number | 'all')[] = [10, 25, 50, 'all'];

  readonly activeTruckStatuses: TruckStatus[] = [
    'Scheduled',
    'Loaded',
    'In Transit',
    'Delivered',
  ];
  dynamicPackagingUoms: PackagingUomRecord[] = [];
  readonly packagingUoms: PackagingUom[] = [
    'Bag',
    'Crate',
    'Box',
    'Carton',
    'Sack',
    'Loose',
  ];
  readonly weightUoms: WeightUom[] = ['KG', 'Quintal', 'MT'];

  getPackagingCapacity(name: string): number {
    const pkg = this.dynamicPackagingUoms.find(
      (p) => p.name.toLowerCase() === (name || '').toLowerCase(),
    );
    return pkg?.bagQuantity ?? 50;
  }

  // Summary & Pagination properties
  activeTrucksList: TruckEntryRecord[] = [];
  purchaseLinkedCount: number = 0;
  salesLinkedCount: number = 0;
  deliveredCount: number = 0;
  inTransitCount: number = 0;
  brokerageLinkedCount: number = 0;

  itemsPerPageCount: number = 10;
  showingStart: number = 0;
  showingEnd: number = 0;

  // Form / Modal states
  isEditMode = false;
  isRemoveOpen = false;
  selectedTruck: TruckEntryRecord | null = null;
  targetSaudaType: 'Purchase' | 'Sales' = 'Purchase';

  truckForm!: FormGroup;
  removeForm!: FormGroup;
  formError = '';
  removeError = '';

  commodityRows!: FormArray;
  eligibleSaudasForForm: SaudaRecord[] = [];
  selectedWarehouse: string = '';
  availableWarehouseStockMt: number = 0;
  selectedLinkedSauda: SaudaRecord | undefined = undefined;
  selectedSaudaCommodities: CommodityLineItem[] = [];
  selectedSaudaRemainingMt: number = 0;
  formTotalWeightMt: number = 0;

  // Post-Save Visibility Modal State
  showSaveSuccessModal = false;
  saveSuccessData: {
    entryNo: string;
    vehicleNo: string;
    loadedQtyMt: number;
    saudaNo: string;
    saudaId: string;
    partyName: string;
    totalSaudaQtyMt: number;
    dispatchedSoFarMt: number;
    remainingBalanceMt: number;
    isFinal: boolean;
    saudaStatus: string;
  } | null = null;

  get selectedTruckSauda(): SaudaRecord | undefined {
    return this.selectedTruck
      ? this.getSaudaById(this.selectedTruck.saudaId)
      : undefined;
  }

  getSaudaFulfilledQty(saudaId: string): number {
    return Number(
      this.allTrucks
        .filter((t) => t.saudaId === saudaId && t.status !== 'Removed')
        .reduce((sum, t) => sum + Number(t.loadedQtyMt || 0), 0)
        .toFixed(3),
    );
  }

  getSaudaRemainingQty(saudaId: string): number {
    const s = this.getSaudaById(saudaId);
    if (!s) return 0;
    return Math.max(
      0,
      Number((s.quantityMt - this.getSaudaFulfilledQty(saudaId)).toFixed(3)),
    );
  }

  closeSuccessModalAndGoToListing(): void {
    this.showSaveSuccessModal = false;
    this.saveSuccessData = null;
    this.viewMode = 'listing';
  }

  closeSuccessModalAndViewTruck(): void {
    const id = this.saveSuccessData?.entryNo;
    this.showSaveSuccessModal = false;
    this.saveSuccessData = null;
    if (id) {
      const truck = this.allTrucks.find(
        (t) => t.entryNo === id || t.id === id,
      );
      if (truck) {
        this.openDetailsView(truck);
        return;
      }
    }
    this.viewMode = 'listing';
  }

  closeSuccessModalAndAddNext(): void {
    const saudaId = this.saveSuccessData?.saudaId;
    this.showSaveSuccessModal = false;
    this.saveSuccessData = null;
    if (saudaId) {
      this.openCreateForm(saudaId);
    } else {
      this.openCreateForm();
    }
  }

  // ── Live Quantity Tracking Getters ──
  get totalSaudaQtyMt(): number {
    return this.selectedLinkedSauda?.quantityMt || 0;
  }

  get dispatchedSoFarMt(): number {
    if (!this.selectedLinkedSauda) return 0;
    return Number(
      this.allTrucks
        .filter(
          (t) =>
            t.saudaId === this.selectedLinkedSauda?.id &&
            t.status !== 'Removed' &&
            (!this.isEditMode || t.id !== this.selectedTruck?.id),
        )
        .reduce((sum, t) => sum + Number(t.loadedQtyMt || 0), 0)
        .toFixed(3),
    );
  }

  get remainingBalanceMt(): number {
    return Number(
      Math.max(0, this.totalSaudaQtyMt - this.dispatchedSoFarMt).toFixed(3),
    );
  }

  get currentTruckWeightMt(): number {
    return this.formTotalWeightMt;
  }

  get projectedTotalMt(): number {
    return Number(
      (this.dispatchedSoFarMt + this.currentTruckWeightMt).toFixed(3),
    );
  }

  get filteredSaudasForParty(): SaudaRecord[] {
    let list = this.allSaudas.filter((s) => {
      if (
        s.status === 'Voided' ||
        s.saudaType === 'Brokerage' ||
        s.saudaType === 'Forward'
      )
        return false;
      if (this.isEditMode && s.id === this.selectedTruck?.saudaId) return true;
      if (s.status === 'Completed') return false;
      return true;
    });

    if (this.selectedParty) {
      const p = this.selectedParty.trim().toLowerCase();
      list = list.filter(
        (s) =>
          (s.partyName && s.partyName.trim().toLowerCase() === p) ||
          (s.sellerName && s.sellerName.trim().toLowerCase() === p) ||
          (s.buyerName && s.buyerName.trim().toLowerCase() === p),
      );
    }

    if (this.saudaSearchTerm.trim()) {
      const q = this.saudaSearchTerm.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.saudaNo.toLowerCase().includes(q) ||
          s.commodity.toLowerCase().includes(q) ||
          s.partyName.toLowerCase().includes(q),
      );
    }
    return list;
  }

  ngOnInit(): void {
    this.initForms();

    combineLatest([
      this.erpService.trucks$,
      this.erpService.saudas$,
      this.erpService.warehouses$,
      this.erpService.packagingUoms$,
      this.erpService.godowns$,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([trucks, saudas, warehouses, pkgs, godowns]) => {
        this.allTrucks = trucks;
        this.allSaudas = saudas;
        this.allWarehouses = warehouses.filter((w) => w.isActive);
        this.dynamicPackagingUoms = (pkgs || []).filter((p) => p.isActive);
        this.godowns = godowns || [];
        this.updatePartyOptions();
        this.applyFilters();
        if (this.selectedTruck) {
          this.selectedTruck =
            trucks.find((t) => t.id === this.selectedTruck!.id) || null;
        }
      });

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (params['action'] === 'create' || params['saudaId']) {
          const forceType =
            params['type'] === 'Sales'
              ? 'Sales'
              : params['type'] === 'Purchase'
              ? 'Purchase'
              : undefined;
          this.openCreateForm(params['saudaId'], forceType);
        }
      });
  }

  updatePartyOptions(): void {
    const set = new Set<string>();
    for (const s of this.allSaudas) {
      if (
        s.status !== 'Voided' &&
        s.saudaType !== 'Brokerage' &&
        s.saudaType !== 'Forward'
      ) {
        if (s.partyName) set.add(s.partyName.trim());
        if (s.sellerName) set.add(s.sellerName.trim());
        if (s.buyerName) set.add(s.buyerName.trim());
      }
    }
    this.allPartyOptions = Array.from(set)
      .filter((p) => p.length > 0)
      .sort();
  }

  private initForms(): void {
    const today = new Date().toISOString().slice(0, 10);
    this.truckForm = this.fb.group({
      saudaId: ['', Validators.required],
      warehouse: ['', Validators.required],
      warehouseId: [''],
      godownName: [''],
      chamberName: [''],
      stackNumber: [''],
      dispatchDate: [today, Validators.required],
      vehicleNo: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[A-Za-z]{2}[-\s]?\d{1,2}[-\s]?[A-Za-z]{1,3}[-\s]?\d{4}$/,
          ),
        ],
      ],
      commodityItems: this.fb.array([this.createCommodityRow()]),
      remarks: [''],
      revisionReason: [''],
    });

    this.commodityRows = this.truckForm.get('commodityItems') as FormArray;

    this.truckForm
      .get('saudaId')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((saudaId) => {
        this.onLinkedSaudaChanged(saudaId as string);
      });

    this.truckForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateFormCalculations();
      });

    this.removeForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10)]],
      confirmed: [false, Validators.requiredTrue],
    });
  }

  private createCommodityRow(item?: CommodityLineItem): FormGroup {
    let initialWeight: number | null = null;
    if (item && item.actualWeight != null) {
      if (item.weightUom === 'KG') initialWeight = Number((item.actualWeight / 1000).toFixed(3));
      else if (item.weightUom === 'Quintal') initialWeight = Number((item.actualWeight / 10).toFixed(3));
      else initialWeight = Number(item.actualWeight);
    }

    const row = this.fb.group({
      commodity: [item?.commodity || '', Validators.required],
      packagingUom: ['Bag'],
      packagingQty: [1],
      weightUom: ['MT'],
      actualWeight: [
        initialWeight,
        [Validators.required, Validators.min(0.001)],
      ],
    });

    row
      .get('actualWeight')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateFormCalculations();
      });

    return row;
  }

  addCommodityRow(): void {
    const first = this.selectedSaudaCommodities[0];
    this.commodityRows.push(
      this.createCommodityRow(
        first
          ? {
              commodity: '',
              packagingUom: first.packagingUom,
              packagingQty: 0,
              weightUom: 'MT',
              actualWeight: 0,
            }
          : undefined,
      ),
    );
    this.updateFormCalculations();
  }

  removeCommodityRow(index: number): void {
    if (this.commodityRows.length > 1) {
      this.commodityRows.removeAt(index);
      this.updateFormCalculations();
    }
  }

  onPartyChanged(): void {
    const currentSaudaId = this.truckForm.get('saudaId')?.value;
    if (currentSaudaId) {
      const s = this.getSaudaById(currentSaudaId);
      if (
        s &&
        this.selectedParty &&
        s.partyName !== this.selectedParty &&
        s.sellerName !== this.selectedParty &&
        s.buyerName !== this.selectedParty
      ) {
        this.truckForm.patchValue({ saudaId: '' });
      }
    }
  }

  private onLinkedSaudaChanged(saudaId: string): void {
    if (!saudaId) {
      this.selectedLinkedSauda = undefined;
      this.selectedSaudaCommodities = [];
      this.commodityRows.clear();
      this.commodityRows.push(this.createCommodityRow());
      this.updateFormCalculations();
      return;
    }
    const sauda = this.getSaudaById(saudaId);
    if (!sauda) return;
    this.selectedLinkedSauda = sauda;
    if (!this.selectedParty) {
      this.selectedParty = sauda.partyName;
    }
    this.targetSaudaType = sauda.saudaType as 'Purchase' | 'Sales';
    this.selectedSaudaCommodities = sauda.commodityItems || [];

    if (!this.isEditMode) {
      this.commodityRows.clear();
      const remaining = this.erpService.getRemainingQtyMt(sauda.id);
      for (const ci of sauda.commodityItems) {
        this.commodityRows.push(
          this.createCommodityRow({
            commodity: ci.commodity,
            packagingUom: 'Bag',
            packagingQty: 1,
            weightUom: 'MT',
            actualWeight: remaining > 0 ? remaining : ci.actualWeight,
          }),
        );
      }
      if (this.commodityRows.length === 0) {
        this.commodityRows.push(this.createCommodityRow());
      }
    }
    this.updateFormCalculations();
  }

  onWarehouseChanged(): void {
    const whName = this.truckForm.get('warehouse')?.value;
    const wh = this.allWarehouses.find(
      (w) => w.name === whName || w.id === whName,
    );
    this.truckForm.patchValue({
      warehouseId: wh?.id || '',
      godownName: '',
      chamberName: '',
      stackNumber: '',
    });
    if (wh) {
      this.availableGodowns = this.godowns.filter(
        (g) =>
          g.warehouseId === wh.id ||
          g.warehouseName.toLowerCase() === wh.name.toLowerCase(),
      );
    } else {
      this.availableGodowns = [];
    }
    this.availableChambers = [];
    this.availableStacks = [];
    this.updateFormCalculations();
  }

  onGodownChanged(): void {
    const gdName = this.truckForm.get('godownName')?.value;
    const gd = this.availableGodowns.find((g) => g.name === gdName);
    this.truckForm.patchValue({
      chamberName: '',
      stackNumber: '',
    });
    this.availableChambers = gd?.chambers || [];
    this.availableStacks = [];
  }

  onChamberChanged(): void {
    const chName = this.truckForm.get('chamberName')?.value;
    const ch = this.availableChambers.find((c) => c.name === chName);
    this.truckForm.patchValue({
      stackNumber: '',
    });
    this.availableStacks = ch?.stackNumbers || [];
  }

  // ── Search, Filters & Pagination ──
  onSearch(): void {
    this.appliedSearchTerm = this.searchTerm.trim();
    this.appliedLinkedSaudaFilter = this.linkedSaudaFilter;
    this.appliedSaudaTypeFilter = this.saudaTypeFilter;
    this.appliedWarehouseFilter = this.warehouseFilter;
    this.appliedEntryDateFilter = this.entryDateFilter;
    this.showReset =
      this.appliedSearchTerm.length > 0 ||
      this.appliedLinkedSaudaFilter !== 'All' ||
      this.appliedSaudaTypeFilter !== 'All' ||
      this.appliedWarehouseFilter !== 'All' ||
      this.appliedEntryDateFilter.length > 0;
    this.page = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.appliedSearchTerm.toLowerCase();
    this.filteredTrucks = this.allTrucks.filter((t) => {
      const matchesQuery =
        !q ||
        t.entryNo.toLowerCase().includes(q) ||
        t.vehicleNo.toLowerCase().includes(q) ||
        t.commodities.toLowerCase().includes(q) ||
        (t.warehouse && t.warehouse.toLowerCase().includes(q));
      const matchesSauda =
        this.appliedLinkedSaudaFilter === 'All' ||
        t.saudaId === this.appliedLinkedSaudaFilter;
      const matchesType =
        this.appliedSaudaTypeFilter === 'All' ||
        t.saudaType === this.appliedSaudaTypeFilter;
      const matchesWarehouse =
        this.appliedWarehouseFilter === 'All' ||
        t.warehouse === this.appliedWarehouseFilter;
      const matchesDate =
        !this.appliedEntryDateFilter ||
        t.dispatchDate === this.appliedEntryDateFilter;
      return (
        matchesQuery &&
        matchesSauda &&
        matchesType &&
        matchesWarehouse &&
        matchesDate
      );
    });
    this.updateSummaryAndPagination();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.linkedSaudaFilter = 'All';
    this.saudaTypeFilter = 'All';
    this.warehouseFilter = 'All';
    this.entryDateFilter = '';
    this.appliedSearchTerm = '';
    this.appliedLinkedSaudaFilter = 'All';
    this.appliedSaudaTypeFilter = 'All';
    this.appliedWarehouseFilter = 'All';
    this.appliedEntryDateFilter = '';
    this.showReset = false;
    this.page = 1;
    this.applyFilters();
  }

  updateSummaryAndPagination(): void {
    this.activeTrucksList = this.allTrucks.filter((t) => t.status !== 'Removed');
    this.purchaseLinkedCount = this.activeTrucksList.filter(
      (t) => t.saudaType === 'Purchase',
    ).length;
    this.salesLinkedCount = this.activeTrucksList.filter(
      (t) => t.saudaType === 'Sales',
    ).length;
    this.deliveredCount = this.activeTrucksList.filter(
      (t) => t.status === 'Delivered',
    ).length;
    this.inTransitCount = this.activeTrucksList.filter(
      (t) => t.status === 'In Transit' || t.status === 'Loaded',
    ).length;
    this.brokerageLinkedCount = this.activeTrucksList.filter(
      (t) => t.saudaType === 'Brokerage' || t.saudaType === 'Direct Sale',
    ).length;

    this.itemsPerPageCount =
      this.tableSize === 'all'
        ? Math.max(1, this.filteredTrucks.length)
        : Number(this.tableSize);
    if (this.filteredTrucks.length === 0) {
      this.showingStart = 0;
      this.showingEnd = 0;
    } else {
      this.showingStart = (this.page - 1) * this.itemsPerPageCount + 1;
      this.showingEnd = Math.min(
        this.page * this.itemsPerPageCount,
        this.filteredTrucks.length,
      );
    }
  }

  onTableSizeChange(): void {
    this.page = 1;
    this.updateSummaryAndPagination();
  }

  onTableDataChange(pageNumber: number): void {
    this.page = pageNumber;
    this.updateSummaryAndPagination();
  }

  // ── Helpers for Form ──
  updateFormCalculations(): void {
    // 1. eligibleSaudasForForm
    this.eligibleSaudasForForm = this.allSaudas.filter((s) => {
      if (
        s.status === 'Voided' ||
        s.saudaType === 'Brokerage' ||
        s.saudaType === 'Direct Sale'
      )
        return false;
      if (s.saudaType !== this.targetSaudaType) return false;
      const available = this.erpService.getRemainingQtyMt(
        s.id,
        this.isEditMode ? this.selectedTruck?.id : undefined,
      );
      return available > 0 || s.id === this.truckForm?.get('saudaId')?.value;
    });

    // 2. selectedLinkedSauda
    const saudaId = this.truckForm?.get('saudaId')?.value;
    this.selectedLinkedSauda = saudaId ? this.getSaudaById(saudaId) : undefined;

    // 3. selectedWarehouse
    this.selectedWarehouse = this.truckForm?.get('warehouse')?.value || '';

    // 4. selectedSaudaCommodities
    this.selectedSaudaCommodities = this.selectedLinkedSauda?.commodityItems || [];

    // 5. selectedSaudaRemainingMt
    this.selectedSaudaRemainingMt = saudaId
      ? this.erpService.getRemainingQtyMt(
          saudaId,
          this.isEditMode ? this.selectedTruck?.id : undefined,
        )
      : 0;

    // 6. formTotalWeightMt
    const rows = (this.truckForm?.getRawValue()?.commodityItems ||
      []) as CommodityLineItem[];
    this.formTotalWeightMt = this.erpService.computeTotalWeightMt(rows);

    // 7. availableWarehouseStockMt
    const sauda = this.selectedLinkedSauda;
    const wh = this.selectedWarehouse;
    if (!sauda || !wh || rows.length === 0) {
      this.availableWarehouseStockMt = 0;
    } else {
      let totalAvail = 0;
      for (const item of rows) {
        if (!item.commodity) continue;
        let avail = this.erpService.getWarehouseCommodityStock(
          sauda.clientFirm,
          wh,
          item.commodity,
        );
        if (
          this.isEditMode &&
          this.selectedTruck &&
          (this.selectedTruck.warehouse || '').trim().toLowerCase() ===
            wh.trim().toLowerCase()
        ) {
          const prev = this.selectedTruck.commodityItems.find(
            (ci) =>
              ci.commodity.trim().toLowerCase() ===
              item.commodity.trim().toLowerCase(),
          );
          if (prev) {
            avail += this.erpService.convertItemToMt(prev);
          }
        }
        totalAvail += avail;
      }
      this.availableWarehouseStockMt = Number(totalAvail.toFixed(3));
    }
  }

  setFulfilmentType(type: 'Purchase' | 'Sales'): void {
    if (this.isEditMode || this.targetSaudaType === type) return;
    this.targetSaudaType = type;
    const firstAvailable = this.allSaudas.find(
      (s) =>
        s.status !== 'Voided' &&
        s.saudaType === type &&
        this.erpService.getRemainingQtyMt(s.id) > 0,
    );
    this.truckForm.patchValue({
      saudaId: firstAvailable?.id || '',
    });
    if (firstAvailable) {
      this.onLinkedSaudaChanged(firstAvailable.id);
    } else {
      this.commodityRows.clear();
      this.commodityRows.push(this.createCommodityRow());
    }
    this.updateFormCalculations();
  }

  getWarehouseStockForItem(commodityName: string): number {
    const sauda = this.selectedLinkedSauda;
    const wh = this.selectedWarehouse;
    if (!sauda || !wh || !commodityName) return 0;
    let avail = this.erpService.getWarehouseCommodityStock(
      sauda.clientFirm,
      wh,
      commodityName,
    );
    if (
      this.isEditMode &&
      this.selectedTruck &&
      (this.selectedTruck.warehouse || '').trim().toLowerCase() ===
        wh.trim().toLowerCase()
    ) {
      const prev = this.selectedTruck.commodityItems.find(
        (ci) =>
          ci.commodity.trim().toLowerCase() ===
          commodityName.trim().toLowerCase(),
      );
      if (prev) {
        avail += this.erpService.convertItemToMt(prev);
      }
    }
    return Number(avail.toFixed(3));
  }

  getSaudaById(saudaId: string): SaudaRecord | undefined {
    return this.allSaudas.find((s) => s.id === saudaId);
  }

  // ── Navigation Between Listing / Details / Form ──
  backToListing(): void {
    this.viewMode = 'listing';
    this.formError = '';
  }

  openDetailsView(truck: TruckEntryRecord): void {
    this.selectedTruck = truck;
    this.activeDetailTab = 'details';
    this.viewMode = 'details';
  }

  openCreateForm(
    preselectedSaudaId?: string,
    forceType?: 'Purchase' | 'Sales',
  ): void {
    const today = new Date().toISOString().slice(0, 10);
    this.isEditMode = false;
    this.selectedTruck = null;
    this.formError = '';
    this.selectedParty = '';
    this.saudaSearchTerm = '';
    this.availableGodowns = [];
    this.availableChambers = [];
    this.availableStacks = [];

    let targetSauda: SaudaRecord | undefined;
    if (preselectedSaudaId) {
      targetSauda = this.allSaudas.find((s) => s.id === preselectedSaudaId);
      if (
        targetSauda &&
        (targetSauda.saudaType === 'Brokerage' ||
          targetSauda.saudaType === 'Direct Sale' ||
          targetSauda.saudaType === 'Forward')
      ) {
        this.notificationService.show(
          'Selected Sauda type is not eligible for truck fulfilment.',
          'error',
          4000,
        );
        targetSauda = undefined;
      }
    }

    if (targetSauda) {
      this.targetSaudaType = targetSauda.saudaType as 'Purchase' | 'Sales';
      this.selectedParty = targetSauda.partyName;
    } else if (forceType) {
      this.targetSaudaType = forceType;
    } else {
      this.targetSaudaType = 'Purchase';
    }

    if (!targetSauda) {
      targetSauda = this.allSaudas.find(
        (s) =>
          s.status !== 'Voided' &&
          s.status !== 'On Hold' &&
          s.saudaType === this.targetSaudaType &&
          this.erpService.getRemainingQtyMt(s.id) > 0,
      );
      if (targetSauda) {
        this.selectedParty = targetSauda.partyName;
      }
    }

    const defaultWhRec = this.allWarehouses[0];
    const defaultWh = defaultWhRec?.name || '';
    if (defaultWhRec) {
      this.availableGodowns = this.godowns.filter(
        (g) =>
          g.warehouseId === defaultWhRec.id ||
          g.warehouseName.toLowerCase() === defaultWhRec.name.toLowerCase(),
      );
    }

    this.commodityRows.clear();
    if (targetSauda && targetSauda.commodityItems.length > 0) {
      const remaining = this.erpService.getRemainingQtyMt(targetSauda.id);
      for (const ci of targetSauda.commodityItems) {
        this.commodityRows.push(
          this.createCommodityRow({
            commodity: ci.commodity,
            packagingUom: 'Bag',
            packagingQty: 1,
            weightUom: 'MT',
            actualWeight: remaining > 0 ? remaining : ci.actualWeight,
          }),
        );
      }
    } else {
      this.commodityRows.push(this.createCommodityRow());
    }

    this.truckForm.reset({
      saudaId: targetSauda?.id || '',
      warehouse: defaultWh,
      warehouseId: defaultWhRec?.id || '',
      godownName: '',
      chamberName: '',
      stackNumber: '',
      dispatchDate: today,
      vehicleNo: '',
      remarks: '',
      revisionReason: '',
    });

    this.truckForm.get('revisionReason')?.clearValidators();
    this.truckForm.get('revisionReason')?.updateValueAndValidity();
    this.updateFormCalculations();
    this.viewMode = 'form';
  }

  openEditForm(truck: TruckEntryRecord): void {
    if (truck.status === 'Removed') {
      this.notificationService.show(
        'Removed truck entries cannot be edited.',
        'error',
        3000,
      );
      return;
    }

    this.isEditMode = true;
    this.selectedTruck = truck;
    this.targetSaudaType = truck.saudaType === 'Sales' ? 'Sales' : 'Purchase';
    this.selectedParty = truck.partyName || '';
    this.saudaSearchTerm = '';
    this.formError = '';

    const wh = this.allWarehouses.find(
      (w) => w.name === truck.warehouse || w.id === truck.warehouseId,
    );
    if (wh) {
      this.availableGodowns = this.godowns.filter(
        (g) =>
          g.warehouseId === wh.id ||
          g.warehouseName.toLowerCase() === wh.name.toLowerCase(),
      );
      const gd = this.availableGodowns.find((g) => g.name === truck.godownName);
      this.availableChambers = gd?.chambers || [];
      const ch = this.availableChambers.find(
        (c) => c.name === truck.chamberName,
      );
      this.availableStacks = ch?.stackNumbers || [];
    } else {
      this.availableGodowns = [];
      this.availableChambers = [];
      this.availableStacks = [];
    }

    this.commodityRows.clear();
    for (const item of truck.commodityItems) {
      this.commodityRows.push(this.createCommodityRow(item));
    }
    if (this.commodityRows.length === 0) {
      this.commodityRows.push(this.createCommodityRow());
    }

    this.truckForm.patchValue({
      saudaId: truck.saudaId,
      warehouse: truck.warehouse || '',
      warehouseId: truck.warehouseId || '',
      godownName: truck.godownName || '',
      chamberName: truck.chamberName || '',
      stackNumber: truck.stackNumber || '',
      dispatchDate: truck.dispatchDate,
      vehicleNo: truck.vehicleNo,
      remarks: truck.remarks,
      revisionReason: '',
    });

    this.truckForm
      .get('revisionReason')
      ?.setValidators([Validators.required, Validators.minLength(5)]);
    this.truckForm.get('revisionReason')?.updateValueAndValidity();
    this.updateFormCalculations();
    this.viewMode = 'form';
  }

  submitTruckForm(isFinal: boolean = false): void {
    this.formError = '';
    if (this.truckForm.invalid) {
      this.truckForm.markAllAsTouched();
      this.formError =
        'Please complete all required fields (Sauda, Warehouse, Truck Number, Date, Commodity & Quantity in Ton).';
      return;
    }

    const v = this.truckForm.getRawValue();
    const sauda = this.selectedLinkedSauda;
    const currentTotal = this.formTotalWeightMt;

    if (!isFinal && sauda) {
      const remaining = this.erpService.getRemainingQtyMt(
        sauda.id,
        this.isEditMode ? this.selectedTruck?.id : undefined,
      );
      if (currentTotal > remaining) {
        this.formError = `Current truck weight (${currentTotal} MT) exceeds remaining Sauda balance (${remaining} MT). If this completes the deal, click "Final Submit & Complete Sauda".`;
        return;
      }
    }

    if (isFinal && sauda) {
      const confirmed = window.confirm(
        `Are you sure you want to Final Submit?\n\nThis will adjust Sauda ${sauda.saudaNo} to the actual total fulfilled quantity of ${this.projectedTotalMt} MT (Original was ${this.totalSaudaQtyMt} MT) and mark the Sauda as Completed.`,
      );
      if (!confirmed) return;
    }

    const payload = {
      saudaId: v.saudaId,
      partyName: this.selectedParty || sauda?.partyName,
      warehouse: (v.warehouse || '').trim(),
      warehouseId: v.warehouseId || '',
      godownName: (v.godownName || '').trim(),
      chamberName: (v.chamberName || '').trim(),
      stackNumber: (v.stackNumber || '').trim(),
      dispatchDate: v.dispatchDate,
      expectedArrivalDate: v.dispatchDate,
      vehicleNo: v.vehicleNo.trim().toUpperCase(),
      status: (isFinal ? 'Delivered' : 'In Transit') as TruckStatus,
      freightRatePerMt: this.selectedTruck?.freightRatePerMt || 1100,
      advancePaid: this.selectedTruck?.advancePaid || 0,
      isFinalSubmit: isFinal,
      commodityItems: (v.commodityItems || []).map((c: any) => ({
        commodity: c.commodity,
        packagingUom: 'Bag',
        packagingQty: 1,
        weightUom: 'MT' as WeightUom,
        actualWeight: Number(c.actualWeight),
      })),
      remarks: (v.remarks || '').trim(),
    };

    const result =
      this.isEditMode && this.selectedTruck
        ? this.erpService.updateTruck(
            this.selectedTruck.id,
            payload,
            v.revisionReason,
          )
        : this.erpService.createTruck(payload);

    if (!result.ok) {
      this.formError = result.message;
      this.notificationService.show(result.message, 'error', 3500);
      return;
    }

    this.notificationService.show(result.message, 'success', 3000);
    if (this.isEditMode && this.selectedTruck) {
      this.viewMode = 'details';
    } else {
      this.viewMode = 'listing';
    }
  }

  // ── Screen 5: Removal Confirmation ──
  openRemoveModal(truck: TruckEntryRecord): void {
    this.selectedTruck = truck;
    this.removeError = '';
    this.removeForm.reset({ reason: '', confirmed: false });
    this.isRemoveOpen = true;
  }

  closeRemoveModal(): void {
    this.isRemoveOpen = false;
    this.removeError = '';
  }

  confirmRemoval(): void {
    this.removeError = '';
    if (!this.selectedTruck) return;

    if (this.selectedTruck.status === 'Delivered') {
      this.removeError = 'Delivered truck entries cannot be removed.';
      return;
    }

    if (this.removeForm.invalid) {
      this.removeForm.markAllAsTouched();
      this.removeError =
        'Enter a removal reason (min 10 characters) and check the confirmation box.';
      return;
    }

    const result = this.erpService.removeTruck(
      this.selectedTruck.id,
      this.removeForm.value.reason,
    );

    if (!result.ok) {
      this.removeError = result.message;
      this.notificationService.show(result.message, 'error', 3500);
      return;
    }

    this.notificationService.show(result.message, 'success', 3000);
    this.closeRemoveModal();
  }

  getRecordBadgeClass(status: string): string {
    return status === 'Removed' ? 'badge-red' : 'badge-green';
  }
}
