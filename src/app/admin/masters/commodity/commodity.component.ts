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
  CommodityRecord,
  PackagingUom,
  SaudaErpMockService,
  WeightUom,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule],
  selector: 'app-commodity',
  templateUrl: './commodity.component.html',
  styleUrl: './commodity.component.scss',
})
export class CommodityComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  allCommodities: CommodityRecord[] = [];
  filteredCommodities: CommodityRecord[] = [];

  readonly packagingUoms: PackagingUom[] = [
    'Bag',
    'Crate',
    'Box',
    'Carton',
    'Sack',
    'Loose',
  ];
  readonly weightUoms: WeightUom[] = ['KG', 'Quintal', 'MT'];

  searchTerm = '';
  appliedSearchTerm = '';
  showReset = false;

  page = 1;
  tableSize: number | 'all' = 10;
  tableSizes: (number | 'all')[] = [10, 25, 50, 'all'];

  isFormOpen = false;
  isEditMode = false;
  selectedCommodity: CommodityRecord | null = null;
  commodityForm!: FormGroup;
  formError = '';

  constructor(
    private fb: FormBuilder,
    private erpService: SaudaErpMockService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.commodityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      defaultPackagingUom: ['Bag', Validators.required],
      defaultWeightUom: ['KG', Validators.required],
    });

    this.erpService.commodities$
      .pipe(takeUntil(this.destroy$))
      .subscribe((list) => {
        this.allCommodities = list;
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
    this.filteredCommodities = this.allCommodities.filter(
      (c) => !q || c.name.toLowerCase().includes(q),
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
      ? Math.max(1, this.filteredCommodities.length)
      : Number(this.tableSize);
  }

  get showingStart(): number {
    if (this.filteredCommodities.length === 0) return 0;
    return (this.page - 1) * this.itemsPerPageCount + 1;
  }

  get showingEnd(): number {
    return Math.min(
      this.page * this.itemsPerPageCount,
      this.filteredCommodities.length,
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
    this.selectedCommodity = null;
    this.formError = '';
    this.commodityForm.reset({
      name: '',
      defaultPackagingUom: 'Bag',
      defaultWeightUom: 'KG',
    });
    this.isFormOpen = true;
  }

  openEditModal(commodity: CommodityRecord): void {
    this.isEditMode = true;
    this.selectedCommodity = commodity;
    this.formError = '';
    this.commodityForm.reset({
      name: commodity.name,
      defaultPackagingUom: commodity.defaultPackagingUom,
      defaultWeightUom: commodity.defaultWeightUom,
    });
    this.isFormOpen = true;
  }

  closeModal(): void {
    this.isFormOpen = false;
    this.selectedCommodity = null;
    this.formError = '';
  }

  submitForm(): void {
    this.formError = '';
    if (this.commodityForm.invalid) {
      this.commodityForm.markAllAsTouched();
      this.formError = 'Please enter a valid commodity name.';
      return;
    }

    const v = this.commodityForm.value;
    const result =
      this.isEditMode && this.selectedCommodity
        ? this.erpService.updateCommodity(
            this.selectedCommodity.id,
            v.name,
            v.defaultPackagingUom,
            v.defaultWeightUom,
          )
        : this.erpService.createCommodity(
            v.name,
            v.defaultPackagingUom,
            v.defaultWeightUom,
          );

    if (!result.ok) {
      this.formError = result.message;
      this.notificationService.show(result.message, 'error', 3000);
      return;
    }

    this.notificationService.show(result.message, 'success', 3000);
    this.closeModal();
  }

  toggleStatus(commodity: CommodityRecord): void {
    const result = this.erpService.toggleCommodityStatus(commodity.id);
    if (result.ok) {
      this.notificationService.show(result.message, 'success', 2500);
    } else {
      this.notificationService.show(result.message, 'error', 3000);
    }
  }
}

