import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  FirmRecord,
  InvCategoryRecord,
  InvProductRecord,
  InvSubCategoryRecord,
  InventoryRecord,
  PackagingUom,
  SaudaErpMockService,
} from '../../../core/services/sauda-erp-mock.service';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent {
  private readonly erp = inject(SaudaErpMockService);
  private readonly destroyRef = inject(DestroyRef);

  inventoryList: InventoryRecord[] = [];
  filteredList: InventoryRecord[] = [];
  firms: FirmRecord[] = [];
  categories: InvCategoryRecord[] = [];
  subCategories: InvSubCategoryRecord[] = [];
  products: InvProductRecord[] = [];

  // Listing filters (applied on Search click / dropdown change)
  searchTerm = '';
  appliedSearchTerm = '';
  categoryFilter = 'All';
  productFilter = 'All';
  firmFilter = 'All';
  statusFilter: 'All' | 'Healthy' | 'Low Stock' | 'Out of Stock' = 'All';
  showReset = false;

  // Pagination & limits
  page = 1;
  tableSize: number | 'all' = 10;
  readonly tableSizes: Array<number | 'all'> = [10, 25, 50, 'all'];

  readonly packagingUoms: PackagingUom[] = [
    'Bag',
    'Crate',
    'Box',
    'Carton',
    'Sack',
    'Loose',
  ];

  // Stock In / Out Modal
  showAdjustModal = false;
  formError = '';
  actionMessage = '';
  modalCategoryId = 'All';
  adjustForm: {
    productId: string;
    clientFirm: string;
    packagingUom: PackagingUom;
    action: 'Stock In' | 'Stock Out';
    units: number | null;
    weightMt: number | null;
    minThresholdMt: number | null;
    referenceNo: string;
    remarks: string;
  } = {
    productId: '',
    clientFirm: '',
    packagingUom: 'Bag',
    action: 'Stock In',
    units: null,
    weightMt: null,
    minThresholdMt: 2,
    referenceNo: '',
    remarks: '',
  };

  // Movement History Modal
  selectedHistoryItem: InventoryRecord | null = null;

  constructor() {
    this.erp.inventory$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.inventoryList = list;
        this.applyFilters();
      });

    this.erp.firms$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.firms = list.filter((f) => f.isActive);
      });

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

    this.erp.invProducts$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.products = list;
      });
  }

  get activeCategories(): InvCategoryRecord[] {
    return this.categories.filter((c) => c.isActive);
  }

  get activeProducts(): InvProductRecord[] {
    return this.products.filter((p) => p.isActive);
  }

  get filteredProductsForFilter(): InvProductRecord[] {
    if (this.categoryFilter === 'All') {
      return this.products;
    }
    return this.products.filter(
      (p) => this.getCategoryIdForProduct(p) === this.categoryFilter,
    );
  }

  get filteredProductsForModal(): InvProductRecord[] {
    if (this.modalCategoryId === 'All') {
      return this.activeProducts;
    }
    return this.activeProducts.filter(
      (p) => this.getCategoryIdForProduct(p) === this.modalCategoryId,
    );
  }

  getCategoryIdForProduct(product: InvProductRecord): string {
    const sub = this.subCategories.find((s) => s.id === product.subCategoryId);
    return sub?.categoryId || '';
  }

  getCategoryNameForProduct(product: InvProductRecord): string {
    const catId = this.getCategoryIdForProduct(product);
    return this.categories.find((c) => c.id === catId)?.name || 'Uncategorized';
  }

  get totalWeightMt(): number {
    return Number(
      this.inventoryList
        .reduce((sum, i) => sum + i.availableWeightMt, 0)
        .toFixed(2),
    );
  }

  get totalUnits(): number {
    return this.inventoryList.reduce((sum, i) => sum + i.availableUnits, 0);
  }

  get lowStockCount(): number {
    return this.inventoryList.filter(
      (i) =>
        i.availableWeightMt <= 0 || i.availableWeightMt <= i.minThresholdMt,
    ).length;
  }

  get pageSize(): number {
    return this.tableSize === 'all'
      ? Math.max(this.filteredList.length, 1)
      : this.tableSize;
  }

  getStockStatus(item: InventoryRecord): 'Out of Stock' | 'Low Stock' | 'Healthy' {
    if (item.availableWeightMt <= 0 || item.availableUnits <= 0) {
      return 'Out of Stock';
    }
    if (item.availableWeightMt <= item.minThresholdMt) {
      return 'Low Stock';
    }
    return 'Healthy';
  }

  getStatusBadgeClass(status: string): string {
    if (status === 'Out of Stock') return 'badge-red';
    if (status === 'Low Stock') return 'badge-amber';
    return 'badge-green';
  }

  onCategoryFilterChange(): void {
    if (
      this.productFilter !== 'All' &&
      !this.filteredProductsForFilter.some((p) => p.id === this.productFilter)
    ) {
      this.productFilter = 'All';
    }
    this.onSearch();
  }

  onSearch(): void {
    this.appliedSearchTerm = (this.searchTerm || '').trim();
    this.page = 1;
    this.showReset =
      !!this.appliedSearchTerm ||
      this.categoryFilter !== 'All' ||
      this.productFilter !== 'All' ||
      this.firmFilter !== 'All' ||
      this.statusFilter !== 'All';
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.appliedSearchTerm = '';
    this.categoryFilter = 'All';
    this.productFilter = 'All';
    this.firmFilter = 'All';
    this.statusFilter = 'All';
    this.showReset = false;
    this.page = 1;
    this.applyFilters();
  }

  onTableSizeChange(): void {
    this.page = 1;
  }

  applyFilters(): void {
    const q = this.appliedSearchTerm.toLowerCase();
    this.filteredList = this.inventoryList.filter((item) => {
      const status = this.getStockStatus(item);
      if (this.categoryFilter !== 'All' && item.categoryId !== this.categoryFilter) {
        return false;
      }
      if (this.productFilter !== 'All' && item.productId !== this.productFilter) {
        return false;
      }
      if (this.firmFilter !== 'All' && item.clientFirm !== this.firmFilter) {
        return false;
      }
      if (this.statusFilter !== 'All' && status !== this.statusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        (item.productName || '').toLowerCase().includes(q) ||
        item.commodity.toLowerCase().includes(q) ||
        (item.categoryName || '').toLowerCase().includes(q) ||
        (item.subCategoryName || '').toLowerCase().includes(q) ||
        item.clientFirm.toLowerCase().includes(q) ||
        item.logs.some((l) => l.referenceNo.toLowerCase().includes(q))
      );
    });
  }

  openAdjustModal(preset?: InventoryRecord): void {
    this.formError = '';
    const defaultProduct =
      (preset?.productId
        ? this.activeProducts.find((p) => p.id === preset.productId)
        : undefined) || this.activeProducts[0];

    this.modalCategoryId = preset?.categoryId || 'All';
    this.adjustForm = {
      productId: preset?.productId || defaultProduct?.id || '',
      clientFirm: preset?.clientFirm || this.firms[0]?.name || '',
      packagingUom:
        preset?.packagingUom || defaultProduct?.packagingUom || 'Bag',
      action: 'Stock In',
      units: null,
      weightMt: null,
      minThresholdMt: preset?.minThresholdMt ?? 2,
      referenceNo: '',
      remarks: '',
    };
    this.showAdjustModal = true;
  }

  onModalCategoryChange(): void {
    const available = this.filteredProductsForModal;
    if (
      this.adjustForm.productId &&
      !available.some((p) => p.id === this.adjustForm.productId)
    ) {
      const first = available[0];
      this.adjustForm.productId = first?.id || '';
      if (first) {
        this.adjustForm.packagingUom = first.packagingUom;
      }
    }
  }

  onModalProductChange(productId: string): void {
    const prod = this.products.find((p) => p.id === productId);
    if (!prod) return;
    this.adjustForm.packagingUom = prod.packagingUom;
    const catId = this.getCategoryIdForProduct(prod);
    if (catId && this.modalCategoryId === 'All') {
      // Keep category filter as 'All' unless user explicitly filtered it
    }
  }

  closeAdjustModal(): void {
    this.showAdjustModal = false;
    this.formError = '';
  }

  submitAdjustment(): void {
    this.formError = '';
    if (!this.adjustForm.productId || !this.adjustForm.clientFirm) {
      this.formError = 'Please select Product and Client Firm.';
      return;
    }
    if (
      !this.adjustForm.units ||
      this.adjustForm.units <= 0 ||
      !this.adjustForm.weightMt ||
      this.adjustForm.weightMt <= 0
    ) {
      this.formError = 'Units and Weight (MT) must be greater than zero.';
      return;
    }

    const res = this.erp.adjustInventoryStock({
      productId: this.adjustForm.productId,
      clientFirm: this.adjustForm.clientFirm,
      packagingUom: this.adjustForm.packagingUom,
      action: this.adjustForm.action,
      units: Number(this.adjustForm.units),
      weightMt: Number(this.adjustForm.weightMt),
      minThresholdMt:
        this.adjustForm.minThresholdMt !== null
          ? Number(this.adjustForm.minThresholdMt)
          : undefined,
      referenceNo: this.adjustForm.referenceNo || 'MANUAL',
      remarks: this.adjustForm.remarks,
    });

    if (!res.ok) {
      this.formError = res.message;
      return;
    }

    this.closeAdjustModal();
    this.showToast(res.message);
  }

  openHistoryModal(item: InventoryRecord): void {
    this.selectedHistoryItem = item;
  }

  closeHistoryModal(): void {
    this.selectedHistoryItem = null;
  }

  private showToast(msg: string): void {
    this.actionMessage = msg;
    setTimeout(() => {
      if (this.actionMessage === msg) {
        this.actionMessage = '';
      }
    }, 3500);
  }
}
