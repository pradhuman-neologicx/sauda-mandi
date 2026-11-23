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
import { NgSelectModule } from '@ng-select/ng-select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FirmRecord,
  SaudaErpMockService,
  UserRecord,
  UserType,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelectModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private erpService = inject(SaudaErpMockService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  // Master lists
  allUsers: UserRecord[] = [];
  filteredUsers: UserRecord[] = [];
  firmsList: FirmRecord[] = [];
  readonly userTypes: UserType[] = [
    'Business Owner / Admin',
    'Operations Executive',
  ];

  // Currently logged-in admin (simulated context)
  readonly currentLoggedInUserId = 'USR-001'; // Rajesh Sharma

  // KPI Metrics
  totalUsers = 0;
  totalAdmins = 0;
  totalOps = 0;
  totalPendingSetup = 0;

  // Search & Filters
  searchTerm = '';
  selectedRole: 'All' | UserType = 'All';
  selectedFirm = 'All';
  showReset = false;

  // Pagination
  page = 1;
  tableSize: number | 'all' = 10;
  tableSizes: (number | 'all')[] = [10, 25, 50, 'all'];

  itemsPerPageCount: number = 10;
  showingStart: number = 0;
  showingEnd: number = 0;

  // Add / Edit Form Modal
  isFormModalOpen = false;
  isEditMode = false;
  selectedUserId: string | null = null;
  userForm!: FormGroup;
  formError = '';

  // View User Details Modal (UC-USR-02)
  isViewModalOpen = false;
  viewingUser: UserRecord | null = null;

  // Status Change Confirmation Modal (UC-USR-03)
  isStatusModalOpen = false;
  statusTargetUser: UserRecord | null = null;
  statusModalError = '';

  ngOnInit(): void {
    this.initForm();

    // Subscribe to firms
    this.erpService.firms$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((firms) => {
        this.firmsList = firms.filter((f) => f.isActive);
      });

    // Subscribe to users
    this.erpService.users$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((users) => {
        this.allUsers = users;
        this.computeKpis();
        this.applyFilters();
      });
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      userType: ['Operations Executive', [Validators.required]],
      primaryFirm: [[], [Validators.required]],
    });
  }

  private computeKpis(): void {
    this.totalUsers = this.allUsers.length;
    this.totalAdmins = this.allUsers.filter(
      (u) => u.userType === 'Business Owner / Admin' && u.accountStatus === 'Active',
    ).length;
    this.totalOps = this.allUsers.filter(
      (u) => u.userType === 'Operations Executive' && u.accountStatus === 'Active',
    ).length;
    this.totalPendingSetup = this.allUsers.filter(
      (u) => u.passwordSetupStatus === 'Pending',
    ).length;
  }

  // Filter & Search Logic
  applyFilters(): void {
    const q = this.searchTerm.trim().toLowerCase();
    this.filteredUsers = this.allUsers.filter((u) => {
      // Text search: Name, Email, Mobile, ID
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.mobile.includes(q) ||
        u.id.toLowerCase().includes(q);

      // Role Filter
      const matchesRole =
        this.selectedRole === 'All' || u.userType === this.selectedRole;

      // Firm Filter
      const matchesFirm =
        this.selectedFirm === 'All' ||
        u.primaryFirm
          .split(',')
          .map((f) => f.trim())
          .includes(this.selectedFirm);

      return matchesSearch && matchesRole && matchesFirm;
    });

    this.showReset =
      !!this.searchTerm.trim() ||
      this.selectedRole !== 'All' ||
      this.selectedFirm !== 'All';

    this.page = 1;
    this.updatePaginationCounters();
  }

  updatePaginationCounters(): void {
    this.itemsPerPageCount =
      this.tableSize === 'all'
        ? this.filteredUsers.length || 10
        : Number(this.tableSize);
    if (this.filteredUsers.length === 0) {
      this.showingStart = 0;
      this.showingEnd = 0;
    } else {
      this.showingStart = (this.page - 1) * this.itemsPerPageCount + 1;
      this.showingEnd = Math.min(
        this.page * this.itemsPerPageCount,
        this.filteredUsers.length,
      );
    }
  }

  onSearch(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedRole = 'All';
    this.selectedFirm = 'All';
    this.applyFilters();
  }

  onTableSizeChange(): void {
    this.page = 1;
    this.updatePaginationCounters();
  }

  onTableDataChange(pageNumber: number): void {
    this.page = pageNumber;
    this.updatePaginationCounters();
  }

  // -------------------------------------------------------------
  // UC-USR-01 & UC-USR-03: Create & Edit User
  // -------------------------------------------------------------
  openAddUserModal(): void {
    this.isEditMode = false;
    this.selectedUserId = null;
    this.formError = '';

    const defaultFirms = this.firmsList.length ? [this.firmsList[0].name] : [];
    this.userForm.reset({
      name: '',
      email: '',
      mobile: '',
      userType: 'Operations Executive',
      primaryFirm: defaultFirms,
    });

    this.isFormModalOpen = true;
  }

  openEditUserModal(user: UserRecord): void {
    if (user.id === this.currentLoggedInUserId) {
      this.notificationService.show(
        'You cannot modify your own administrator account through User Management.',
        'error',
        3500,
      );
      return;
    }

    this.isEditMode = true;
    this.selectedUserId = user.id;
    this.formError = '';

    let initialFirms: string[] = [];
    if (Array.isArray(user.primaryFirm)) {
      initialFirms = user.primaryFirm;
    } else if (typeof user.primaryFirm === 'string' && user.primaryFirm.trim()) {
      initialFirms = user.primaryFirm
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);
    }

    this.userForm.reset({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      userType: user.userType,
      primaryFirm: initialFirms,
    });

    this.isFormModalOpen = true;
  }

  closeFormModal(): void {
    this.isFormModalOpen = false;
    this.formError = '';
  }

  selectAllFirms(): void {
    const allNames = this.firmsList.map((f) => f.name);
    this.userForm.patchValue({ primaryFirm: allNames });
  }

  clearAllFirms(): void {
    this.userForm.patchValue({ primaryFirm: [] });
  }

  getFirmList(firmStr: string | null | undefined): string[] {
    if (!firmStr) return [];
    return firmStr
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);
  }

  submitUserForm(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.formError = 'Please fill all mandatory fields with valid data.';
      return;
    }

    const formVal = this.userForm.value;
    const rawFirms = formVal.primaryFirm;
    let firmStr = '';
    if (Array.isArray(rawFirms)) {
      firmStr = rawFirms.join(', ');
    } else if (typeof rawFirms === 'string') {
      firmStr = rawFirms.trim();
    }

    if (!firmStr) {
      this.formError = 'Please select at least one primary firm.';
      return;
    }

    const payload = {
      ...formVal,
      primaryFirm: firmStr,
    };

    if (this.isEditMode && this.selectedUserId) {
      const res = this.erpService.updateUser(this.selectedUserId, payload, 'Rajesh Sharma');
      if (!res.ok) {
        this.formError = res.message;
        return;
      }
      this.notificationService.show(res.message, 'success', 3000);
    } else {
      const res = this.erpService.createUser(payload, 'Rajesh Sharma');
      if (!res.ok) {
        this.formError = res.message;
        return;
      }
      this.notificationService.show(res.message, 'success', 3500);
    }

    this.closeFormModal();
  }

  // -------------------------------------------------------------
  // UC-USR-02: View User Details (Read-only)
  // -------------------------------------------------------------
  openViewDetails(user: UserRecord): void {
    this.viewingUser = user;
    this.isViewModalOpen = true;
  }

  closeViewDetails(): void {
    this.viewingUser = null;
    this.isViewModalOpen = false;
  }

  // -------------------------------------------------------------
  // UC-USR-03: Manage Account Status (Activate/Deactivate)
  // -------------------------------------------------------------
  promptStatusToggle(user: UserRecord): void {
    if (user.id === this.currentLoggedInUserId) {
      this.notificationService.show(
        'You cannot deactivate your own logged-in administrator account.',
        'error',
        3500,
      );
      return;
    }

    this.statusTargetUser = user;
    this.statusModalError = '';
    this.isStatusModalOpen = true;
  }

  closeStatusModal(): void {
    this.statusTargetUser = null;
    this.statusModalError = '';
    this.isStatusModalOpen = false;
  }

  confirmToggleStatus(): void {
    if (!this.statusTargetUser) return;

    const res = this.erpService.toggleUserStatus(
      this.statusTargetUser.id,
      'Rajesh Sharma',
    );
    if (!res.ok) {
      this.statusModalError = res.message;
      return;
    }

    this.notificationService.show(res.message, 'success', 3000);
    this.closeStatusModal();
  }

  // -------------------------------------------------------------
  // Resend Password Setup Invitation
  // -------------------------------------------------------------
  resendInvitation(user: UserRecord): void {
    const res = this.erpService.resendUserInvite(user.id);
    if (res.ok) {
      this.notificationService.show(res.message, 'info', 3500);
    } else {
      this.notificationService.show(res.message, 'error', 3000);
    }
  }
}
