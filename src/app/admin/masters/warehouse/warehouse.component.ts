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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import {
  FirmRecord,
  SaudaErpMockService,
  WarehouseRecord,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

export type WarehouseSortField = 'id' | 'name' | 'city' | 'status' | 'createdAt';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss',
})
export class WarehouseComponent implements OnInit {
  private fb = inject(FormBuilder);
  private erpService = inject(SaudaErpMockService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  warehouses: WarehouseRecord[] = [];
  filteredWarehouses: WarehouseRecord[] = [];
  firms: FirmRecord[] = [];
  parties: string[] = [];

  // Search & Filter controls (UC-WH-02)
  searchTerm = '';
  appliedSearchTerm = '';
  statusFilter: 'all' | 'Active' | 'Inactive' = 'all';
  appliedStatusFilter: 'all' | 'Active' | 'Inactive' = 'all';
  showReset = false;

  // Sorting
  sortField: WarehouseSortField = 'name';
  sortAsc = true;

  // Pagination
  page = 1;
  tableSize: number | 'all' = 10;
  tableSizes: (number | 'all')[] = [10, 25, 50, 'all'];

  // Summary & pagination properties
  totalCount: number = 0;
  activeCount: number = 0;
  inactiveCount: number = 0;
  citiesCount: number = 0;
  itemsPerPageCount: number = 10;
  showingStart: number = 0;
  showingEnd: number = 0;

  // Modal 1: Add / Edit Warehouse Modal (UC-WH-01 & UC-WH-03)
  isModalOpen = false;
  isEdit = false;
  selectedWarehouse: WarehouseRecord | null = null;
  warehouseForm!: FormGroup;
  formError = '';

  // Modal 2: View Warehouse Details Read-Only Modal (UC-WH-02)
  isViewModalOpen = false;
  viewingWarehouse: WarehouseRecord | null = null;

  // Modal 3: Activate / Deactivate Confirmation Modal (UC-WH-03 with Safeguards)
  isStatusModalOpen = false;
  statusTargetWarehouse: WarehouseRecord | null = null;
  deactivationCheck: {
    canDeactivate: boolean;
    reasons: string[];
    stockDetails?: string;
    pendingTrucks?: string[];
  } | null = null;
  statusModalError = '';

  ngOnInit(): void {
    this.initForm();

    combineLatest([this.erpService.sellers$, this.erpService.buyers$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([sellers, buyers]) => {
        const set = new Set<string>();
        sellers.filter((s) => s.isActive).forEach((s) => set.add(s.name));
        buyers.filter((b) => b.isActive).forEach((b) => set.add(b.name));
        this.parties = Array.from(set).sort();
        if (this.parties.length === 0) {
          this.parties = [
            'Sharma Grain Traders',
            'Desert Fresh Traders',
            'Rajasthan Agro Traders',
            'Kota Grain Mandi Agency',
          ];
        }
      });

    this.erpService.firms$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((firms) => {
        this.firms = firms.filter((f) => f.isActive);
      });

    this.erpService.warehouses$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.warehouses = list;
        this.applyFilters();
      });
  }

  private initForm(): void {
    this.warehouseForm = this.fb.group({
      clientFirm: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      contactPerson: [''],
      contactPhone: [
        '',
        [Validators.pattern('^[0-9]{10}$')],
      ],
      remarks: [''],
    });
  }

  // ── Search & Filter Logic ──
  onSearch(): void {
    this.appliedSearchTerm = this.searchTerm.trim();
    this.appliedStatusFilter = this.statusFilter;
    this.showReset = !!this.appliedSearchTerm || this.appliedStatusFilter !== 'all';
    this.page = 1;
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.onSearch();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.appliedSearchTerm = '';
    this.statusFilter = 'all';
    this.appliedStatusFilter = 'all';
    this.showReset = false;
    this.page = 1;
    this.applyFilters();
  }

  setSort(field: WarehouseSortField): void {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.appliedSearchTerm.toLowerCase();
    const st = this.appliedStatusFilter;

    let result = this.warehouses.filter((w) => {
      const matchSearch =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.id.toLowerCase().includes(q) ||
        w.city.toLowerCase().includes(q) ||
        (w.partyName && w.partyName.toLowerCase().includes(q)) ||
        (w.clientFirm && w.clientFirm.toLowerCase().includes(q)) ||
        (w.contactPerson && w.contactPerson.toLowerCase().includes(q));

      const matchStatus =
        st === 'all' ||
        (st === 'Active' && w.isActive) ||
        (st === 'Inactive' && !w.isActive);

      return matchSearch && matchStatus;
    });

    // Sort
    result.sort((a, b) => {
      let valA: string | boolean = '';
      let valB: string | boolean = '';

      switch (this.sortField) {
        case 'id':
          valA = a.id;
          valB = b.id;
          break;
        case 'name':
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        case 'city':
          valA = a.city.toLowerCase();
          valB = b.city.toLowerCase();
          break;
        case 'status':
          valA = a.isActive ? 'Active' : 'Inactive';
          valB = b.isActive ? 'Active' : 'Inactive';
          break;
        case 'createdAt':
          valA = a.createdAt;
          valB = b.createdAt;
          break;
      }

      if (valA < valB) return this.sortAsc ? -1 : 1;
      if (valA > valB) return this.sortAsc ? 1 : -1;
      return 0;
    });

    this.filteredWarehouses = result;
    this.updateSummaryAndPagination();
  }

  updateSummaryAndPagination(): void {
    this.totalCount = this.warehouses.length;
    this.activeCount = this.warehouses.filter((w) => w.isActive).length;
    this.inactiveCount = this.warehouses.filter((w) => !w.isActive).length;
    this.citiesCount = new Set(
      this.warehouses.map((w) => w.city.toLowerCase().trim()),
    ).size;
    this.itemsPerPageCount =
      this.tableSize === 'all'
        ? Math.max(1, this.filteredWarehouses.length)
        : Number(this.tableSize);
    if (this.filteredWarehouses.length === 0) {
      this.showingStart = 0;
      this.showingEnd = 0;
    } else {
      this.showingStart = (this.page - 1) * this.itemsPerPageCount + 1;
      this.showingEnd = Math.min(
        this.page * this.itemsPerPageCount,
        this.filteredWarehouses.length,
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

  // ── UC-WH-01 & UC-WH-03: Create & Edit Warehouse ──
  openAddModal(): void {
    this.isEdit = false;
    this.selectedWarehouse = null;
    this.formError = '';
    this.warehouseForm.reset({
      clientFirm: this.parties[0] || this.firms[0]?.name || '',
      name: '',
      address: '',
      city: '',
      contactPerson: '',
      contactPhone: '',
      remarks: '',
    });
    this.isModalOpen = true;
  }

  openEditModal(w: WarehouseRecord): void {
    this.isEdit = true;
    this.selectedWarehouse = w;
    this.formError = '';
    this.warehouseForm.reset({
      clientFirm: w.partyName || w.clientFirm || this.parties[0] || '',
      name: w.name,
      address: w.address,
      city: w.city,
      contactPerson: w.contactPerson || '',
      contactPhone: w.contactPhone || '',
      remarks: w.remarks || '',
    });
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
      this.formError = 'Please select a Party and fill all mandatory fields (Name, Address, City).';
      return;
    }

    const val = this.warehouseForm.value;
    const payload = {
      ...val,
      partyName: val.clientFirm,
      clientFirm: val.clientFirm,
    };
    const res =
      this.isEdit && this.selectedWarehouse
        ? this.erpService.updateWarehouse(this.selectedWarehouse.id, payload)
        : this.erpService.createWarehouse(payload);

    if (!res.ok) {
      this.formError = res.message;
      return;
    }

    this.notificationService.show(res.message, 'success', 2500);
    this.closeModal();
  }

  // ── UC-WH-02: View Warehouse Details ──
  openViewDetails(w: WarehouseRecord): void {
    this.viewingWarehouse = w;
    this.isViewModalOpen = true;
  }

  closeViewDetails(): void {
    this.isViewModalOpen = false;
    this.viewingWarehouse = null;
  }

  // ── UC-WH-03: Status Change Confirmation with Safeguards ──
  promptStatusToggle(w: WarehouseRecord): void {
    this.statusTargetWarehouse = w;
    this.statusModalError = '';

    if (w.isActive) {
      // Check physical stock & pending fulfilments (BR-WH 8a, 8b, 8c)
      this.deactivationCheck = this.erpService.canDeactivateWarehouse(w.id);
    } else {
      this.deactivationCheck = null; // Activation has no stock block
    }

    this.isStatusModalOpen = true;
  }

  closeStatusModal(): void {
    this.isStatusModalOpen = false;
    this.statusTargetWarehouse = null;
    this.deactivationCheck = null;
    this.statusModalError = '';
  }

  confirmStatusToggle(): void {
    if (!this.statusTargetWarehouse) return;

    if (this.statusTargetWarehouse.isActive && this.deactivationCheck && !this.deactivationCheck.canDeactivate) {
      this.statusModalError =
        'Deactivation blocked: Clear physical inventory and pending truck fulfilments before deactivating.';
      return;
    }

    const res = this.erpService.toggleWarehouseStatus(this.statusTargetWarehouse.id);
    if (!res.ok) {
      this.statusModalError = res.message;
      return;
    }

    this.notificationService.show(res.message, 'success', 2500);
    this.closeStatusModal();
  }
}
