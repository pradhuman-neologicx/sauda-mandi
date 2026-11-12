import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
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
  BuyerRecord,
  CommodityLineItem,
  FirmRecord,
  InvCategoryRecord,
  InvProductRecord,
  InvSubCategoryRecord,
  PackagingUom,
  SaudaErpMockService,
  SaudaRecord,
  SaudaType,
  SellerRecord,
  TruckEntryRecord,
  WeightUom,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

export interface InventoryCommodityOption {
  value: string;
  label: string;
  categoryName: string;
  packagingUom: PackagingUom;
  weightUom: WeightUom;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyPipe,
    DecimalPipe,
    NgxPaginationModule,
  ],
  selector: 'app-sauda-management',
  templateUrl: './sauda-management.component.html',
  styleUrl: './sauda-management.component.scss',
})
export class SaudaManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  viewMode: 'listing' | 'form' = 'listing';

  allSaudas: SaudaRecord[] = [];
  filteredSaudas: SaudaRecord[] = [];
  activeFirms: FirmRecord[] = [];
  activeSellers: SellerRecord[] = [];
  activeBuyers: BuyerRecord[] = [];
  inventoryCommodityOptions: InventoryCommodityOption[] = [];

  // Listing Filters (applied on Search click)
  searchTerm = '';
  typeFilter: 'All' | SaudaType = 'All';
  firmFilter = 'All';
  voidFilter: 'exclude' | 'all' | 'only' = 'exclude';

  appliedSearchTerm = '';
  appliedTypeFilter: 'All' | SaudaType = 'All';
  appliedFirmFilter = 'All';
  appliedVoidFilter: 'exclude' | 'all' | 'only' = 'exclude';
  showReset = false;

  // Pagination
  page = 1;
  tableSize: number | 'all' = 10;
  tableSizes: (number | 'all')[] = [10, 25, 50, 'all'];

  readonly saudaTypes: SaudaType[] = ['Purchase', 'Sales', 'Brokerage'];
  commodities: string[] = [];
  readonly packagingUoms: PackagingUom[] = [
    'Bag',
    'Crate',
    'Box',
    'Carton',
    'Sack',
    'Loose',
  ];
  readonly weightUoms: WeightUom[] = ['KG', 'Quintal', 'MT'];

  sellerOptions: string[] = [];
  buyerOptions: string[] = [];

  // Screen states
  isEditMode = false;
  isDetailsOpen = false;
  isRevisionOpen = false;
  isVoidOpen = false;

  selectedSauda: SaudaRecord | null = null;
  linkedTrucks: TruckEntryRecord[] = [];

  saudaForm!: FormGroup;
  voidForm!: FormGroup;
  formError = '';
  voidError = '';

  constructor(
    private fb: FormBuilder,
    public erpService: SaudaErpMockService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initForms();

    combineLatest([
      this.erpService.saudas$,
      this.erpService.firms$,
      this.erpService.sellers$,
      this.erpService.buyers$,
      this.erpService.invProducts$,
      this.erpService.invSubCategories$,
      this.erpService.invCategories$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([
          saudas,
          firms,
          sellers,
          buyers,
          invProducts,
          invSubCategories,
          invCategories,
        ]) => {
          this.allSaudas = saudas;
          this.activeFirms = firms.filter((f) => f.isActive);
          this.activeSellers = sellers.filter((s) => s.isActive);
          this.activeBuyers = buyers.filter((b) => b.isActive);

          this.sellerOptions = this.activeSellers.map((s) => s.name);
          this.buyerOptions = this.activeBuyers.map((b) => b.name);

          this.buildInventoryCommodityOptions(
            invProducts,
            invSubCategories,
            invCategories,
          );

          this.applyFilters();
          if (this.selectedSauda) {
            this.selectedSauda =
              saudas.find((s) => s.id === this.selectedSauda!.id) || null;
            if (this.selectedSauda) {
              this.linkedTrucks = this.erpService.getAllTrucksForSauda(
                this.selectedSauda.id,
              );
            }
          }
        },
      );

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params['action'] === 'create') {
          this.openCreateForm();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForms(): void {
    const today = new Date().toISOString().slice(0, 10);
    this.saudaForm = this.fb.group({
      saudaType: ['Purchase', Validators.required],
      saudaDate: [today, Validators.required],
      clientFirm: ['', Validators.required],
      sellerName: ['', Validators.required],
      buyerName: [''],
      commodityItems: this.fb.array([this.createCommodityRow()]),
      totalAmountInr: [null, [Validators.required, Validators.min(1)]],
      sellerCreditPeriodDays: [null, Validators.min(0)],
      sellerCreditStartDate: [''],
      sellerDueDate: [{ value: '', disabled: true }],
      buyerCreditPeriodDays: [null, Validators.min(0)],
      buyerCreditStartDate: [''],
      buyerDueDate: [{ value: '', disabled: true }],
      remarks: [''],
      revisionReason: [''],
    });

    this.saudaForm
      .get('saudaType')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((type: SaudaType) => {
        this.updatePartyValidators(type);
      });

    // Auto-calculate Seller & Buyer Due Dates using calendar days
    this.saudaForm
      .get('sellerCreditPeriodDays')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.recomputeDueDate('seller'));
    this.saudaForm
      .get('sellerCreditStartDate')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.recomputeDueDate('seller'));

    this.saudaForm
      .get('buyerCreditPeriodDays')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.recomputeDueDate('buyer'));
    this.saudaForm
      .get('buyerCreditStartDate')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.recomputeDueDate('buyer'));

    this.voidForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10)]],
      confirmed: [false, Validators.requiredTrue],
    });
  }

  private createCommodityRow(item?: CommodityLineItem): FormGroup {
    return this.fb.group({
      commodity: [item?.commodity || '', Validators.required],
      packagingUom: [item?.packagingUom || 'Bag', Validators.required],
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
    return this.saudaForm.get('commodityItems') as FormArray;
  }

  private buildInventoryCommodityOptions(
    invProducts: InvProductRecord[],
    invSubCategories: InvSubCategoryRecord[],
    invCategories: InvCategoryRecord[],
  ): void {
    const subMap = new Map(invSubCategories.map((s) => [s.id, s]));
    const catMap = new Map(invCategories.map((c) => [c.id, c]));

    const options: InventoryCommodityOption[] = [];
    for (const prod of invProducts) {
      if (!prod.isActive) continue;
      const sub = subMap.get(prod.subCategoryId);
      const cat = sub ? catMap.get(sub.categoryId) : undefined;
      if (cat && !cat.isActive) continue;
      if (cat && cat.name.toLowerCase().includes('packaging')) continue;

      const value = (prod.commodityName || prod.name).trim();
      const catName = cat?.name || 'Inventory';
      const label =
        prod.commodityName && prod.commodityName !== prod.name
          ? `${prod.commodityName} — ${prod.name} (${catName})`
          : `${prod.name} (${catName})`;

      options.push({
        value,
        label,
        categoryName: catName,
        packagingUom: prod.packagingUom,
        weightUom: prod.weightUom,
      });
    }

    this.inventoryCommodityOptions = options;
    this.commodities = options.map((o) => o.value);
  }

  onCommoditySelected(index: number): void {
    const row = this.commodityRows.at(index);
    if (!row) return;
    const val = (row.get('commodity')?.value || '').trim();
    const match = this.inventoryCommodityOptions.find((o) => o.value === val);
    if (match) {
      row.patchValue(
        {
          packagingUom: match.packagingUom,
          weightUom: match.weightUom,
        },
        { emitEvent: false },
      );
    }
  }

  hasOptionForCommodity(value: string): boolean {
    return (
      !value || this.inventoryCommodityOptions.some((o) => o.value === value)
    );
  }

  addCommodityRow(): void {
    this.commodityRows.push(this.createCommodityRow());
  }

  removeCommodityRow(index: number): void {
    if (this.commodityRows.length > 1) {
      this.commodityRows.removeAt(index);
    }
  }

  private updatePartyValidators(type: SaudaType): void {
    const sellerCtrl = this.saudaForm.get('sellerName');
    const buyerCtrl = this.saudaForm.get('buyerName');
    if (!sellerCtrl || !buyerCtrl) return;

    if (type === 'Purchase') {
      sellerCtrl.setValidators([Validators.required]);
      buyerCtrl.clearValidators();
    } else if (type === 'Sales') {
      sellerCtrl.clearValidators();
      buyerCtrl.setValidators([Validators.required]);
    } else {
      sellerCtrl.setValidators([Validators.required]);
      buyerCtrl.setValidators([Validators.required]);
    }
    sellerCtrl.updateValueAndValidity({ emitEvent: false });
    buyerCtrl.updateValueAndValidity({ emitEvent: false });
  }

  private recomputeDueDate(side: 'seller' | 'buyer'): void {
    const daysCtrl = this.saudaForm.get(`${side}CreditPeriodDays`);
    const startCtrl = this.saudaForm.get(`${side}CreditStartDate`);
    const dueCtrl = this.saudaForm.get(`${side}DueDate`);
    if (!daysCtrl || !startCtrl || !dueCtrl) return;

    const days = Number(daysCtrl.value);
    const start = startCtrl.value as string;
    if (!start || isNaN(days) || daysCtrl.value === null || daysCtrl.value === '') {
      dueCtrl.setValue('', { emitEvent: false });
      return;
    }

    const dt = new Date(`${start}T00:00:00`);
    if (isNaN(dt.getTime())) {
      dueCtrl.setValue('', { emitEvent: false });
      return;
    }
    dt.setDate(dt.getDate() + days);
    const iso = dt.toISOString().slice(0, 10);
    dueCtrl.setValue(iso, { emitEvent: false });
  }

  // ── KPI Counts (matching active Saudas breakdown) ──
  get activeSaudasList(): SaudaRecord[] {
    return this.allSaudas.filter((s) => s.status !== 'Voided');
  }

  get purchaseCount(): number {
    return this.activeSaudasList.filter((s) => s.saudaType === 'Purchase')
      .length;
  }

  get salesCount(): number {
    return this.activeSaudasList.filter((s) => s.saudaType === 'Sales').length;
  }

  get brokerageCount(): number {
    return this.activeSaudasList.filter((s) => s.saudaType === 'Brokerage')
      .length;
  }

  get firmFilterOptions(): string[] {
    const names = new Set<string>();
    this.activeFirms.forEach((f) => names.add(f.name));
    this.allSaudas.forEach((s) => {
      if (s.clientFirm) names.add(s.clientFirm);
    });
    return Array.from(names);
  }

  // ── Listing Search, Filter & Pagination ──
  onSearch(): void {
    this.appliedSearchTerm = this.searchTerm.trim();
    this.appliedTypeFilter = this.typeFilter;
    this.appliedFirmFilter = this.firmFilter;
    this.appliedVoidFilter = this.voidFilter;
    this.showReset =
      this.appliedSearchTerm.length > 0 ||
      this.appliedTypeFilter !== 'All' ||
      this.appliedFirmFilter !== 'All' ||
      this.appliedVoidFilter !== 'exclude';
    this.page = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.appliedSearchTerm.toLowerCase();
    this.filteredSaudas = this.allSaudas.filter((s) => {
      const matchesQuery =
        !q ||
        s.saudaNo.toLowerCase().includes(q) ||
        s.partyName.toLowerCase().includes(q) ||
        s.clientFirm.toLowerCase().includes(q) ||
        s.commodity.toLowerCase().includes(q);
      const matchesType =
        this.appliedTypeFilter === 'All' ||
        s.saudaType === this.appliedTypeFilter;
      const matchesFirm =
        this.appliedFirmFilter === 'All' ||
        s.clientFirm === this.appliedFirmFilter;
      const matchesVoid =
        this.appliedVoidFilter === 'all'
          ? true
          : this.appliedVoidFilter === 'exclude'
            ? s.status !== 'Voided'
            : s.status === 'Voided';
      return matchesQuery && matchesType && matchesFirm && matchesVoid;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.typeFilter = 'All';
    this.firmFilter = 'All';
    this.voidFilter = 'exclude';
    this.appliedSearchTerm = '';
    this.appliedTypeFilter = 'All';
    this.appliedFirmFilter = 'All';
    this.appliedVoidFilter = 'exclude';
    this.showReset = false;
    this.page = 1;
    this.applyFilters();
  }

  get itemsPerPageCount(): number {
    return this.tableSize === 'all'
      ? Math.max(1, this.filteredSaudas.length)
      : Number(this.tableSize);
  }

  get showingStart(): number {
    if (this.filteredSaudas.length === 0) return 0;
    return (this.page - 1) * this.itemsPerPageCount + 1;
  }

  get showingEnd(): number {
    return Math.min(
      this.page * this.itemsPerPageCount,
      this.filteredSaudas.length,
    );
  }

  onTableSizeChange(): void {
    this.page = 1;
  }

  onTableDataChange(pageNumber: number): void {
    this.page = pageNumber;
  }

  // ── Screen 2: Create / Edit Sauda View ──

  openCreateForm(): void {
    const today = new Date().toISOString().slice(0, 10);
    this.closeAllModals();
    this.isEditMode = false;
    this.selectedSauda = null;
    this.formError = '';

    this.commodityRows.clear();
    this.commodityRows.push(this.createCommodityRow());

    this.saudaForm.reset({
      saudaType: 'Purchase',
      saudaDate: today,
      clientFirm: this.activeFirms[0]?.name || '',
      sellerName: '',
      buyerName: '',
      totalAmountInr: null,
      sellerCreditPeriodDays: null,
      sellerCreditStartDate: '',
      sellerDueDate: '',
      buyerCreditPeriodDays: null,
      buyerCreditStartDate: '',
      buyerDueDate: '',
      remarks: '',
      revisionReason: '',
    });

    this.updatePartyValidators('Purchase');
    this.saudaForm.get('revisionReason')?.clearValidators();
    this.saudaForm.get('revisionReason')?.updateValueAndValidity();
    this.viewMode = 'form';
  }

  openEditForm(sauda: SaudaRecord): void {
    if (sauda.status === 'Voided') {
      this.notificationService.show(
        'Voided Sauda contracts cannot be edited.',
        'error',
        3000,
      );
      return;
    }

    this.closeAllModals();
    this.isEditMode = true;
    this.selectedSauda = sauda;
    this.formError = '';

    this.commodityRows.clear();
    for (const item of sauda.commodityItems) {
      this.commodityRows.push(this.createCommodityRow(item));
    }
    if (this.commodityRows.length === 0) {
      this.commodityRows.push(this.createCommodityRow());
    }

    this.saudaForm.patchValue({
      saudaType: sauda.saudaType,
      saudaDate: sauda.saudaDate,
      clientFirm: sauda.clientFirm,
      sellerName: sauda.sellerName,
      buyerName: sauda.buyerName,
      totalAmountInr: sauda.totalAmountInr,
      sellerCreditPeriodDays: sauda.sellerCreditPeriodDays,
      sellerCreditStartDate: sauda.sellerCreditStartDate,
      sellerDueDate: sauda.sellerDueDate,
      buyerCreditPeriodDays: sauda.buyerCreditPeriodDays,
      buyerCreditStartDate: sauda.buyerCreditStartDate,
      buyerDueDate: sauda.buyerDueDate,
      remarks: sauda.remarks,
      revisionReason: '',
    });

    this.updatePartyValidators(sauda.saudaType);
    this.saudaForm
      .get('revisionReason')
      ?.setValidators([Validators.required, Validators.minLength(5)]);
    this.saudaForm.get('revisionReason')?.updateValueAndValidity();
    this.viewMode = 'form';
  }

  backToListing(): void {
    this.viewMode = 'listing';
    this.formError = '';
  }

  submitSaudaForm(): void {
    this.formError = '';
    if (this.saudaForm.invalid) {
      this.saudaForm.markAllAsTouched();
      this.formError = 'Please complete all required fields cleanly.';
      return;
    }

    const v = this.saudaForm.getRawValue();
    const payload = {
      saudaType: v.saudaType as SaudaType,
      saudaDate: v.saudaDate,
      clientFirm: v.clientFirm,
      sellerName: (v.sellerName || '').trim(),
      buyerName: (v.buyerName || '').trim(),
      commodityItems: (v.commodityItems || []).map((c: any) => ({
        commodity: c.commodity,
        packagingUom: c.packagingUom,
        packagingQty: Number(c.packagingQty),
        weightUom: c.weightUom,
        actualWeight: Number(c.actualWeight),
      })),
      totalAmountInr: Number(v.totalAmountInr),
      sellerCreditPeriodDays:
        v.sellerCreditPeriodDays !== null && v.sellerCreditPeriodDays !== ''
          ? Number(v.sellerCreditPeriodDays)
          : null,
      sellerCreditStartDate: v.sellerCreditStartDate || '',
      sellerDueDate: v.sellerDueDate || '',
      buyerCreditPeriodDays:
        v.buyerCreditPeriodDays !== null && v.buyerCreditPeriodDays !== ''
          ? Number(v.buyerCreditPeriodDays)
          : null,
      buyerCreditStartDate: v.buyerCreditStartDate || '',
      buyerDueDate: v.buyerDueDate || '',
      remarks: (v.remarks || '').trim(),
    };

    const result =
      this.isEditMode && this.selectedSauda
        ? this.erpService.updateSauda(
            this.selectedSauda.id,
            payload,
            v.revisionReason,
          )
        : this.erpService.createSauda(payload);

    if (!result.ok) {
      this.formError = result.message;
      this.notificationService.show(result.message, 'error', 3500);
      return;
    }

    this.notificationService.show(result.message, 'success', 3000);
    this.viewMode = 'listing';
  }

  // ── Screen 3: Sauda Details ──
  openDetailsModal(sauda: SaudaRecord): void {
    this.closeAllModals();
    this.selectedSauda = sauda;
    this.linkedTrucks = this.erpService.getAllTrucksForSauda(sauda.id);
    this.isDetailsOpen = true;
  }

  // ── Screen 4: Revision History ──
  openRevisionModal(sauda: SaudaRecord): void {
    this.closeAllModals();
    this.selectedSauda = sauda;
    this.isRevisionOpen = true;
  }

  // ── Screen 5: Void Confirmation ──
  openVoidModal(sauda: SaudaRecord): void {
    this.closeAllModals();
    this.selectedSauda = sauda;
    this.linkedTrucks = this.erpService.getActiveTrucksForSauda(sauda.id);
    this.voidError = '';
    this.voidForm.reset({ reason: '', confirmed: false });
    this.isVoidOpen = true;
  }

  confirmVoid(): void {
    this.voidError = '';
    if (!this.selectedSauda) return;

    if (this.linkedTrucks.length > 0) {
      this.voidError = `Cannot void ${this.selectedSauda.saudaNo} because ${this.linkedTrucks.length} active truck entry(s) are still linked.`;
      return;
    }

    if (this.voidForm.invalid) {
      this.voidForm.markAllAsTouched();
      this.voidError =
        'Enter a void reason (min 10 characters) and check the confirmation box.';
      return;
    }

    const result = this.erpService.voidSauda(
      this.selectedSauda.id,
      this.voidForm.value.reason,
    );

    if (!result.ok) {
      this.voidError = result.message;
      this.notificationService.show(result.message, 'error', 3500);
      return;
    }

    this.notificationService.show(result.message, 'success', 3000);
    this.closeAllModals();
  }

  closeAllModals(): void {
    this.isDetailsOpen = false;
    this.isRevisionOpen = false;
    this.isVoidOpen = false;
    this.voidError = '';
  }

  getRecordBadgeClass(status: string): string {
    return status === 'Voided' ? 'badge-red' : 'badge-green';
  }
}
