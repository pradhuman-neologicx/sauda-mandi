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
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  PackagingUomRecord,
  SaudaErpMockService,
  WeightUomRecord,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-uom',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './uom.component.html',
  styleUrl: './uom.component.scss',
})
export class UomComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  activeTab: 'Packaging UOM' | 'Weight UOM' = 'Packaging UOM';

  packagingUoms: PackagingUomRecord[] = [];
  weightUoms: WeightUomRecord[] = [];

  filteredPackagingUoms: PackagingUomRecord[] = [];
  filteredWeightUoms: WeightUomRecord[] = [];

  // Search (on Search button click)
  searchTerm = '';
  appliedSearchTerm = '';
  showReset = false;

  // Pagination
  page = 1;
  tableSize: number | 'all' = 10;
  tableSizes: (number | 'all')[] = [10, 25, 50, 'all'];

  // Packaging UOM Modal
  isPkgModalOpen = false;
  isPkgEdit = false;
  selectedPkgUom: PackagingUomRecord | null = null;
  pkgForm!: FormGroup;

  // Weight UOM Modal
  isWtModalOpen = false;
  isWtEdit = false;
  selectedWtUom: WeightUomRecord | null = null;
  wtForm!: FormGroup;

  formError = '';

  constructor(
    private fb: FormBuilder,
    private erpService: SaudaErpMockService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.pkgForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
    this.wtForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
    });

    combineLatest([this.erpService.packagingUoms$, this.erpService.weightUoms$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([pkgList, wtList]) => {
        this.packagingUoms = pkgList;
        this.weightUoms = wtList;
        this.applyFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setActiveTab(tab: 'Packaging UOM' | 'Weight UOM'): void {
    this.activeTab = tab;
    this.resetFilters();
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
    if (this.activeTab === 'Packaging UOM') {
      this.filteredPackagingUoms = this.packagingUoms.filter((u) =>
        !q ? true : u.name.toLowerCase().includes(q),
      );
    } else {
      this.filteredWeightUoms = this.weightUoms.filter((u) =>
        !q ? true : u.name.toLowerCase().includes(q),
      );
    }
  }

  get itemsPerPageCount(): number {
    const currentLength =
      this.activeTab === 'Packaging UOM'
        ? this.filteredPackagingUoms.length
        : this.filteredWeightUoms.length;
    return this.tableSize === 'all' ? Math.max(1, currentLength) : this.tableSize;
  }

  get showingStart(): number {
    const total =
      this.activeTab === 'Packaging UOM'
        ? this.filteredPackagingUoms.length
        : this.filteredWeightUoms.length;
    if (total === 0) return 0;
    return (this.page - 1) * this.itemsPerPageCount + 1;
  }

  get showingEnd(): number {
    const total =
      this.activeTab === 'Packaging UOM'
        ? this.filteredPackagingUoms.length
        : this.filteredWeightUoms.length;
    return Math.min(this.page * this.itemsPerPageCount, total);
  }

  onTableSizeChange(): void {
    this.page = 1;
  }

  // ── Packaging UOM Modal Handlers ──

  openAddPackagingModal(): void {
    this.isPkgEdit = false;
    this.selectedPkgUom = null;
    this.formError = '';
    this.pkgForm.reset({ name: '' });
    this.isPkgModalOpen = true;
  }

  openEditPackagingModal(uom: PackagingUomRecord): void {
    this.isPkgEdit = true;
    this.selectedPkgUom = uom;
    this.formError = '';
    this.pkgForm.reset({ name: uom.name });
    this.isPkgModalOpen = true;
  }

  closePkgModal(): void {
    this.isPkgModalOpen = false;
    this.formError = '';
  }

  submitPackagingUom(): void {
    this.formError = '';
    if (this.pkgForm.invalid) {
      this.pkgForm.markAllAsTouched();
      this.formError = 'Please enter a valid Packaging UOM name (min 2 characters).';
      return;
    }
    const name = this.pkgForm.value.name;
    const res =
      this.isPkgEdit && this.selectedPkgUom
        ? this.erpService.updatePackagingUom(this.selectedPkgUom.id, name)
        : this.erpService.createPackagingUom(name);

    if (!res.ok) {
      this.formError = res.message;
      return;
    }
    this.notificationService.show(res.message, 'success', 2500);
    this.closePkgModal();
  }

  togglePkgStatus(uom: PackagingUomRecord): void {
    const res = this.erpService.togglePackagingUomStatus(uom.id);
    if (res.ok) {
      this.notificationService.show(res.message, 'success', 2500);
    }
  }

  // ── Weight UOM Modal Handlers ──

  openAddWeightModal(): void {
    this.isWtEdit = false;
    this.selectedWtUom = null;
    this.formError = '';
    this.wtForm.reset({ name: '' });
    this.isWtModalOpen = true;
  }

  openEditWeightModal(uom: WeightUomRecord): void {
    this.isWtEdit = true;
    this.selectedWtUom = uom;
    this.formError = '';
    this.wtForm.reset({ name: uom.name });
    this.isWtModalOpen = true;
  }

  closeWtModal(): void {
    this.isWtModalOpen = false;
    this.formError = '';
  }

  submitWeightUom(): void {
    this.formError = '';
    if (this.wtForm.invalid) {
      this.wtForm.markAllAsTouched();
      this.formError = 'Please enter a valid Weight UOM name.';
      return;
    }
    const name = this.wtForm.value.name;
    const res =
      this.isWtEdit && this.selectedWtUom
        ? this.erpService.updateWeightUom(this.selectedWtUom.id, name)
        : this.erpService.createWeightUom(name);

    if (!res.ok) {
      this.formError = res.message;
      return;
    }
    this.notificationService.show(res.message, 'success', 2500);
    this.closeWtModal();
  }

  toggleWtStatus(uom: WeightUomRecord): void {
    const res = this.erpService.toggleWeightUomStatus(uom.id);
    if (res.ok) {
      this.notificationService.show(res.message, 'success', 2500);
    }
  }
}

