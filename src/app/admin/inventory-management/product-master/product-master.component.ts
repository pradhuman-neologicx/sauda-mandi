import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { combineLatest } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  InvCategoryRecord,
  InvProductRecord,
  InvSubCategoryRecord,
  PackagingUom,
  PackagingUomRecord,
  SaudaErpMockService,
  WeightUom,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

export interface PackagingUomOption extends PackagingUomRecord {
  displayLabel?: string;
}

@Component({
  selector: 'app-product-master',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgSelectModule,
  ],
  templateUrl: './product-master.component.html',
  styleUrl: './product-master.component.scss',
})
export class ProductMasterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private erpService = inject(SaudaErpMockService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  products: InvProductRecord[] = [];
  filteredProducts: InvProductRecord[] = [];
  categories: InvCategoryRecord[] = [];
  subCategories: InvSubCategoryRecord[] = [];
  dynamicPackagingUoms: PackagingUomOption[] = [];

  readonly packagingUoms: PackagingUom[] = [
    'Bag',
    'Crate',
    'Box',
    'Carton',
    'Sack',
    'Loose',
  ];

  // Search (on Search button click)
  searchTerm = '';
  appliedSearchTerm = '';
  showReset = false;

  // Pagination
  page = 1;
  tableSize: number | 'all' = 10;
  tableSizes: (number | 'all')[] = [10, 25, 50, 'all'];

  activeSubCategories: InvSubCategoryRecord[] = [];
  itemsPerPageCount: number = 10;
  showingStart: number = 0;
  showingEnd: number = 0;

  // Modals
  isFormOpen = false;
  isViewOpen = false;
  isEditMode = false;
  selectedProduct: InvProductRecord | null = null;
  productForm!: FormGroup;
  formError = '';

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      subCategoryId: ['', Validators.required],
      packagingUoms: [[], [Validators.required]],
    });

    combineLatest([
      this.erpService.invProducts$,
      this.erpService.invCategories$,
      this.erpService.invSubCategories$,
      this.erpService.packagingUoms$,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([products, cats, subs, pkgs]) => {
        this.products = products;
        this.categories = cats;
        this.subCategories = subs;
        this.dynamicPackagingUoms = pkgs
          .filter((p) => p.isActive)
          .map((p) => ({
            ...p,
            displayLabel: `${p.name} (${p.bagQuantity} ${p.unit || 'Kg'}/bag)`,
          }));
        this.activeSubCategories = this.subCategories.filter((sc) => sc.isActive);
        this.applyFilters();
      });
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
    this.updatePaginationCounters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.appliedSearchTerm = '';
    this.showReset = false;
    this.page = 1;
    this.applyFilters();
  }

  updatePaginationCounters(): void {
    this.itemsPerPageCount =
      this.tableSize === 'all'
        ? Math.max(1, this.filteredProducts.length)
        : Number(this.tableSize);
    if (this.filteredProducts.length === 0) {
      this.showingStart = 0;
      this.showingEnd = 0;
    } else {
      this.showingStart = (this.page - 1) * this.itemsPerPageCount + 1;
      this.showingEnd = Math.min(
        this.page * this.itemsPerPageCount,
        this.filteredProducts.length,
      );
    }
  }

  onTableSizeChange(): void {
    this.page = 1;
    this.updatePaginationCounters();
  }

  onTableDataChange(pageNumber: number): void {
    this.page = pageNumber;
    this.updatePaginationCounters();
  }

  getProductUoms(prod: InvProductRecord | null | undefined): string[] {
    if (!prod) return [];
    if (prod.packagingUoms && prod.packagingUoms.length > 0) {
      return prod.packagingUoms;
    }
    if (prod.packagingUom) {
      return prod.packagingUom
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  }

  selectAllUoms(): void {
    const allNames = this.dynamicPackagingUoms.map((u) => u.name);
    this.productForm.get('packagingUoms')?.setValue(allNames);
    this.productForm.get('packagingUoms')?.markAsDirty();
  }

  clearAllUoms(): void {
    this.productForm.get('packagingUoms')?.setValue([]);
    this.productForm.get('packagingUoms')?.markAsDirty();
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedProduct = null;
    this.formError = '';
    const defaultUoms =
      this.dynamicPackagingUoms.length > 0
        ? [this.dynamicPackagingUoms[0].name]
        : ['Bag'];
    this.productForm.reset({
      name: '',
      subCategoryId: this.activeSubCategories[0]?.id || '',
      packagingUoms: defaultUoms,
    });
    this.isFormOpen = true;
  }

  openEditModal(prod: InvProductRecord): void {
    this.isEditMode = true;
    this.selectedProduct = prod;
    this.formError = '';
    const uoms = this.getProductUoms(prod);
    this.productForm.reset({
      name: prod.name,
      subCategoryId: prod.subCategoryId,
      packagingUoms: uoms.length > 0 ? uoms : ['Bag'],
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
    const selectedUoms: string[] = Array.isArray(v.packagingUoms)
      ? v.packagingUoms
      : v.packagingUoms
        ? [v.packagingUoms]
        : [];

    if (selectedUoms.length === 0) {
      this.formError = 'Please select at least one Packaging UOM.';
      return;
    }

    const payload = {
      name: v.name,
      subCategoryId: v.subCategoryId,
      packagingUom: selectedUoms.join(', '),
      packagingUoms: selectedUoms,
      weightUom: (this.selectedProduct?.weightUom || 'KG') as WeightUom,
      minStock: 0,
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
