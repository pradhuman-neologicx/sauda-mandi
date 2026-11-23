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
import {
  PackagingUomRecord,
  SaudaErpMockService,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-uom',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './uom.component.html',
  styleUrl: './uom.component.scss',
})
export class UomComponent implements OnInit {
  private fb = inject(FormBuilder);
  private erpService = inject(SaudaErpMockService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  packagingUoms: PackagingUomRecord[] = [];
  filteredPackagingUoms: PackagingUomRecord[] = [];

  // Search (on Search button click)
  searchTerm = '';
  appliedSearchTerm = '';
  showReset = false;

  // Pagination
  page = 1;
  tableSize: number | 'all' = 10;
  tableSizes: (number | 'all')[] = [10, 25, 50, 'all'];

  itemsPerPageCount: number = 10;
  showingStart: number = 0;
  showingEnd: number = 0;

  // Packaging UOM Modal
  isPkgModalOpen = false;
  isPkgEdit = false;
  selectedPkgUom: PackagingUomRecord | null = null;
  pkgForm!: FormGroup;

  formError = '';

  ngOnInit(): void {
    this.pkgForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      bagQuantity: [50, [Validators.required, Validators.min(0.1)]],
    });

    this.erpService.packagingUoms$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pkgList) => {
        this.packagingUoms = pkgList;
        this.applyFilters();
      });
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
    this.filteredPackagingUoms = this.packagingUoms.filter((u) =>
      !q ? true : u.name.toLowerCase().includes(q),
    );
    this.updatePaginationCounters();
  }

  updatePaginationCounters(): void {
    const currentLength = this.filteredPackagingUoms.length;
    this.itemsPerPageCount =
      this.tableSize === 'all' ? Math.max(1, currentLength) : Number(this.tableSize);
    if (currentLength === 0) {
      this.showingStart = 0;
      this.showingEnd = 0;
    } else {
      this.showingStart = (this.page - 1) * this.itemsPerPageCount + 1;
      this.showingEnd = Math.min(this.page * this.itemsPerPageCount, currentLength);
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

  // ── Packaging UOM Modal Handlers ──

  openAddPackagingModal(): void {
    this.isPkgEdit = false;
    this.selectedPkgUom = null;
    this.formError = '';
    this.pkgForm.reset({ name: '', bagQuantity: 50 });
    this.isPkgModalOpen = true;
  }

  openEditPackagingModal(uom: PackagingUomRecord): void {
    this.isPkgEdit = true;
    this.selectedPkgUom = uom;
    this.formError = '';
    this.pkgForm.reset({ name: uom.name, bagQuantity: uom.bagQuantity ?? 50 });
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
      this.formError = 'Please enter a valid Packaging UOM name and bag quantity (min 0.1 Kg).';
      return;
    }
    const { name, bagQuantity } = this.pkgForm.value;
    const res =
      this.isPkgEdit && this.selectedPkgUom
        ? this.erpService.updatePackagingUom(this.selectedPkgUom.id, name, Number(bagQuantity))
        : this.erpService.createPackagingUom(name, Number(bagQuantity));

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
}
