import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { combineLatest } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BrokerageBillingMode,
  BuyerRecord,
  ChamberConfig,
  CommodityLineItem,
  FirmRecord,
  GodownRecord,
  InvCategoryRecord,
  InvProductRecord,
  InvSubCategoryRecord,
  PackagingUom,
  PackagingUomRecord,
  SaudaErpMockService,
  SaudaRecord,
  SaudaType,
  SellerRecord,
  TruckEntryRecord,
  WarehouseRecord,
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
    NgxPaginationModule,
  ],
  selector: 'app-sauda-management',
  templateUrl: './sauda-management.component.html',
  styleUrl: './sauda-management.component.scss',
})
export class SaudaManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  public erpService = inject(SaudaErpMockService);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

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

  readonly saudaTypes: SaudaType[] = ['Brokerage', 'Purchase', 'Sales'];
  readonly billingModes: BrokerageBillingMode[] = [
    'PS-1: Split',
    'PS-2: Buyer pays all',
    'PS-3: Everything together',
  ];
  commodities: string[] = [];
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

  warehouses: WarehouseRecord[] = [];
  godowns: GodownRecord[] = [];
  filteredGodowns: GodownRecord[] = [];
  availableChambers: ChamberConfig[] = [];
  availableStacks: string[] = [];

  allPartyOptions: string[] = [];
  heldPurchaseSaudas: SaudaRecord[] = [];
  sellerOptions: string[] = [];
  buyerOptions: string[] = [];

  // Active Role for testing Maker-Checker Amendment Workflow
  currentActorRole: 'Operations Executive (Maker)' | 'Business Owner / Admin (Checker)' =
    'Business Owner / Admin (Checker)';
  isChecker: boolean = true;
  isMaker: boolean = false;

  activeSaudasList: SaudaRecord[] = [];
  purchaseCount: number = 0;
  salesCount: number = 0;
  brokerageCount: number = 0;
  firmFilterOptions: string[] = [];

  itemsPerPageCount: number = 10;
  showingStart: number = 0;
  showingEnd: number = 0;

  // Screen states
  isEditMode = false;
  isDetailsOpen = false;
  isRevisionOpen = false;
  isVoidOpen = false;
  isReviewOpen = false;
  showAddPartyModal = false;
  partyError = '';
  newPartyForm: {
    name: string;
    phone: string;
    email: string;
    defaultCreditDays: number | null;
  } = {
    name: '',
    phone: '',
    email: '',
    defaultCreditDays: 15,
  };

  selectedSauda: SaudaRecord | null = null;
  linkedTrucks: TruckEntryRecord[] = [];

  saudaForm!: FormGroup;
  commodityRows!: FormArray;
  voidForm!: FormGroup;
  formError = '';
  voidError = '';
  reviewError = '';
  rejectionReason = '';
  showRejectionInput = false;

  switchActorRole(
    role: 'Operations Executive (Maker)' | 'Business Owner / Admin (Checker)',
  ): void {
    this.currentActorRole = role;
    this.isChecker = role === 'Business Owner / Admin (Checker)';
    this.isMaker = role === 'Operations Executive (Maker)';
    this.notificationService.show(`Switched active role to: ${role}`, 'info', 2500);
  }

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
      this.erpService.warehouses$,
      this.erpService.godowns$,
      this.erpService.packagingUoms$,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        ([
          saudas,
          firms,
          sellers,
          buyers,
          invProducts,
          invSubCategories,
          invCategories,
          warehouses,
          godowns,
          pkgs,
        ]) => {
          this.allSaudas = saudas;
          this.activeFirms = firms.filter((f) => f.isActive);
          this.activeSellers = sellers.filter((s) => s.isActive);
          this.activeBuyers = buyers.filter((b) => b.isActive);
          this.warehouses = warehouses.filter((w) => w.isActive);
          this.godowns = godowns.filter((g) => g.isActive);
          this.dynamicPackagingUoms = (pkgs || []).filter((p) => p.isActive);

          const partySet = new Set<string>();
          this.activeSellers.forEach((s) => partySet.add(s.name));
          this.activeBuyers.forEach((b) => partySet.add(b.name));
          this.allPartyOptions = Array.from(partySet).sort();
          this.sellerOptions = this.allPartyOptions;
          this.buyerOptions = this.allPartyOptions;

          this.heldPurchaseSaudas = saudas.filter(
            (s) => s.saudaType === 'Purchase' && s.status === 'On Hold',
          );

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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (params['action'] === 'create') {
          this.openCreateForm();
        }
      });
  }

  private initForms(): void {
    const today = new Date().toISOString().slice(0, 10);
    this.saudaForm = this.fb.group({
      saudaType: ['Brokerage', Validators.required],
      saudaDate: [today, Validators.required],
      clientFirm: ['', Validators.required],
      warehouseId: ['', Validators.required],
      warehouseName: [''],
      godownName: [''],
      chamberName: [''],
      stackNumber: [''],
      brokerageBillingMode: ['PS-1: Split', Validators.required],
      linkedPurchaseSaudaId: [''],
      linkedPurchaseSaudaNo: [''],
      sellerName: ['', Validators.required],
      buyerName: ['', Validators.required],
      expectedDeliveryDate: [''],
      commodityItems: this.fb.array([this.createCommodityRow()]),
      totalAmountInr: [null, [Validators.required, Validators.min(1)]],
      buyerBrokerageAmount: [null, Validators.min(0)],
      sellerBrokerageAmount: [null, Validators.min(0)],
      totalBrokerageAmount: [{ value: null, disabled: true }],
      sellerCreditPeriodDays: [null, Validators.min(0)],
      sellerCreditStartDate: [''],
      sellerDueDate: [{ value: '', disabled: true }],
      buyerCreditPeriodDays: [null, Validators.min(0)],
      buyerCreditStartDate: [''],
      buyerDueDate: [{ value: '', disabled: true }],
      remarks: [''],
      revisionReason: [''],
    });
    this.commodityRows = this.saudaForm.get('commodityItems') as FormArray;

    this.saudaForm
      .get('saudaType')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((type: SaudaType) => {
        this.updatePartyValidators(type);
        this.recomputeBrokerageAmounts();
      });

    this.saudaForm
      .get('brokerageBillingMode')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.recomputeBrokerageAmounts());

    this.saudaForm
      .get('buyerBrokerageAmount')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.recomputeBrokerageAmounts());

    this.saudaForm
      .get('sellerBrokerageAmount')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.recomputeBrokerageAmounts());

    this.saudaForm
      .get('warehouseId')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((whId: string) => {
        if (!whId) {
          this.filteredGodowns = [];
          this.availableChambers = [];
          this.availableStacks = [];
          return;
        }
        const wh = this.warehouses.find((w) => w.id === whId);
        this.saudaForm.patchValue(
          { warehouseName: wh?.name || '' },
          { emitEvent: false },
        );
        this.filteredGodowns = this.godowns.filter((g) => g.warehouseId === whId);
      });

    this.saudaForm
      .get('linkedPurchaseSaudaId')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pId: string) => {
        if (pId) {
          this.onLinkedPurchaseSaudaSelected(pId);
        }
      });

    // Auto-calculate Seller & Buyer Due Dates using calendar days
    this.saudaForm
      .get('sellerCreditPeriodDays')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.recomputeDueDate('seller'));
    this.saudaForm
      .get('sellerCreditStartDate')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.recomputeDueDate('seller'));

    this.saudaForm
      .get('buyerCreditPeriodDays')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.recomputeDueDate('buyer'));
    this.saudaForm
      .get('buyerCreditStartDate')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.recomputeDueDate('buyer'));

    this.voidForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10)]],
      confirmed: [false, Validators.requiredTrue],
    });
  }

  getPackagingCapacity(name: string): number {
    const pkg = this.dynamicPackagingUoms.find(
      (p) => p.name.toLowerCase() === (name || '').toLowerCase(),
    );
    return pkg?.bagQuantity ?? 50;
  }

  hasDynamicPkg(name: string): boolean {
    return this.dynamicPackagingUoms.some(
      (p) => p.name.toLowerCase() === (name || '').toLowerCase(),
    );
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
      rate: [
        item?.rate ?? null,
      ],
      lineTotal: [{ value: item?.lineTotal ?? null, disabled: true }],
    });

    if (initialWeight && item?.rate) {
      row.patchValue(
        { lineTotal: Number((initialWeight * item.rate).toFixed(2)) },
        { emitEvent: false },
      );
    }

    row
      .get('packagingUom')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.recomputeRowWeightAndTotal(row);
      });

    row
      .get('packagingQty')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.recomputeRowWeightAndTotal(row);
      });

    row
      .get('rate')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const wt = Number(row.get('actualWeight')?.value) || 0;
        const rate = Number(row.get('rate')?.value) || 0;
        const total = Number((wt * rate).toFixed(2));
        row.get('lineTotal')?.setValue(total > 0 ? total : null, { emitEvent: false });
        this.recomputeTotalAmountFromLines();
      });

    return row;
  }

  recomputeRowWeightAndTotal(row: FormGroup | AbstractControl): void {
    const pkgName = row.get('packagingUom')?.value;
    const qty = Number(row.get('packagingQty')?.value) || 0;
    const bagKg = this.getPackagingCapacity(pkgName);

    // Rule BR-SA-12, BR-SA-13: Auto-calculate Total Weight in Metric Tons (MT)
    const weightMt = qty > 0 ? Number(((qty * bagKg) / 1000).toFixed(3)) : 0;
    row.get('actualWeight')?.setValue(weightMt > 0 ? weightMt : null, { emitEvent: false });
    row.get('weightUom')?.setValue('MT', { emitEvent: false });

    const isPurchase = this.saudaForm?.get('saudaType')?.value === 'Purchase';
    if (!isPurchase) {
      const rate = Number(row.get('rate')?.value) || 0;
      const total = Number((weightMt * rate).toFixed(2));
      row.get('lineTotal')?.setValue(total > 0 ? total : null, { emitEvent: false });
    } else {
      row.get('rate')?.setValue(null, { emitEvent: false });
      row.get('lineTotal')?.setValue(null, { emitEvent: false });
    }
    this.recomputeTotalAmountFromLines();
  }

  private recomputeRowLineTotal(row: FormGroup): void {
    this.recomputeRowWeightAndTotal(row);
  }

  private recomputeTotalAmountFromLines(): void {
    let sum = 0;
    for (const ctrl of this.commodityRows.controls) {
      const lineTotal = Number(ctrl.get('lineTotal')?.value) || 0;
      sum += lineTotal;
    }
    if (sum > 0) {
      this.saudaForm.patchValue({ totalAmountInr: sum }, { emitEvent: false });
    }
  }

  private recomputeBrokerageAmounts(): void {
    const mode = this.saudaForm.get('brokerageBillingMode')?.value as BrokerageBillingMode;
    const b = Number(this.saudaForm.get('buyerBrokerageAmount')?.value) || 0;
    const s = Number(this.saudaForm.get('sellerBrokerageAmount')?.value) || 0;
    let total = 0;
    if (mode === 'PS-2: Buyer pays all') {
      total = b;
    } else {
      total = b + s;
    }
    this.saudaForm
      .get('totalBrokerageAmount')
      ?.setValue(total > 0 ? total : null, { emitEvent: false });
  }

  onWarehouseSelected(): void {
    const whId = this.saudaForm.get('warehouseId')?.value;
    const wh = this.warehouses.find((w) => w.id === whId);
    this.saudaForm.patchValue({
      warehouseName: wh?.name || '',
      godownName: '',
      chamberName: '',
      stackNumber: '',
    });
    this.filteredGodowns = this.godowns.filter((g) => g.warehouseId === whId);
    this.availableChambers = [];
    this.availableStacks = [];
  }

  onGodownSelected(): void {
    const gName = this.saudaForm.get('godownName')?.value;
    const gd = this.filteredGodowns.find((g) => g.name === gName);
    this.availableChambers = gd?.chambers || [];
    this.availableStacks = [];
    this.saudaForm.patchValue({
      chamberName: '',
      stackNumber: '',
    });
  }

  onChamberSelected(): void {
    const chName = this.saudaForm.get('chamberName')?.value;
    const ch = this.availableChambers.find((c) => c.name === chName);
    this.availableStacks = ch?.stackNumbers || [];
    this.saudaForm.patchValue({
      stackNumber: '',
    });
  }

  onLinkedPurchaseSaudaSelected(purchaseSaudaId?: string): void {
    const id =
      purchaseSaudaId ||
      this.saudaForm.get('linkedPurchaseSaudaId')?.value;
    if (!id) return;
    const purchaseSauda = this.allSaudas.find((s) => s.id === id);
    if (!purchaseSauda) return;

    this.saudaForm.patchValue({
      linkedPurchaseSaudaId: purchaseSauda.id,
      linkedPurchaseSaudaNo: purchaseSauda.saudaNo,
      sellerName:
        purchaseSauda.sellerName ||
        purchaseSauda.partyName.replace(' (Held)', ''),
      warehouseId: purchaseSauda.warehouseId || this.warehouses[0]?.id || '',
      warehouseName: purchaseSauda.warehouseName || this.warehouses[0]?.name || '',
      godownName: purchaseSauda.godownName || '',
      chamberName: purchaseSauda.chamberName || '',
      stackNumber: purchaseSauda.stackNumber || '',
    });

    if (purchaseSauda.warehouseId) {
      this.filteredGodowns = this.godowns.filter(
        (g) => g.warehouseId === purchaseSauda.warehouseId,
      );
      if (purchaseSauda.godownName) {
        const gd = this.filteredGodowns.find(
          (g) => g.name === purchaseSauda.godownName,
        );
        this.availableChambers = gd?.chambers || [];
        if (purchaseSauda.chamberName) {
          const ch = this.availableChambers.find(
            (c) => c.name === purchaseSauda.chamberName,
          );
          this.availableStacks = ch?.stackNumbers || [];
        }
      }
    }

    if (
      purchaseSauda.commodityItems &&
      purchaseSauda.commodityItems.length > 0
    ) {
      this.commodityRows.clear();
      for (const item of purchaseSauda.commodityItems) {
        this.commodityRows.push(this.createCommodityRow(item));
      }
    }
  }

  getLinkedPurchaseSauda(id?: string): SaudaRecord | undefined {
    if (!id) return undefined;
    return this.allSaudas.find((s) => s.id === id);
  }

  onSellerSelected(): void {
    const sellerName = this.saudaForm.get('sellerName')?.value;
    const seller = this.activeSellers.find((s) => s.name === sellerName);
    if (
      seller &&
      seller.defaultCreditDays !== null &&
      seller.defaultCreditDays !== undefined
    ) {
      const startDate =
        this.saudaForm.get('sellerCreditStartDate')?.value ||
        this.saudaForm.get('saudaDate')?.value ||
        new Date().toISOString().slice(0, 10);
      this.saudaForm.patchValue({
        sellerCreditPeriodDays: seller.defaultCreditDays,
        sellerCreditStartDate: startDate,
      });
      this.recomputeDueDate('seller');
    }
  }

  onBuyerSelected(): void {
    const buyerName = this.saudaForm.get('buyerName')?.value;
    const buyer = this.activeBuyers.find((b) => b.name === buyerName);
    if (
      buyer &&
      buyer.defaultCreditDays !== null &&
      buyer.defaultCreditDays !== undefined
    ) {
      const startDate =
        this.saudaForm.get('buyerCreditStartDate')?.value ||
        this.saudaForm.get('saudaDate')?.value ||
        new Date().toISOString().slice(0, 10);
      this.saudaForm.patchValue({
        buyerCreditPeriodDays: buyer.defaultCreditDays,
        buyerCreditStartDate: startDate,
      });
      this.recomputeDueDate('buyer');
    }
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

      const defaultPkgUom = (
        prod.packagingUoms && prod.packagingUoms.length > 0
          ? prod.packagingUoms[0]
          : prod.packagingUom
            ? prod.packagingUom.split(',')[0].trim()
            : 'Bag'
      ) as PackagingUom;

      options.push({
        value,
        label,
        categoryName: catName,
        packagingUom: defaultPkgUom,
        weightUom: prod.weightUom,
      });
    }

    this.inventoryCommodityOptions = options;
    this.commodities = options.map((o) => o.value);
  }

  onCommoditySelected(index: number): void {
    const row = this.commodityRows.at(index) as FormGroup;
    if (!row) return;
    const val = (row.get('commodity')?.value || '').trim();
    if (!val) return;

    // BR-SA-07, EX-03: Duplicate commodity in single Sauda prevented
    const isDuplicate = this.commodityRows.controls.some(
      (ctrl, idx) =>
        idx !== index && (ctrl.get('commodity')?.value || '').trim() === val,
    );
    if (isDuplicate) {
      this.notificationService.show(
        `Commodity "${val}" is already added to this Sauda. Duplicate commodities are not permitted (BR-SA-07).`,
        'error',
        3500,
      );
      row.patchValue({ commodity: '' });
      return;
    }

    const match = this.inventoryCommodityOptions.find((o) => o.value === val);
    if (match) {
      row.patchValue(
        {
          packagingUom: match.packagingUom,
          weightUom: 'MT',
        },
        { emitEvent: false },
      );
      this.recomputeRowWeightAndTotal(row);
    }
  }

  onPackagingUomChanged(index: number): void {
    const row = this.commodityRows.at(index) as FormGroup;
    if (row) {
      this.recomputeRowWeightAndTotal(row);
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
    const remarksCtrl = this.saudaForm.get('remarks');
    const totalAmountCtrl = this.saudaForm.get('totalAmountInr');
    const linkedSaudaCtrl = this.saudaForm.get('linkedPurchaseSaudaId');
    const billingModeCtrl = this.saudaForm.get('brokerageBillingMode');

    if (type === 'Purchase') {
      // BR-SA-04, BR-SA-16, BR-SA-23
      sellerCtrl?.setValidators([Validators.required]);
      buyerCtrl?.clearValidators();
      buyerCtrl?.setValue('', { emitEvent: false });
      remarksCtrl?.setValidators([Validators.required]);
      totalAmountCtrl?.clearValidators();
      linkedSaudaCtrl?.clearValidators();
      billingModeCtrl?.clearValidators();
    } else if (type === 'Sales') {
      // BR-SA-05, EX-09, EX-11
      buyerCtrl?.setValidators([Validators.required]);
      sellerCtrl?.clearValidators();
      remarksCtrl?.clearValidators();
      totalAmountCtrl?.setValidators([Validators.required, Validators.min(1)]);
      linkedSaudaCtrl?.setValidators([Validators.required]);
      billingModeCtrl?.setValidators([Validators.required]);
    } else {
      // Brokerage: BR-SA-03, BR-SA-10
      sellerCtrl?.setValidators([Validators.required]);
      buyerCtrl?.setValidators([Validators.required]);
      remarksCtrl?.clearValidators();
      totalAmountCtrl?.setValidators([Validators.required, Validators.min(1)]);
      linkedSaudaCtrl?.clearValidators();
      billingModeCtrl?.setValidators([Validators.required]);
    }
    sellerCtrl?.updateValueAndValidity({ emitEvent: false });
    buyerCtrl?.updateValueAndValidity({ emitEvent: false });
    remarksCtrl?.updateValueAndValidity({ emitEvent: false });
    totalAmountCtrl?.updateValueAndValidity({ emitEvent: false });
    linkedSaudaCtrl?.updateValueAndValidity({ emitEvent: false });
    billingModeCtrl?.updateValueAndValidity({ emitEvent: false });

    if (this.commodityRows) {
      for (const ctrl of this.commodityRows.controls) {
        const rateCtrl = ctrl.get('rate');
        if (type === 'Purchase') {
          rateCtrl?.clearValidators();
          rateCtrl?.setValue(null, { emitEvent: false });
          ctrl.get('lineTotal')?.setValue(null, { emitEvent: false });
        } else {
          rateCtrl?.setValidators([Validators.required, Validators.min(0.01)]);
        }
        rateCtrl?.updateValueAndValidity({ emitEvent: false });
      }
    }
  }

  addTruckEntryForSauda(sauda: SaudaRecord): void {
    this.closeAllModals();
    this.router.navigate(['/admin/truck-management'], {
      queryParams: { action: 'create', saudaId: sauda.id },
    });
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
        s.saudaType === this.appliedTypeFilter ||
        (this.appliedTypeFilter === 'Direct Sale' && s.saudaType === 'Brokerage') ||
        (this.appliedTypeFilter === 'Brokerage' && s.saudaType === 'Direct Sale');
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
    this.updateSummaryAndPagination();
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

  updateSummaryAndPagination(): void {
    this.activeSaudasList = this.allSaudas.filter((s) => s.status !== 'Voided');
    this.purchaseCount = this.activeSaudasList.filter(
      (s) => s.saudaType === 'Purchase',
    ).length;
    this.salesCount = this.activeSaudasList.filter(
      (s) => s.saudaType === 'Sales',
    ).length;
    this.brokerageCount = this.activeSaudasList.filter(
      (s) => s.saudaType === 'Direct Sale' || s.saudaType === 'Brokerage',
    ).length;

    const names = new Set<string>();
    this.activeFirms.forEach((f) => names.add(f.name));
    this.allSaudas.forEach((s) => {
      if (s.clientFirm) names.add(s.clientFirm);
    });
    this.firmFilterOptions = Array.from(names);

    this.itemsPerPageCount =
      this.tableSize === 'all'
        ? Math.max(1, this.filteredSaudas.length)
        : Number(this.tableSize);
    if (this.filteredSaudas.length === 0) {
      this.showingStart = 0;
      this.showingEnd = 0;
    } else {
      this.showingStart = (this.page - 1) * this.itemsPerPageCount + 1;
      this.showingEnd = Math.min(
        this.page * this.itemsPerPageCount,
        this.filteredSaudas.length,
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

  // ── Screen 2: Create / Edit Sauda View ──

  openCreateForm(): void {
    const today = new Date().toISOString().slice(0, 10);
    this.closeAllModals();
    this.isEditMode = false;
    this.selectedSauda = null;
    this.formError = '';

    this.commodityRows.clear();
    this.commodityRows.push(this.createCommodityRow());

    const defaultWh = this.warehouses[0];

    this.saudaForm.reset({
      saudaType: 'Brokerage',
      saudaDate: today,
      clientFirm: this.activeFirms[0]?.name || '',
      warehouseId: defaultWh?.id || '',
      warehouseName: defaultWh?.name || '',
      godownName: '',
      chamberName: '',
      stackNumber: '',
      brokerageBillingMode: 'PS-1: Split',
      linkedPurchaseSaudaId: '',
      linkedPurchaseSaudaNo: '',
      sellerName: '',
      buyerName: '',
      expectedDeliveryDate: '',
      totalAmountInr: null,
      buyerBrokerageAmount: null,
      sellerBrokerageAmount: null,
      totalBrokerageAmount: null,
      sellerCreditPeriodDays: null,
      sellerCreditStartDate: '',
      sellerDueDate: '',
      buyerCreditPeriodDays: null,
      buyerCreditStartDate: '',
      buyerDueDate: '',
      remarks: '',
      revisionReason: '',
    });

    if (defaultWh) {
      this.filteredGodowns = this.godowns.filter(
        (g) => g.warehouseId === defaultWh.id,
      );
    } else {
      this.filteredGodowns = [];
    }
    this.availableChambers = [];
    this.availableStacks = [];

    this.updatePartyValidators('Brokerage');
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

    // AF-07: Second amendment blocked while one is pending
    if (sauda.amendmentStatus === 'Pending Approval') {
      this.notificationService.show(
        `An amendment is already pending Checker approval for ${sauda.saudaNo} (AF-07). Resolve it before submitting a new amendment.`,
        'error',
        4000,
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

    const initialType =
      sauda.saudaType === 'Direct Sale' ? 'Brokerage' : sauda.saudaType;

    this.saudaForm.patchValue({
      saudaType: initialType,
      saudaDate: sauda.saudaDate,
      clientFirm: sauda.clientFirm,
      warehouseId: sauda.warehouseId || this.warehouses[0]?.id || '',
      warehouseName: sauda.warehouseName || this.warehouses[0]?.name || '',
      godownName: sauda.godownName || '',
      chamberName: sauda.chamberName || '',
      stackNumber: sauda.stackNumber || '',
      brokerageBillingMode: sauda.brokerageBillingMode || 'PS-1: Split',
      linkedPurchaseSaudaId: sauda.linkedPurchaseSaudaId || '',
      linkedPurchaseSaudaNo: sauda.linkedPurchaseSaudaNo || '',
      sellerName: sauda.sellerName,
      buyerName: sauda.buyerName,
      expectedDeliveryDate: sauda.expectedDeliveryDate || '',
      totalAmountInr: sauda.totalAmountInr,
      buyerBrokerageAmount: sauda.buyerBrokerageAmount ?? null,
      sellerBrokerageAmount: sauda.sellerBrokerageAmount ?? null,
      sellerCreditPeriodDays: sauda.sellerCreditPeriodDays,
      sellerCreditStartDate: sauda.sellerCreditStartDate,
      sellerDueDate: sauda.sellerDueDate,
      buyerCreditPeriodDays: sauda.buyerCreditPeriodDays,
      buyerCreditStartDate: sauda.buyerCreditStartDate,
      buyerDueDate: sauda.buyerDueDate,
      remarks: sauda.remarks,
      revisionReason: '',
    });

    if (sauda.warehouseId) {
      this.filteredGodowns = this.godowns.filter(
        (g) => g.warehouseId === sauda.warehouseId,
      );
      if (sauda.godownName) {
        const gd = this.filteredGodowns.find((g) => g.name === sauda.godownName);
        this.availableChambers = gd?.chambers || [];
        if (sauda.chamberName) {
          const ch = this.availableChambers.find(
            (c) => c.name === sauda.chamberName,
          );
          this.availableStacks = ch?.stackNumbers || [];
        }
      }
    }

    this.recomputeBrokerageAmounts();
    this.updatePartyValidators(initialType);
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

    // Check party duplication: same party cannot be both Seller and Buyer in one deal
    if (
      v.sellerName &&
      v.buyerName &&
      v.sellerName.trim().toLowerCase() === v.buyerName.trim().toLowerCase()
    ) {
      this.formError =
        'The same party cannot be both Seller and Buyer in one deal.';
      this.notificationService.show(this.formError, 'error', 3500);
      return;
    }

    if (!v.warehouseId) {
      this.formError = 'Storage Warehouse is required for all Saudas.';
      this.notificationService.show(this.formError, 'error', 3500);
      return;
    }

    const selectedWh = this.warehouses.find((w) => w.id === v.warehouseId);

    const payload = {
      saudaType: v.saudaType as SaudaType,
      saudaDate: v.saudaDate,
      clientFirm: v.clientFirm,
      warehouseId: v.warehouseId,
      warehouseName: selectedWh?.name || v.warehouseName || '',
      godownName: v.godownName || undefined,
      chamberName: v.chamberName || undefined,
      stackNumber: v.stackNumber || undefined,
      brokerageBillingMode: v.brokerageBillingMode || undefined,
      linkedPurchaseSaudaId: v.linkedPurchaseSaudaId || undefined,
      linkedPurchaseSaudaNo: v.linkedPurchaseSaudaNo || undefined,
      sellerName: (v.sellerName || '').trim(),
      buyerName: (v.buyerName || '').trim(),
      expectedDeliveryDate: v.expectedDeliveryDate || '',
      commodityItems: (this.saudaForm.getRawValue().commodityItems || []).map((c: any) => ({
        commodity: c.commodity,
        packagingUom: c.packagingUom,
        packagingQty: Number(c.packagingQty),
        weightUom: 'MT',
        actualWeight: Number(c.actualWeight),
        rate: v.saudaType === 'Purchase' ? undefined : (Number(c.rate) || undefined),
        lineTotal:
          v.saudaType === 'Purchase'
            ? undefined
            : Number((Number(c.actualWeight) * (Number(c.rate) || 0)).toFixed(2)),
      })),
      totalAmountInr: Number(v.totalAmountInr),
      buyerBrokerageAmount:
        v.buyerBrokerageAmount !== null && v.buyerBrokerageAmount !== ''
          ? Number(v.buyerBrokerageAmount)
          : undefined,
      sellerBrokerageAmount:
        v.sellerBrokerageAmount !== null && v.sellerBrokerageAmount !== ''
          ? Number(v.sellerBrokerageAmount)
          : undefined,
      totalBrokerageAmount:
        (Number(v.buyerBrokerageAmount) || 0) +
          (Number(v.sellerBrokerageAmount) || 0) || undefined,
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

    if (this.isEditMode && this.selectedSauda) {
      // Maker-Checker Amendment (AF-04, BR-SA-26)
      const result = this.erpService.initiateAmendment(
        this.selectedSauda.id,
        payload,
        v.revisionReason,
        this.currentActorRole,
      );
      if (!result.ok) {
        this.formError = result.message;
        this.notificationService.show(result.message, 'error', 3500);
        return;
      }
      this.notificationService.show(result.message, 'success', 3500);
      this.viewMode = 'listing';
    } else {
      // Create new Sauda
      const result = this.erpService.createSauda(payload);
      if (!result.ok) {
        this.formError = result.message;
        this.notificationService.show(result.message, 'error', 3500);
        return;
      }
      this.notificationService.show(result.message, 'success', 3000);
      this.viewMode = 'listing';
    }
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

  // ── Screen 5: Checker Review Amendment Modal (AF-05, AF-06) ──
  openReviewModal(sauda: SaudaRecord): void {
    if (!sauda.pendingAmendment) {
      this.notificationService.show(
        'No pending amendment found for this Sauda.',
        'info',
        2500,
      );
      return;
    }
    this.closeAllModals();
    this.selectedSauda = sauda;
    this.reviewError = '';
    this.rejectionReason = '';
    this.showRejectionInput = false;
    this.isReviewOpen = true;
  }

  approvePendingAmendment(): void {
    if (!this.selectedSauda || !this.selectedSauda.pendingAmendment) return;
    this.reviewError = '';

    const res = this.erpService.approveAmendment(
      this.selectedSauda.id,
      this.currentActorRole,
    );
    if (!res.ok) {
      this.reviewError = res.message;
      this.notificationService.show(res.message, 'error', 3500);
      return;
    }

    this.notificationService.show(res.message, 'success', 3000);
    this.closeAllModals();
  }

  startRejection(): void {
    this.showRejectionInput = true;
    this.reviewError = '';
  }

  confirmRejection(): void {
    if (!this.selectedSauda || !this.selectedSauda.pendingAmendment) return;
    this.reviewError = '';
    if (!this.rejectionReason || this.rejectionReason.trim().length < 5) {
      this.reviewError =
        'Rejection reason (minimum 5 characters) is mandatory (BR-SA-30).';
      return;
    }

    const res = this.erpService.rejectAmendment(
      this.selectedSauda.id,
      this.rejectionReason.trim(),
      this.currentActorRole,
    );
    if (!res.ok) {
      this.reviewError = res.message;
      this.notificationService.show(res.message, 'error', 3500);
      return;
    }

    this.notificationService.show(res.message, 'success', 3000);
    this.closeAllModals();
  }

  // ── Screen 6: Void Confirmation ──
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
    this.isReviewOpen = false;
    this.showAddPartyModal = false;
    this.partyError = '';
    this.voidError = '';
    this.reviewError = '';
    this.showRejectionInput = false;
    this.rejectionReason = '';
  }

  // ── Add Party Modal (UC-FIN-03 & Sauda Quick Party Creation) ──

  openAddPartyModal(): void {
    this.partyError = '';
    this.newPartyForm = {
      name: '',
      phone: '',
      email: '',
      defaultCreditDays: 15,
    };
    this.showAddPartyModal = true;
  }

  closeAddPartyModal(): void {
    this.showAddPartyModal = false;
    this.partyError = '';
  }

  submitNewParty(): void {
    this.partyError = '';
    const name = (this.newPartyForm.name || '').trim();
    if (name.length < 2) {
      this.partyError = 'Party name must be at least 2 characters.';
      return;
    }
    const phone = (this.newPartyForm.phone || '').trim();
    const email = (this.newPartyForm.email || '').trim();
    const creditDays = this.newPartyForm.defaultCreditDays;
    const resSeller = this.erpService.createSeller(name, phone, email, creditDays);
    const resBuyer = this.erpService.createBuyer(name, phone, email, creditDays);

    if (!resSeller.ok && !resBuyer.ok) {
      this.partyError = resSeller.message || resBuyer.message;
      return;
    }

    // Auto-select party in form if Sauda Create/Edit form is currently open
    if (this.viewMode === 'form' && this.saudaForm) {
      const currentType = this.saudaForm.get('saudaType')?.value;
      if (currentType === 'Purchase') {
        this.saudaForm.patchValue({ sellerName: name });
        this.onSellerSelected();
      } else {
        this.saudaForm.patchValue({ buyerName: name });
        this.onBuyerSelected();
      }
    }

    this.closeAddPartyModal();
    this.notificationService.show(`Party "${name}" added successfully.`, 'success', 3000);
  }

  getRecordBadgeClass(status: string): string {
    if (status === 'Voided') return 'badge-red';
    if (status === 'On Hold') return 'badge-amber';
    if (status === 'Completed') return 'badge-green';
    return 'badge-blue';
  }

  getAmendmentBadgeClass(status?: string): string {
    if (status === 'Pending Approval') return 'badge-amber';
    if (status === 'Approved') return 'badge-green';
    if (status === 'Rejected') return 'badge-red';
    return '';
  }
}
