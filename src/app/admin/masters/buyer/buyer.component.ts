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
  BuyerRecord,
  SaudaErpMockService,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule],
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrl: './buyer.component.scss',
})
export class BuyerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  allBuyers: BuyerRecord[] = [];
  filteredBuyers: BuyerRecord[] = [];

  searchTerm = '';
  appliedSearchTerm = '';
  showReset = false;

  page = 1;
  tableSize: number | 'all' = 10;
  tableSizes: (number | 'all')[] = [10, 25, 50, 'all'];

  isFormOpen = false;
  isEditMode = false;
  selectedBuyer: BuyerRecord | null = null;
  buyerForm!: FormGroup;
  formError = '';

  constructor(
    private fb: FormBuilder,
    private erpService: SaudaErpMockService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.buyerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.pattern(/^(\d{10})?$/)]],
      defaultCreditDays: [null, [Validators.min(0)]],
    });

    this.erpService.buyers$
      .pipe(takeUntil(this.destroy$))
      .subscribe((list) => {
        this.allBuyers = list;
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
    this.filteredBuyers = this.allBuyers.filter(
      (b) =>
        !q ||
        b.name.toLowerCase().includes(q) ||
        (b.phone || '').includes(q),
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
      ? Math.max(1, this.filteredBuyers.length)
      : Number(this.tableSize);
  }

  get showingStart(): number {
    if (this.filteredBuyers.length === 0) return 0;
    return (this.page - 1) * this.itemsPerPageCount + 1;
  }

  get showingEnd(): number {
    return Math.min(
      this.page * this.itemsPerPageCount,
      this.filteredBuyers.length,
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
    this.selectedBuyer = null;
    this.formError = '';
    this.buyerForm.reset({ name: '', phone: '', defaultCreditDays: null });
    this.isFormOpen = true;
  }

  openEditModal(buyer: BuyerRecord): void {
    this.isEditMode = true;
    this.selectedBuyer = buyer;
    this.formError = '';
    this.buyerForm.reset({
      name: buyer.name,
      phone: buyer.phone,
      defaultCreditDays: buyer.defaultCreditDays,
    });
    this.isFormOpen = true;
  }

  closeModal(): void {
    this.isFormOpen = false;
    this.selectedBuyer = null;
    this.formError = '';
  }

  submitForm(): void {
    this.formError = '';
    if (this.buyerForm.invalid) {
      this.buyerForm.markAllAsTouched();
      this.formError = 'Please enter valid Buyer details.';
      return;
    }

    const v = this.buyerForm.value;
    const credit =
      v.defaultCreditDays !== null && v.defaultCreditDays !== ''
        ? Number(v.defaultCreditDays)
        : null;

    const result =
      this.isEditMode && this.selectedBuyer
        ? this.erpService.updateBuyer(
            this.selectedBuyer.id,
            v.name,
            v.phone || '',
            credit,
          )
        : this.erpService.createBuyer(v.name, v.phone || '', credit);

    if (!result.ok) {
      this.formError = result.message;
      this.notificationService.show(result.message, 'error', 3000);
      return;
    }

    this.notificationService.show(result.message, 'success', 3000);
    this.closeModal();
  }

  toggleStatus(buyer: BuyerRecord): void {
    const result = this.erpService.toggleBuyerStatus(buyer.id);
    if (result.ok) {
      this.notificationService.show(result.message, 'success', 2500);
    } else {
      this.notificationService.show(result.message, 'error', 3000);
    }
  }
}

