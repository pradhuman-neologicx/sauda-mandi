import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  CommodityLineItem,
  PackagingUom,
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
export class TruckManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  viewMode: 'listing' | 'details' | 'form' = 'listing';
  activeDetailTab: 'details' | 'commodities' | 'revisions' = 'details';

  allTrucks: TruckEntryRecord[] = [];
  filteredTrucks: TruckEntryRecord[] = [];
  allSaudas: SaudaRecord[] = [];
  allWarehouses: WarehouseRecord[] = [];

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
  readonly packagingUoms: PackagingUom[] = [
    'Bag',
    'Crate',
    'Box',
    'Carton',
    'Sack',
    'Loose',
  ];
  readonly weightUoms: WeightUom[] = ['KG', 'Quintal', 'MT'];

  // Form / Modal states
  isEditMode = false;
  isRemoveOpen = false;
  selectedTruck: TruckEntryRecord | null = null;

  truckForm!: FormGroup;
  removeForm!: FormGroup;
  formError = '';
  removeError = '';

  constructor(
    private fb: FormBuilder,
    public erpService: SaudaErpMockService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initForms();

    combineLatest([
      this.erpService.trucks$,
      this.erpService.saudas$,
      this.erpService.warehouses$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([trucks, saudas, warehouses]) => {
        this.allTrucks = trucks;
        this.allSaudas = saudas;
        this.allWarehouses = warehouses.filter((w) => w.isActive);
        this.applyFilters();
        if (this.selectedTruck) {
          this.selectedTruck =
            trucks.find((t) => t.id === this.selectedTruck!.id) || null;
        }
      });

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params['action'] === 'create' || params['saudaId']) {
          this.openCreateForm(params['saudaId']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForms(): void {
    const today = new Date().toISOString().slice(0, 10);
    this.truckForm = this.fb.group({
      saudaId: ['', Validators.required],
      warehouse: ['', Validators.required],
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
      status: ['In Transit', Validators.required],
      driverName: [''],
      driverPhone: ['', [Validators.pattern(/^([6-9]\d{9})?$/)]],
      transporterName: [''],
      lrNo: [''],
      expectedArrivalDate: [''],
      commodityItems: this.fb.array([this.createCommodityRow()]),
      remarks: [''],
      revisionReason: [''],
    });

    this.truckForm
      .get('saudaId')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((saudaId: string) => {
        this.onLinkedSaudaChanged(saudaId);
      });

    this.removeForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10)]],
      confirmed: [false, Validators.requiredTrue],
    });
  }

  private createCommodityRow(item?: CommodityLineItem): FormGroup {
    return this.fb.group({
      commodity: [item?.commodity || '', Validators.required],
      packagingUom: [item?.packagingUom || 'Crate', Validators.required],
      packagingQty: [
        item?.packagingQty ?? null,
        [Validators.required, Validators.min(1)],
      ],
      weightUom: [item?.weightUom || 'KG', Validators.required],
      actualWeight: [
        item?.actualWeight ?? null,
        [Validators.required, Validators.min(0.1)],
      ],
    });
  }

  get commodityRows(): FormArray {
    return this.truckForm.get('commodityItems') as FormArray;
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
              weightUom: first.weightUom,
              actualWeight: 0,
            }
          : undefined,
      ),
    );
  }

  removeCommodityRow(index: number): void {
    if (this.commodityRows.length > 1) {
      this.commodityRows.removeAt(index);
    }
  }

  private onLinkedSaudaChanged(saudaId: string): void {
    if (!saudaId || this.isEditMode) return;
    const sauda = this.getSaudaById(saudaId);
    if (!sauda) return;
    const first = sauda.commodityItems[0];
    if (first && this.commodityRows.length === 1) {
      const row = this.commodityRows.at(0);
      if (!row.get('commodity')?.value) {
        row.patchValue(
          {
            commodity: first.commodity,
            packagingUom: first.packagingUom,
            weightUom: first.weightUom,
          },
          { emitEvent: false },
        );
      }
    }
  }

  // ── KPI Counts (active non-removed entries) ──
  get activeTrucksList(): TruckEntryRecord[] {
    return this.allTrucks.filter((t) => t.status !== 'Removed');
  }

  get purchaseLinkedCount(): number {
    return this.activeTrucksList.filter((t) => t.saudaType === 'Purchase')
      .length;
  }

  get salesLinkedCount(): number {
    return this.activeTrucksList.filter((t) => t.saudaType === 'Sales').length;
  }

  get deliveredCount(): number {
    return this.activeTrucksList.filter((t) => t.status === 'Delivered').length;
  }

  get inTransitCount(): number {
    return this.activeTrucksList.filter(
      (t) => t.status === 'In Transit' || t.status === 'Loaded',
    ).length;
  }

  get brokerageLinkedCount(): number {
    return this.activeTrucksList.filter((t) => t.saudaType === 'Brokerage')
      .length;
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

  get itemsPerPageCount(): number {
    return this.tableSize === 'all'
      ? Math.max(1, this.filteredTrucks.length)
      : Number(this.tableSize);
  }

  get showingStart(): number {
    if (this.filteredTrucks.length === 0) return 0;
    return (this.page - 1) * this.itemsPerPageCount + 1;
  }

  get showingEnd(): number {
    return Math.min(
      this.page * this.itemsPerPageCount,
      this.filteredTrucks.length,
    );
  }

  onTableSizeChange(): void {
    this.page = 1;
  }

  onTableDataChange(pageNumber: number): void {
    this.page = pageNumber;
  }

  // ── Helpers for Form ──
  get eligibleSaudasForForm(): SaudaRecord[] {
    return this.allSaudas.filter((s) => {
      if (s.status === 'Voided' || s.saudaType === 'Brokerage') return false;
      const available = this.erpService.getRemainingQtyMt(
        s.id,
        this.isEditMode ? this.selectedTruck?.id : undefined,
      );
      return available > 0 || s.id === this.truckForm?.get('saudaId')?.value;
    });
  }

  get selectedWarehouse(): string {
    return this.truckForm?.get('warehouse')?.value || '';
  }

  get availableWarehouseStockMt(): number {
    const sauda = this.selectedLinkedSauda;
    const wh = this.selectedWarehouse;
    if (!sauda || !wh) return 0;

    const rawItems = (this.truckForm?.getRawValue()?.commodityItems ||
      []) as CommodityLineItem[];
    if (rawItems.length === 0) return 0;

    let totalAvail = 0;
    for (const item of rawItems) {
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
    return Number(totalAvail.toFixed(3));
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

  get selectedLinkedSauda(): SaudaRecord | undefined {
    const id = this.truckForm?.get('saudaId')?.value;
    return id ? this.getSaudaById(id) : undefined;
  }

  get selectedSaudaCommodities(): CommodityLineItem[] {
    return this.selectedLinkedSauda?.commodityItems || [];
  }

  get selectedSaudaRemainingMt(): number {
    const saudaId = this.truckForm?.get('saudaId')?.value;
    if (!saudaId) return 0;
    return this.erpService.getRemainingQtyMt(
      saudaId,
      this.isEditMode ? this.selectedTruck?.id : undefined,
    );
  }

  get formTotalWeightMt(): number {
    const rows = (this.truckForm?.getRawValue()?.commodityItems ||
      []) as CommodityLineItem[];
    return this.erpService.computeTotalWeightMt(rows);
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

  openCreateForm(preselectedSaudaId?: string): void {
    const today = new Date().toISOString().slice(0, 10);
    this.isEditMode = false;
    this.selectedTruck = null;
    this.formError = '';

    let targetSauda: SaudaRecord | undefined;
    if (preselectedSaudaId) {
      targetSauda = this.allSaudas.find((s) => s.id === preselectedSaudaId);
      if (targetSauda && targetSauda.saudaType === 'Brokerage') {
        this.notificationService.show(
          'Brokerage Saudas are not eligible for truck fulfilment (BR-TF-12).',
          'error',
          4000,
        );
        targetSauda = undefined;
      }
    }

    if (!targetSauda) {
      targetSauda = this.allSaudas.find(
        (s) =>
          s.status !== 'Voided' &&
          s.saudaType !== 'Brokerage' &&
          this.erpService.getRemainingQtyMt(s.id) > 0,
      );
    }

    this.commodityRows.clear();
    const firstItem = targetSauda?.commodityItems[0];
    this.commodityRows.push(
      this.createCommodityRow(
        firstItem
          ? {
              commodity: firstItem.commodity,
              packagingUom: firstItem.packagingUom,
              packagingQty: 1,
              weightUom: firstItem.weightUom,
              actualWeight: 100,
            }
          : undefined,
      ),
    );

    this.truckForm.reset({
      saudaId: targetSauda?.id || '',
      warehouse: this.allWarehouses[0]?.name || '',
      dispatchDate: today,
      vehicleNo: '',
      status: 'In Transit',
      driverName: '',
      driverPhone: '',
      transporterName: '',
      lrNo: '',
      expectedArrivalDate: '',
      remarks: '',
      revisionReason: '',
    });

    this.truckForm.get('revisionReason')?.clearValidators();
    this.truckForm.get('revisionReason')?.updateValueAndValidity();
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
    this.formError = '';

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
      dispatchDate: truck.dispatchDate,
      vehicleNo: truck.vehicleNo,
      status: truck.status,
      driverName: truck.driverName,
      driverPhone: truck.driverPhone,
      transporterName: truck.transporterName,
      lrNo: truck.lrNo,
      expectedArrivalDate: truck.expectedArrivalDate,
      remarks: truck.remarks,
      revisionReason: '',
    });

    this.truckForm
      .get('revisionReason')
      ?.setValidators([Validators.required, Validators.minLength(5)]);
    this.truckForm.get('revisionReason')?.updateValueAndValidity();
    this.viewMode = 'form';
  }

  submitTruckForm(): void {
    this.formError = '';
    if (this.truckForm.invalid) {
      this.truckForm.markAllAsTouched();
      this.formError = 'Please complete all required fields cleanly.';
      return;
    }

    const v = this.truckForm.getRawValue();
    const payload = {
      saudaId: v.saudaId,
      warehouse: (v.warehouse || '').trim(),
      dispatchDate: v.dispatchDate,
      expectedArrivalDate: v.expectedArrivalDate || v.dispatchDate,
      vehicleNo: v.vehicleNo.trim().toUpperCase(),
      status: v.status as TruckStatus,
      driverName: (v.driverName || '').trim(),
      driverPhone: (v.driverPhone || '').trim(),
      transporterName: (v.transporterName || '').trim(),
      lrNo: (v.lrNo || '').trim().toUpperCase(),
      freightRatePerMt: this.selectedTruck?.freightRatePerMt || 1100,
      advancePaid: this.selectedTruck?.advancePaid || 0,
      commodityItems: (v.commodityItems || []).map((c: any) => ({
        commodity: c.commodity,
        packagingUom: c.packagingUom,
        packagingQty: Number(c.packagingQty),
        weightUom: c.weightUom,
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
