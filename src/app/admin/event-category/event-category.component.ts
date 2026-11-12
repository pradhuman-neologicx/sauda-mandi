import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ApiService } from 'src/app/core/services/api.service';
import { NgClass, DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
    selector: 'app-event-category',
    standalone: true,
    templateUrl: './event-category.component.html',
    styleUrl: './event-category.component.scss',
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms ease-out', style({ opacity: 1 })),
            ]),
        ]),
        trigger('slideIn', [
            transition(':enter', [
                style({ transform: 'translateY(20px)', opacity: 0 }),
                animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ transform: 'translateY(0)', opacity: 1 })),
            ]),
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, ReactiveFormsModule, NgClass, NgxPaginationModule, DatePipe]
})
export class EventCategoryComponent implements OnInit {
  // Tabs & Searching
  searchForm!: FormGroup;
  isLoading = false;

  // Data
  displayCategories: any[] = [];

  // Form Modals
  isCreateOpen = false;
  isUpdateOpen = false;
  isViewOpen = false;
  createForm!: FormGroup;
  updateForm!: FormGroup;
  viewForm!: FormGroup;

  // Pagination
  page = 1;
  tableSize: any = 10;
  tableSizes: any[] = [10, 25, 50, 'all'];
  totalRecords = 0;
  showReset = false;

  // Selected Data for modals
  selectedCategory: any = null;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.getCategories();
  }

  initForms() {
    this.searchForm = this.fb.group({
      searchQuery: [''],
    });

    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.updateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.viewForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      status: [{ value: '', disabled: true }],
      createdAt: [{ value: '', disabled: true }],
    });
  }

  // ── Category Operations ──

  getCategories() {
    this.isLoading = true;
    const query = this.searchForm.get('searchQuery')?.value || '';
    
    // Using local search if API doesn't support it, but keeping structure dynamic
    this.apiService.get('admin/categories').subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.status === 200 || res.data) {
          let data = res.data?.data || res.data || [];
          
          // Map numeric is_active to strings for UI compatibility
          data = data.map((cat: any) => ({
            ...cat,
            status: cat.is_active === 1 ? 'Active' : 'Deactive'
          }));

          if (query) {
            data = data.filter((c: any) => c.name.toLowerCase().includes(query.toLowerCase()));
          }

          this.displayCategories = data;
          this.totalRecords = data.length;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    this.showReset = !!this.searchForm.get('searchQuery')?.value;
    this.page = 1;
    this.getCategories();
  }

  resetSearch() {
    this.searchForm.reset();
    this.showReset = false;
    this.page = 1;
    this.getCategories();
  }

  openCreateModal() {
    this.createForm.reset();
    this.isCreateOpen = true;
  }

  onCreate() {
    if (this.createForm.valid) {
      this.isLoading = true;
      const payload = {
        name: this.createForm.value.name
      };

      this.apiService.post('admin/categories', payload).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.notificationService.show(res.message, 'success');
          this.getCategories();
          this.closeModal();
        },
        error: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.createForm.markAllAsTouched();
    }
  }

  // ── Update ──

  openUpdateModal(category: any) {
    this.isLoading = true;
    this.apiService.get(`admin/categories/${category.id}`).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.status === 200 && res.data) {
          const detail = res.data;
          this.selectedCategory = detail;
          this.updateForm.patchValue({
            name: detail.name,
          });
          this.isUpdateOpen = true;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openViewModal(category: any) {
    this.isLoading = true;
    this.apiService.get(`admin/categories/${category.id}`).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.status === 200 && res.data) {
          const detail = res.data;
          this.selectedCategory = detail;
          this.viewForm.patchValue({
            name: detail.name,
            status: detail.is_active === 1 ? 'Active' : 'Deactive',
            createdAt: detail.created_at ? new Date(detail.created_at).toLocaleString('en-IN') : 'N/A'
          });
          this.isViewOpen = true;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onUpdate() {
    if (this.updateForm.valid && this.selectedCategory) {
      this.isLoading = true;
      const payload = {
        id: this.selectedCategory.id,
        name: this.updateForm.value.name
      };

      this.apiService.post('admin/categories', payload).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.notificationService.show(res.message, 'success');
          this.getCategories();
          this.closeModal();
        },
        error: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.updateForm.markAllAsTouched();
    }
  }

  // ── Delete/Status Toggle ──

  toggleStatus(category: any) {
    this.isLoading = true;
    this.apiService.patch(`admin/categories/${category.id}/status`, {}).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.notificationService.show(res.message, 'success');
        this.getCategories();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  // ── Pagination Getters ──

  get showingStart(): number {
    if (this.totalRecords === 0) return 0;
    return (
      (this.page - 1) *
        (this.tableSize === 'all' ? this.totalRecords : this.tableSize) +
      1
    );
  }

  get showingEnd(): number {
    const end =
      this.page *
      (this.tableSize === 'all' ? this.totalRecords : this.tableSize);
    return Math.min(end, this.totalRecords);
  }

  onTableSizeChange(event: any) {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getCategories();
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.getCategories();
  }

  closeModal() {
    this.isCreateOpen = false;
    this.isUpdateOpen = false;
    this.isViewOpen = false;
    this.selectedCategory = null;
    this.createForm.reset();
    this.updateForm.reset();
    this.viewForm.reset();
  }
}
