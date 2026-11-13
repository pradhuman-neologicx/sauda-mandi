import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  SaudaErpMockService,
  WarehouseRecord,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss',
})
export class WarehouseComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  warehouses: WarehouseRecord[] = [];
  filteredWarehouses: WarehouseRecord[] = [];

  // Search (on Search button click)
  searchTerm = '';
  appliedSearchTerm = '';
  showReset = false;

  // Pagination
  page = 1;
  tableSize: number | 'all' = 10;
  tableSizes: (number | 'all')[] = [10, 25, 50, 'all'];

  // Modal states
  isModalOpen = false;
  isEdit = false;
  selectedWarehouse: WarehouseRecord | null = null;
  warehouseForm!: FormGroup;
  formError = '';

  constructor(
    private fb: FormBuilder,
    private erpService: SaudaErpMockService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.warehouseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
    });

    this.erpService.warehouses$
      .pipe(takeUntil(this.destroy$))
      .subscribe((list) => {
        this.warehouses = list;
        this.applyFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    this.appliedSearchTerm = this.searchTerm.trim();
    this.showReset = !!this.appliedSearchTerm;
    this.page = 1;
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.appliedSearchTerm = '';
    this.showReset = false;
    this.page = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.appliedSearchTerm.toLowerCase();
    this.filteredWarehouses = this.warehouses.filter((w) =>
      !q
        ? true
        : w.name.toLowerCase().includes(q) || w.city.toLowerCase().includes(q),
    );
  }

  get itemsPerPageCount(): number {
    return this.tableSize === 'all'
      ? Math.max(1, this.filteredWarehouses.length)
      : this.tableSize;
  }

  get showingStart(): number {
    if (this.filteredWarehouses.length === 0) return 0;
    return (this.page - 1) * this.itemsPerPageCount + 1;
  }

  get showingEnd(): number {
    return Math.min(
      this.page * this.itemsPerPageCount,
      this.filteredWarehouses.length,
    );
  }

  onTableSizeChange(): void {
    this.page = 1;
  }

  openAddModal(): void {
    this.isEdit = false;
    this.selectedWarehouse = null;
    this.formError = '';
    this.warehouseForm.reset({ name: '', city: '' });
    this.isModalOpen = true;
  }

  openEditModal(w: WarehouseRecord): void {
    this.isEdit = true;
    this.selectedWarehouse = w;
    this.formError = '';
    this.warehouseForm.reset({ name: w.name, city: w.city });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.formError = '';
  }

  submitWarehouse(): void {
    this.formError = '';
    if (this.warehouseForm.invalid) {
      this.warehouseForm.markAllAsTouched();
      this.formError = 'Please enter Warehouse Name and City (min 2 characters each).';
      return;
    }
    const { name, city } = this.warehouseForm.value;
    const res =
      this.isEdit && this.selectedWarehouse
        ? this.erpService.updateWarehouse(this.selectedWarehouse.id, name, city)
        : this.erpService.createWarehouse(name, city);

    if (!res.ok) {
      this.formError = res.message;
      return;
    }
    this.notificationService.show(res.message, 'success', 2500);
    this.closeModal();
  }

  toggleStatus(w: WarehouseRecord): void {
    const res = this.erpService.toggleWarehouseStatus(w.id);
    if (res.ok) {
      this.notificationService.show(res.message, 'success', 2500);
    }
  }
}

