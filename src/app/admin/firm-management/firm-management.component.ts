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
  FirmRecord,
  SaudaErpMockService,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule],
  selector: 'app-firm-management',
  styleUrl: './firm-management.component.scss',
  templateUrl: './firm-management.component.html',
})
export class FirmManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  allFirms: FirmRecord[] = [];
  filteredFirms: FirmRecord[] = [];

  searchTerm = '';
  statusFilter: 'All' | 'Active' | 'Inactive' = 'All';
  appliedSearchTerm = '';
  appliedStatusFilter: 'All' | 'Active' | 'Inactive' = 'All';
  showReset = false;

  // Pagination
  page = 1;
  tableSize: number | 'all' = 10;
  tableSizes: (number | 'all')[] = [10, 25, 50, 'all'];

  isFormOpen = false;
  isEditMode = false;
  selectedFirm: FirmRecord | null = null;
  firmForm!: FormGroup;
  formError = '';

  isViewOpen = false;
  viewingFirm: FirmRecord | null = null;

  constructor(
    private fb: FormBuilder,
    private erpService: SaudaErpMockService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.firmForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email]],
      whatsappNumber: ['', [Validators.pattern(/^([6-9]\d{9})?$/)]],
    });

    this.erpService.firms$
      .pipe(takeUntil(this.destroy$))
      .subscribe((firms) => {
        this.allFirms = firms;
        this.applyFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    this.appliedSearchTerm = this.searchTerm.trim();
    this.appliedStatusFilter = this.statusFilter;
    this.showReset =
      this.appliedSearchTerm.length > 0 || this.appliedStatusFilter !== 'All';
    this.page = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.appliedSearchTerm.toLowerCase();
    this.filteredFirms = this.allFirms.filter((f) => {
      const matchesQuery =
        !q ||
        f.name.toLowerCase().includes(q) ||
        (f.email && f.email.toLowerCase().includes(q)) ||
        (f.whatsappNumber && f.whatsappNumber.includes(q));
      const matchesStatus =
        this.appliedStatusFilter === 'All' ||
        (this.appliedStatusFilter === 'Active' ? f.isActive : !f.isActive);
      return matchesQuery && matchesStatus;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'All';
    this.appliedSearchTerm = '';
    this.appliedStatusFilter = 'All';
    this.showReset = false;
    this.page = 1;
    this.applyFilters();
  }

  get itemsPerPageCount(): number {
    return this.tableSize === 'all'
      ? Math.max(1, this.filteredFirms.length)
      : Number(this.tableSize);
  }

  get showingStart(): number {
    if (this.filteredFirms.length === 0) return 0;
    return (this.page - 1) * this.itemsPerPageCount + 1;
  }

  get showingEnd(): number {
    return Math.min(
      this.page * this.itemsPerPageCount,
      this.filteredFirms.length,
    );
  }

  onTableSizeChange(): void {
    this.page = 1;
  }

  onTableDataChange(pageNumber: number): void {
    this.page = pageNumber;
  }

  get activeCount(): number {
    return this.allFirms.filter((f) => f.isActive).length;
  }

  get inactiveCount(): number {
    return this.allFirms.filter((f) => !f.isActive).length;
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedFirm = null;
    this.formError = '';
    this.firmForm.reset({ name: '', email: '', whatsappNumber: '' });
    this.isFormOpen = true;
  }

  openEditModal(firm: FirmRecord): void {
    this.isEditMode = true;
    this.selectedFirm = firm;
    this.formError = '';
    this.firmForm.reset({
      name: firm.name,
      email: firm.email || '',
      whatsappNumber: firm.whatsappNumber || '',
    });
    this.isFormOpen = true;
  }

  openViewModal(firm: FirmRecord): void {
    this.viewingFirm = firm;
    this.isViewOpen = true;
  }

  closeViewModal(): void {
    this.isViewOpen = false;
    this.viewingFirm = null;
  }

  editFromView(): void {
    if (this.viewingFirm) {
      const firm = this.viewingFirm;
      this.closeViewModal();
      this.openEditModal(firm);
    }
  }

  closeModal(): void {
    this.isFormOpen = false;
    this.selectedFirm = null;
    this.formError = '';
  }

  submitFirmForm(): void {
    this.formError = '';
    if (this.firmForm.invalid) {
      this.firmForm.markAllAsTouched();
      this.formError = 'Please check required fields and valid formats.';
      return;
    }

    const { name, email, whatsappNumber } = this.firmForm.value;
    const payload = {
      name: (name || '').trim(),
      email: (email || '').trim(),
      whatsappNumber: (whatsappNumber || '').trim(),
    };

    const result =
      this.isEditMode && this.selectedFirm
        ? this.erpService.updateFirm(this.selectedFirm.id, payload)
        : this.erpService.createFirm(payload);

    if (!result.ok) {
      this.formError = result.message;
      this.notificationService.show(result.message, 'error', 3000);
      return;
    }

    this.notificationService.show(result.message, 'success', 3000);
    this.closeModal();
  }

  toggleStatus(firm: FirmRecord): void {
    // Static mock status toggle (replace with backend API when ready)
    const result = this.erpService.toggleFirmStatus(firm.id);
    if (result.ok) {
      this.notificationService.show(result.message, 'success', 2500);
    } else {
      this.notificationService.show(result.message, 'error', 3000);
    }
  }
}
