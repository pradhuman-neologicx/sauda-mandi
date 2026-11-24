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
  CommodityLineItem,
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

  ngOnInit(): void {
    this.initForms();

    combineLatest([
      this.erpService.trucks$,
      this.erpService.saudas$,
      this.erpService.warehouses$,
      this.erpService.packagingUoms$,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([trucks, saudas, warehouses, pkgs]) => {
        this.allTrucks = trucks;
        this.allSaudas = saudas;
        this.allWarehouses = warehouses.filter((w) => w.isActive);
        this.dynamicPackagingUoms = (pkgs || []).filter((p) => p.isActive);
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
    const defaultPkg =
      item?.packagingUom || (this.dynamicPackagingUoms[0]?.name || 'Bag');
    let initialWeight: number | null = null;
    if (item) {
      if (item.actualWeight && item.weightUom) {
        if (item.weightUom === 'KG') initialWeight = Number((item.actualWeight / 1000).toFixed(3));
        else if (item.weightUom === 'Quintal') initialWeight = Number((item.actualWeight / 10).toFixed(3));
        else initialWeight = Number(item.actualWeight);
      } else if (item.packagingQty) {
        const bagKg = this.getPackagingCapacity(defaultPkg);
        initialWeight = Number(((item.packagingQty * bagKg) / 1000).toFixed(3));
      }
    }

    const row = this.fb.group({
      commodity: [item?.commodity || '', Validators.required],
      packagingUom: [defaultPkg, Validators.required],
      packagingQty: [
        item?.packagingQty ?? null,
        [Validators.required, Validators.min(1)],
      ],
      weightUom: ['MT'],
      actualWeight: [
        initialWeight,
        [Validators.required, Validators.min(0.001)],
      ],
    });

    row
      .get('packagingUom')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.recomputeTruckRowWeight(row);
      });

    row
      .get('packagingQty')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.recomputeTruckRowWeight(row);
      });

    return row;
  }

  recomputeTruckRowWeight(row: FormGroup | AbstractControl): void {
    const pkgName = row.get('packagingUom')?.value;
    const qty = Number(row.get('packagingQty')?.value) || 0;
    const bagKg = this.getPackagingCapacity(pkgName);
    const weightMt = qty > 0 ? Number(((qty * bagKg) / 1000).toFixed(3)) : 0;
    row.get('actualWeight')?.setValue(weightMt > 0 ? weightMt : null, { emitEvent: false });
    row.get('weightUom')?.setValue('MT', { emitEvent: false });
    this.updateFormCalculations();
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
    this.updateFormCalculations();
  }

  removeCommodityRow(index: number): void {
    if (this.commodityRows.length > 1) {
      this.commodityRows.removeAt(index);
      this.updateFormCalculations();
    }
  }

  private onLinkedSaudaChanged(saudaId: string): void {
    if (!saudaId || this.isEditMode) return;
    const sauda = this.getSaudaById(saudaId);
    if (!sauda) return;
    if (sauda.saudaType === 'Purchase' || sauda.saudaType === 'Sales') {
      this.targetSaudaType = sauda.saudaType;
    }
    const first = sauda.commodityItems[0];
    if (first) {
      this.commodityRows.clear();
      this.commodityRows.push(
        this.createCommodityRow({
          commodity: first.commodity,
          packagingUom: first.packagingUom,
          packagingQty: 1,
          weightUom: first.weightUom,
          actualWeight: 100,
        }),
      );
    }
    this.updateFormCalculations();
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

    let targetSauda: SaudaRecord | undefined;
    if (preselectedSaudaId) {
      targetSauda = this.allSaudas.find((s) => s.id === preselectedSaudaId);
      if (
        targetSauda &&
        (targetSauda.saudaType === 'Brokerage' ||
          targetSauda.saudaType === 'Direct Sale')
      ) {
        this.notificationService.show(
          'Direct Sale Saudas are not eligible for truck fulfilment (BR-TF-12).',
          'error',
          4000,
        );
        targetSauda = undefined;
      }
    }

    if (targetSauda) {
      this.targetSaudaType = targetSauda.saudaType as 'Purchase' | 'Sales';
    } else if (forceType) {
      this.targetSaudaType = forceType;
    } else {
      this.targetSaudaType = 'Purchase';
    }

    if (!targetSauda) {
      targetSauda = this.allSaudas.find(
        (s) =>
          s.status !== 'Voided' &&
          s.saudaType === this.targetSaudaType &&
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
    this.updateFormCalculations();
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
