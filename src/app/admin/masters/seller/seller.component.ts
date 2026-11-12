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
  SellerRecord,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule],
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrl: './seller.component.scss',
})
export class SellerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  allSellers: SellerRecord[] = [];
  filteredSellers: SellerRecord[] = [];

  searchTerm = '';
  appliedSearchTerm = '';
  showReset = false;

  page = 1;
  tableSize: number | 'all' = 10;
  tableSizes: (number | 'all')[] = [10, 25, 50, 'all'];

  isFormOpen = false;
  isEditMode = false;
  selectedSeller: SellerRecord | null = null;
  sellerForm!: FormGroup;
  formError = '';

  constructor(
    private fb: FormBuilder,
    private erpService: SaudaErpMockService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.sellerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.pattern(/^(\d{10})?$/)]],
      defaultCreditDays: [null, [Validators.min(0)]],
    });

    this.erpService.sellers$
      .pipe(takeUntil(this.destroy$))
      .subscribe((list) => {
        this.allSellers = list;
        this.applyFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(): void {
    this.appliedSearchTerm = this.searchTerm.trim();
    this.showReset = this.appliedSearchTerm.length > 0;
    this.page = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.appliedSearchTerm.toLowerCase();
    this.filteredSellers = this.allSellers.filter(
      (s) =>
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.phone || '').includes(q),
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
      ? Math.max(1, this.filteredSellers.length)
      : Number(this.tableSize);
  }

  get showingStart(): number {
    if (this.filteredSellers.length === 0) return 0;
    return (this.page - 1) * this.itemsPerPageCount + 1;
  }

  get showingEnd(): number {
    return Math.min(
      this.page * this.itemsPerPageCount,
      this.filteredSellers.length,
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
    this.selectedSeller = null;
    this.formError = '';
    this.sellerForm.reset({ name: '', phone: '', defaultCreditDays: null });
    this.isFormOpen = true;
  }

  openEditModal(seller: SellerRecord): void {
    this.isEditMode = true;
    this.selectedSeller = seller;
    this.formError = '';
    this.sellerForm.reset({
      name: seller.name,
      phone: seller.phone,
      defaultCreditDays: seller.defaultCreditDays,
    });
    this.isFormOpen = true;
  }

  closeModal(): void {
    this.isFormOpen = false;
    this.selectedSeller = null;
    this.formError = '';
  }

  submitForm(): void {
    this.formError = '';
    if (this.sellerForm.invalid) {
      this.sellerForm.markAllAsTouched();
      this.formError = 'Please enter valid Seller details.';
      return;
    }

    const v = this.sellerForm.value;
    const credit =
      v.defaultCreditDays !== null && v.defaultCreditDays !== ''
        ? Number(v.defaultCreditDays)
        : null;

    const result =
      this.isEditMode && this.selectedSeller
        ? this.erpService.updateSeller(
            this.selectedSeller.id,
            v.name,
            v.phone || '',
            credit,
          )
        : this.erpService.createSeller(v.name, v.phone || '', credit);

    if (!result.ok) {
      this.formError = result.message;
      this.notificationService.show(result.message, 'error', 3000);
      return;
    }

    this.notificationService.show(result.message, 'success', 3000);
    this.closeModal();
  }

  toggleStatus(seller: SellerRecord): void {
    const result = this.erpService.toggleSellerStatus(seller.id);
    if (result.ok) {
      this.notificationService.show(result.message, 'success', 2500);
    } else {
      this.notificationService.show(result.message, 'error', 3000);
    }
  }
}

