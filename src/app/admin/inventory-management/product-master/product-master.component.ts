import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  InvCategoryRecord,
  InvProductRecord,
  InvSubCategoryRecord,
  PackagingUom,
  SaudaErpMockService,
  WeightUom,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-product-master',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DecimalPipe,
    NgxPaginationModule,
  ],
  templateUrl: './product-master.component.html',
  styleUrl: './product-master.component.scss',
})
export class ProductMasterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  products: InvProductRecord[] = [];
  filteredProducts: InvProductRecord[] = [];
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
  readonly weightUoms: WeightUom[] = ['KG', 'Quintal', 'MT'];

  // Search (on Search button click)
  searchTerm = '';
  appliedSearchTerm = '';
  showReset = false;

  // Pagination
  page = 1;
  tableSize: number | 'all' = 10;
  tableSizes: (number | 'all')[] = [10, 25, 50, 'all'];

  // Modals
  isFormOpen = false;
  isViewOpen = false;
  isEditMode = false;
  selectedProduct: InvProductRecord | null = null;
  productForm!: FormGroup;
  formError = '';

  constructor(
    private fb: FormBuilder,
    private erpService: SaudaErpMockService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      subCategoryId: ['', Validators.required],
      packagingUom: ['Bag', Validators.required],
      weightUom: ['KG', Validators.required],
      minStock: [50, [Validators.required, Validators.min(0)]],
    });

    combineLatest([
      this.erpService.invProducts$,
      this.erpService.invCategories$,
      this.erpService.invSubCategories$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([products, cats, subs]) => {
        this.products = products;
        this.categories = cats;
        this.subCategories = subs;
        this.applyFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get activeSubCategories(): InvSubCategoryRecord[] {
    return this.subCategories.filter((sc) => sc.isActive);
  }

  getSubCategoryName(subId: string): string {
    return this.subCategories.find((s) => s.id === subId)?.name || '—';
  }

  getCategoryNameForSub(subId: string): string {
    const sub = this.subCategories.find((s) => s.id === subId);
    if (!sub) return '—';
    return this.categories.find((c) => c.id === sub.categoryId)?.name || '—';
  }

  onSearch(): void {
    this.appliedSearchTerm = this.searchTerm.trim();
    this.showReset = this.appliedSearchTerm.length > 0;
    this.page = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.appliedSearchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        this.getSubCategoryName(p.subCategoryId).toLowerCase().includes(q) ||
        this.getCategoryNameForSub(p.subCategoryId).toLowerCase().includes(q),
    );
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.appliedSearchTerm = '';
    this.showReset = false;
    this.page = 1;
    this.applyFilters();
  }

  get itemsPerPageCount(): number {
    return this.tableSize === 'all'
      ? Math.max(1, this.filteredProducts.length)
      : Number(this.tableSize);
  }

  get showingStart(): number {
    if (this.filteredProducts.length === 0) return 0;
    return (this.page - 1) * this.itemsPerPageCount + 1;
  }

  get showingEnd(): number {
    return Math.min(
      this.page * this.itemsPerPageCount,
      this.filteredProducts.length,
    );
  }

  onTableSizeChange(): void {
    this.page = 1;
  }

  onTableDataChange(pageNumber: number): void {
    this.page = pageNumber;
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedProduct = null;
    this.formError = '';
    this.productForm.reset({
      name: '',
      subCategoryId: this.activeSubCategories[0]?.id || '',
      packagingUom: 'Bag',
      weightUom: 'KG',
      minStock: 50,
    });
    this.isFormOpen = true;
  }

  openEditModal(prod: InvProductRecord): void {
    this.isEditMode = true;
    this.selectedProduct = prod;
    this.formError = '';
    this.productForm.reset({
      name: prod.name,
      subCategoryId: prod.subCategoryId,
      packagingUom: prod.packagingUom,
      weightUom: prod.weightUom,
      minStock: prod.minStock,
    });
    this.isFormOpen = true;
  }

  openViewModal(prod: InvProductRecord): void {
    this.selectedProduct = prod;
    this.isViewOpen = true;
  }

  closeModals(): void {
    this.isFormOpen = false;
    this.isViewOpen = false;
    this.formError = '';
  }

  submitProduct(): void {
    this.formError = '';
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.formError = 'Please complete all required fields.';
      return;
    }

    const v = this.productForm.value;
    const payload = {
      name: v.name,
      subCategoryId: v.subCategoryId,
      packagingUom: v.packagingUom,
      weightUom: v.weightUom,
      minStock: Number(v.minStock),
    };

    const result =
      this.isEditMode && this.selectedProduct
        ? this.erpService.updateInvProduct(this.selectedProduct.id, payload)
        : this.erpService.createInvProduct(payload);

    if (!result.ok) {
      this.formError = result.message;
      this.notificationService.show(result.message, 'error', 3000);
      return;
    }

    this.notificationService.show(result.message, 'success', 3000);
    this.closeModals();
  }

  toggleStatus(prod: InvProductRecord): void {
    const result = this.erpService.toggleInvProductStatus(prod.id);
    if (result.ok) {
      this.notificationService.show(result.message, 'success', 2500);
    }
  }
}
