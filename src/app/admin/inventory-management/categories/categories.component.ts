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
  InvCategoryRecord,
  InvSubCategoryRecord,
  SaudaErpMockService,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  activeTab: 'Categories' | 'Sub Categories' = 'Categories';

  categories: InvCategoryRecord[] = [];
  subCategories: InvSubCategoryRecord[] = [];

  filteredCategories: InvCategoryRecord[] = [];
  filteredSubCategories: InvSubCategoryRecord[] = [];

  // Search (on Search button click)
  searchTerm = '';
  appliedSearchTerm = '';
  showReset = false;

  // Pagination
  page = 1;
  tableSize: number | 'all' = 10;
  tableSizes: (number | 'all')[] = [10, 25, 50, 'all'];

  // Modals
  isCatModalOpen = false;
  isCatEdit = false;
  selectedCategory: InvCategoryRecord | null = null;
  categoryForm!: FormGroup;

  isSubModalOpen = false;
  isSubEdit = false;
  selectedSubCategory: InvSubCategoryRecord | null = null;
  subCategoryForm!: FormGroup;

  formError = '';

  constructor(
    private fb: FormBuilder,
    private erpService: SaudaErpMockService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
    this.subCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      categoryId: ['', Validators.required],
    });

    combineLatest([
      this.erpService.invCategories$,
      this.erpService.invSubCategories$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([cats, subs]) => {
        this.categories = cats;
        this.subCategories = subs;
        this.applyFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setActiveTab(tab: 'Categories' | 'Sub Categories'): void {
    this.activeTab = tab;
    this.searchTerm = '';
    this.appliedSearchTerm = '';
    this.showReset = false;
    this.page = 1;
    this.applyFilters();
  }

  onSearch(): void {
    this.appliedSearchTerm = this.searchTerm.trim();
    this.showReset = this.appliedSearchTerm.length > 0;
    this.page = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.appliedSearchTerm.toLowerCase();
    this.filteredCategories = this.categories.filter(
      (c) => !q || c.name.toLowerCase().includes(q),
    );
    this.filteredSubCategories = this.subCategories.filter(
      (sc) =>
        !q ||
        sc.name.toLowerCase().includes(q) ||
        this.getCategoryName(sc.categoryId).toLowerCase().includes(q),
    );
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.appliedSearchTerm = '';
    this.showReset = false;
    this.page = 1;
    this.applyFilters();
  }

  get activeCategories(): InvCategoryRecord[] {
    return this.categories.filter((c) => c.isActive);
  }

  get activeListLength(): number {
    return this.activeTab === 'Categories'
      ? this.filteredCategories.length
      : this.filteredSubCategories.length;
  }

  get itemsPerPageCount(): number {
    return this.tableSize === 'all'
      ? Math.max(1, this.activeListLength)
      : Number(this.tableSize);
  }

  get showingStart(): number {
    if (this.activeListLength === 0) return 0;
    return (this.page - 1) * this.itemsPerPageCount + 1;
  }

  get showingEnd(): number {
    return Math.min(this.page * this.itemsPerPageCount, this.activeListLength);
  }

  onTableSizeChange(): void {
    this.page = 1;
  }

  onTableDataChange(pageNumber: number): void {
    this.page = pageNumber;
  }

  getCategoryName(categoryId: string): string {
    return this.categories.find((c) => c.id === categoryId)?.name || '—';
  }

  // ── Category CRUD ──
  openAddCategoryModal(): void {
    this.isCatEdit = false;
    this.selectedCategory = null;
    this.formError = '';
    this.categoryForm.reset({ name: '' });
    this.isCatModalOpen = true;
  }

  openEditCategoryModal(cat: InvCategoryRecord): void {
    this.isCatEdit = true;
    this.selectedCategory = cat;
    this.formError = '';
    this.categoryForm.reset({ name: cat.name });
    this.isCatModalOpen = true;
  }

  submitCategory(): void {
    this.formError = '';
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      this.formError = 'Category name (min 2 characters) is required.';
      return;
    }

    const name = this.categoryForm.value.name;
    const result =
      this.isCatEdit && this.selectedCategory
        ? this.erpService.updateInvCategory(this.selectedCategory.id, name)
        : this.erpService.createInvCategory(name);

    if (!result.ok) {
      this.formError = result.message;
      this.notificationService.show(result.message, 'error', 3000);
      return;
    }

    this.notificationService.show(result.message, 'success', 3000);
    this.closeModals();
  }

  toggleCategoryStatus(cat: InvCategoryRecord): void {
    const result = this.erpService.toggleInvCategoryStatus(cat.id);
    if (result.ok) {
      this.notificationService.show(result.message, 'success', 2500);
    }
  }

  // ── Sub-Category CRUD ──
  openAddSubCategoryModal(): void {
    this.isSubEdit = false;
    this.selectedSubCategory = null;
    this.formError = '';
    this.subCategoryForm.reset({
      name: '',
      categoryId: this.activeCategories[0]?.id || '',
    });
    this.isSubModalOpen = true;
  }

  openEditSubCategoryModal(sub: InvSubCategoryRecord): void {
    this.isSubEdit = true;
    this.selectedSubCategory = sub;
    this.formError = '';
    this.subCategoryForm.reset({
      name: sub.name,
      categoryId: sub.categoryId,
    });
    this.isSubModalOpen = true;
  }

  submitSubCategory(): void {
    this.formError = '';
    if (this.subCategoryForm.invalid) {
      this.subCategoryForm.markAllAsTouched();
      this.formError = 'Sub Category name and parent Category are required.';
      return;
    }

    const { name, categoryId } = this.subCategoryForm.value;
    const result =
      this.isSubEdit && this.selectedSubCategory
        ? this.erpService.updateInvSubCategory(
            this.selectedSubCategory.id,
            name,
            categoryId,
          )
        : this.erpService.createInvSubCategory(name, categoryId);

    if (!result.ok) {
      this.formError = result.message;
      this.notificationService.show(result.message, 'error', 3000);
      return;
    }

    this.notificationService.show(result.message, 'success', 3000);
    this.closeModals();
  }

  toggleSubCategoryStatus(sub: InvSubCategoryRecord): void {
    const result = this.erpService.toggleInvSubCategoryStatus(sub.id);
    if (result.ok) {
      this.notificationService.show(result.message, 'success', 2500);
    }
  }

  closeModals(): void {
    this.isCatModalOpen = false;
    this.isSubModalOpen = false;
    this.formError = '';
  }
}
