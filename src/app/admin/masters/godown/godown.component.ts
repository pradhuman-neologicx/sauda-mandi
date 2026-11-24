import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ChamberConfig,
  GodownRecord,
  SaudaErpMockService,
  WarehouseRecord,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

export type GodownSortField = 'warehouse' | 'name' | 'chambers' | 'stacks' | 'status';

interface EditableChamber {
  id: string;
  name: string;
  capacityMt: number | null;
  stackNumbers: string[];
  newStackInput: string;
}

@Component({
  selector: 'app-godown',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './godown.component.html',
  styleUrl: './godown.component.scss',
})
export class GodownComponent implements OnInit {
  private erpService = inject(SaudaErpMockService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  warehouses: WarehouseRecord[] = [];
  godowns: GodownRecord[] = [];
  filteredGodowns: GodownRecord[] = [];

  // Filter & Search Controls
  searchTerm = '';
  appliedSearchTerm = '';
  warehouseFilter = 'all';
  appliedWarehouseFilter = 'all';
  statusFilter: 'all' | 'Active' | 'Inactive' = 'all';
  appliedStatusFilter: 'all' | 'Active' | 'Inactive' = 'all';
  showReset = false;

  // Sorting
  sortField: GodownSortField = 'warehouse';
  sortAsc = true;

  // Pagination
  page = 1;
  tableSize: number | 'all' = 10;
  tableSizes: (number | 'all')[] = [10, 25, 50, 'all'];

  // Summary KPIs
  totalGodowns = 0;
  totalChambers = 0;
  totalStacks = 0;
  mappedWarehousesCount = 0;

  // Modal 1: Add / Edit Godown Modal
  isModalOpen = false;
  isEdit = false;
  editingGodownId: string | null = null;
  modalError = '';

  // Form State
  formWarehouseId = '';
  formName = '';
  formSupervisor = '';
  formSupervisorPhone = '';
  formCapacityMt: number | null = null;
  formRemarks = '';
  formChambers: EditableChamber[] = [];

  // Modal 2: View Details Modal (4-Level Hierarchy Inspection)
  isViewModalOpen = false;
  viewingGodown: GodownRecord | null = null;
  viewingWarehouse: WarehouseRecord | null = null;

  // Modal 3: Delete Confirmation Modal
  isDeleteModalOpen = false;
  deletingGodown: GodownRecord | null = null;

  ngOnInit(): void {
    this.erpService.warehouses$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.warehouses = list;
      });

    this.erpService.godowns$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.godowns = list;
        this.applyFilters();
      });
  }

  // ── Filters & Search ──

  onSearch(): void {
    this.appliedSearchTerm = this.searchTerm.trim();
    this.appliedWarehouseFilter = this.warehouseFilter;
    this.appliedStatusFilter = this.statusFilter;
    this.showReset =
      !!this.appliedSearchTerm ||
      this.appliedWarehouseFilter !== 'all' ||
      this.appliedStatusFilter !== 'all';
    this.page = 1;
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.appliedSearchTerm = '';
    this.warehouseFilter = 'all';
    this.appliedWarehouseFilter = 'all';
    this.statusFilter = 'all';
    this.appliedStatusFilter = 'all';
    this.showReset = false;
    this.page = 1;
    this.applyFilters();
  }

  setSort(field: GodownSortField): void {
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
    const whFilter = this.appliedWarehouseFilter;
    const stFilter = this.appliedStatusFilter;

    let res = this.godowns.filter((g) => {
      // Warehouse filter
      if (whFilter !== 'all' && g.warehouseId !== whFilter) {
        return false;
      }
      // Status filter
      if (stFilter === 'Active' && !g.isActive) return false;
      if (stFilter === 'Inactive' && g.isActive) return false;

      // Text search: matches Godown Name, Warehouse Name, Supervisor, Chamber Name, or Stack Number
      if (q) {
        const matchName = g.name.toLowerCase().includes(q);
        const matchWh = g.warehouseName.toLowerCase().includes(q);
        const matchSupervisor = (g.supervisor || '').toLowerCase().includes(q);
        const matchChamber = g.chambers.some((c) =>
          c.name.toLowerCase().includes(q) ||
          c.stackNumbers.some((s) => s.toLowerCase().includes(q))
        );
        if (!matchName && !matchWh && !matchSupervisor && !matchChamber) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    res.sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      switch (this.sortField) {
        case 'warehouse':
          valA = a.warehouseName.toLowerCase();
          valB = b.warehouseName.toLowerCase();
          break;
        case 'name':
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        case 'chambers':
          valA = a.chambers.length;
          valB = b.chambers.length;
          break;
        case 'stacks':
          valA = this.getStackCount(a);
          valB = this.getStackCount(b);
          break;
        case 'status':
          valA = a.isActive ? 1 : 0;
          valB = b.isActive ? 1 : 0;
          break;
      }

      if (valA < valB) return this.sortAsc ? -1 : 1;
      if (valA > valB) return this.sortAsc ? 1 : -1;
      return 0;
    });

    this.filteredGodowns = res;
    this.recomputeKpis();
  }

  recomputeKpis(): void {
    this.totalGodowns = this.godowns.length;
    this.totalChambers = this.godowns.reduce((sum, g) => sum + g.chambers.length, 0);
    this.totalStacks = this.godowns.reduce((sum, g) => sum + this.getStackCount(g), 0);
    const whSet = new Set(this.godowns.map((g) => g.warehouseId));
    this.mappedWarehousesCount = whSet.size;
  }

  getStackCount(godown: GodownRecord): number {
    return godown.chambers.reduce((s, c) => s + c.stackNumbers.length, 0);
  }

  onTableSizeChange(): void {
    this.page = 1;
  }

  // ── Modal 1: Add / Edit Godown ──

  openAddModal(): void {
    this.isEdit = false;
    this.editingGodownId = null;
    this.modalError = '';

    const firstActiveWh = this.warehouses.find((w) => w.isActive)?.id || '';
    this.formWarehouseId = firstActiveWh;
    this.formName = '';
    this.formSupervisor = '';
    this.formSupervisorPhone = '';
    this.formCapacityMt = null;
    this.formRemarks = '';

    // Initialize with 1 default chamber
    this.formChambers = [
      {
        id: 'CH-01',
        name: 'Chamber 1',
        capacityMt: null,
        stackNumbers: ['Stack No. 101', 'Stack No. 102'],
        newStackInput: '',
      },
    ];

    this.isModalOpen = true;
  }

  openEditModal(godown: GodownRecord): void {
    this.isEdit = true;
    this.editingGodownId = godown.id;
    this.modalError = '';

    this.formWarehouseId = godown.warehouseId;
    this.formName = godown.name;
    this.formSupervisor = godown.supervisor || '';
    this.formSupervisorPhone = godown.supervisorPhone || '';
    this.formCapacityMt = godown.capacityMt ?? null;
    this.formRemarks = godown.remarks || '';

    this.formChambers = godown.chambers.map((c, idx) => ({
      id: c.id || `CH-${String(idx + 1).padStart(2, '0')}`,
      name: c.name,
      capacityMt: c.capacityMt ?? null,
      stackNumbers: [...c.stackNumbers],
      newStackInput: '',
    }));

    if (this.formChambers.length === 0) {
      this.addChamber();
    }

    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.editingGodownId = null;
    this.modalError = '';
  }

  getSelectedWarehouseRecord(): WarehouseRecord | undefined {
    return this.warehouses.find((w) => w.id === this.formWarehouseId);
  }

  // ── Chamber & Stack Management in Form ──

  addChamber(): void {
    const nextIdx = this.formChambers.length + 1;
    this.formChambers.push({
      id: `CH-${String(nextIdx).padStart(2, '0')}`,
      name: `Chamber ${nextIdx}`,
      capacityMt: null,
      stackNumbers: [`Stack No. ${nextIdx}01`, `Stack No. ${nextIdx}02`],
      newStackInput: '',
    });
  }

  removeChamber(idx: number): void {
    if (this.formChambers.length <= 1) {
      this.notificationService.show('Godown must have at least one Chamber.', 'error', 3000);
      return;
    }
    this.formChambers.splice(idx, 1);
  }

  addStackToChamber(chamber: EditableChamber): void {
    const raw = (chamber.newStackInput || '').trim();
    if (!raw) return;

    // Support comma-separated entries, e.g. "101, 102, 103"
    const parts = raw.split(',').map((s) => s.trim()).filter((s) => !!s);
    for (const part of parts) {
      const formatted = part.toLowerCase().startsWith('stack') ? part : `Stack No. ${part}`;
      if (!chamber.stackNumbers.includes(formatted)) {
        chamber.stackNumbers.push(formatted);
      }
    }
    chamber.newStackInput = '';
  }

  removeStackFromChamber(chamber: EditableChamber, stackIdx: number): void {
    chamber.stackNumbers.splice(stackIdx, 1);
  }

  populateSampleChambers(): void {
    this.formChambers = [
      {
        id: 'CH-01',
        name: 'Chamber A (Primary Bay)',
        capacityMt: 150,
        stackNumbers: ['Stack No. 101', 'Stack No. 102', 'Stack No. 103', 'Stack No. 104'],
        newStackInput: '',
      },
      {
        id: 'CH-02',
        name: 'Chamber B (Secondary Bay)',
        capacityMt: 120,
        stackNumbers: ['Stack No. 105', 'Stack No. 106', 'Stack No. 110'],
        newStackInput: '',
      },
    ];
  }

  saveGodown(): void {
    this.modalError = '';

    if (!this.formWarehouseId) {
      this.modalError = 'Please select a Warehouse.';
      return;
    }

    const trimmedName = this.formName.trim();
    if (trimmedName.length < 2) {
      this.modalError = 'Godown Name is required (minimum 2 characters).';
      return;
    }

    if (this.formChambers.length === 0) {
      this.modalError = 'Please add at least one Chamber for this Godown.';
      return;
    }

    // Validate that each chamber has a valid name
    for (let i = 0; i < this.formChambers.length; i++) {
      const c = this.formChambers[i];
      if (!c.name.trim()) {
        this.modalError = `Chamber #${i + 1} requires a valid name.`;
        return;
      }
    }

    const cleanedChambers: ChamberConfig[] = this.formChambers.map((c, idx) => ({
      id: c.id || `CH-${String(idx + 1).padStart(2, '0')}`,
      name: c.name.trim(),
      capacityMt: c.capacityMt ? Number(c.capacityMt) : undefined,
      stackNumbers: c.stackNumbers.map((s) => s.trim()).filter((s) => !!s),
    }));

    if (this.isEdit && this.editingGodownId) {
      const res = this.erpService.updateGodown(this.editingGodownId, {
        warehouseId: this.formWarehouseId,
        name: trimmedName,
        supervisor: this.formSupervisor.trim() || undefined,
        supervisorPhone: this.formSupervisorPhone.trim() || undefined,
        capacityMt: this.formCapacityMt ? Number(this.formCapacityMt) : undefined,
        remarks: this.formRemarks.trim() || undefined,
        chambers: cleanedChambers,
      });

      if (!res.ok) {
        this.modalError = res.message;
        return;
      }

      this.notificationService.show(res.message, 'success', 3500);
      this.closeModal();
    } else {
      const res = this.erpService.createGodown({
        warehouseId: this.formWarehouseId,
        name: trimmedName,
        supervisor: this.formSupervisor.trim() || undefined,
        supervisorPhone: this.formSupervisorPhone.trim() || undefined,
        capacityMt: this.formCapacityMt ? Number(this.formCapacityMt) : undefined,
        remarks: this.formRemarks.trim() || undefined,
        chambers: cleanedChambers,
      });

      if (!res.ok) {
        this.modalError = res.message;
        return;
      }

      this.notificationService.show(res.message, 'success', 3500);
      this.closeModal();
    }
  }

  // ── Modal 2: View Details (4-Level Hierarchy) ──

  openViewModal(godown: GodownRecord): void {
    this.viewingGodown = godown;
    this.viewingWarehouse = this.warehouses.find((w) => w.id === godown.warehouseId) || null;
    this.isViewModalOpen = true;
  }

  closeViewModal(): void {
    this.isViewModalOpen = false;
    this.viewingGodown = null;
    this.viewingWarehouse = null;
  }

  // ── Toggle Status ──

  toggleStatus(godown: GodownRecord): void {
    const res = this.erpService.toggleGodownStatus(godown.id);
    if (res.ok) {
      this.notificationService.show(res.message, 'success', 3000);
    } else {
      this.notificationService.show(res.message, 'error', 3500);
    }
  }

  // ── Modal 3: Delete ──

  openDeleteModal(godown: GodownRecord): void {
    this.deletingGodown = godown;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.deletingGodown = null;
  }

  confirmDelete(): void {
    if (!this.deletingGodown) return;
    const res = this.erpService.deleteGodown(this.deletingGodown.id);
    if (res.ok) {
      this.notificationService.show(res.message, 'success', 3000);
      this.closeDeleteModal();
    } else {
      this.notificationService.show(res.message, 'error', 3500);
    }
  }
}
