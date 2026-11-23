import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  SaudaErpMockService,
  SellerRecord,
  BuyerRecord,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

export interface UnifiedParty {
  id: string;
  name: string;
  role: 'Seller' | 'Buyer';
  phone: string;
  email: string;
  defaultCreditDays: number | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-party-mangement',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './party-mangement.component.html',
  styleUrl: './party-mangement.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PartyMangementComponent implements OnInit {
  private erpService = inject(SaudaErpMockService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  // Master lists
  allParties: UnifiedParty[] = [];
  filteredParties: UnifiedParty[] = [];

  // Filter States
  statusFilter: 'All' | 'Active' | 'Inactive' = 'All';
  searchTerm = '';
  appliedSearchTerm = '';
  showReset = false;

  // Pagination
  page = 1;
  tableSize: number | 'all' = 10;
  tableSizes: (number | 'all')[] = [10, 25, 50, 'all'];

  // Modal States
  showAddModal = false;
  showEditModal = false;
  showViewModal = false;
  showToggleModal = false;

  selectedParty: UnifiedParty | null = null;
  partyToToggle: UnifiedParty | null = null;

  modalError = '';

  // Form Models
  partyForm: {
    name: string;
    phone: string;
    email: string;
    defaultCreditDays: number | null;
  } = {
    name: '',
    phone: '',
    email: '',
    defaultCreditDays: 15,
  };

  editForm: {
    id: string;
    name: string;
    phone: string;
    email: string;
    defaultCreditDays: number | null;
  } = {
    id: '',
    name: '',
    phone: '',
    email: '',
    defaultCreditDays: 15,
  };

  // KPIs
  totalPartiesCount = 0;
  activePartiesCount = 0;
  creditPartiesCount = 0;
  inactivePartiesCount = 0;

  get showingStart(): number {
    if (this.filteredParties.length === 0) return 0;
    return (this.page - 1) * this.itemsPerPageCount + 1;
  }

  get showingEnd(): number {
    if (this.tableSize === 'all') return this.filteredParties.length;
    return Math.min(this.page * this.itemsPerPageCount, this.filteredParties.length);
  }

  get itemsPerPageCount(): number {
    return this.tableSize === 'all'
      ? this.filteredParties.length || 10
      : Number(this.tableSize);
  }

  ngOnInit(): void {
    combineLatest([this.erpService.sellers$, this.erpService.buyers$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([sellers, buyers]) => {
        this.processParties(sellers, buyers);
      });

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (params['action'] === 'add') {
          this.openAddModal();
        }
      });
  }

  private processParties(sellers: SellerRecord[], buyers: BuyerRecord[]): void {
    const map = new Map<string, UnifiedParty>();

    for (const s of sellers) {
      map.set(s.name.trim().toLowerCase(), {
        id: s.id,
        name: s.name,
        role: 'Seller',
        phone: s.phone || '',
        email: s.email || '',
        defaultCreditDays: s.defaultCreditDays ?? null,
        isActive: s.isActive,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      });
    }

    for (const b of buyers) {
      const key = b.name.trim().toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          id: b.id,
          name: b.name,
          role: 'Buyer',
          phone: b.phone || '',
          email: b.email || '',
          defaultCreditDays: b.defaultCreditDays ?? null,
          isActive: b.isActive,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
        });
      }
    }

    // Sort alphabetically by name
    const list = Array.from(map.values());
    list.sort((a, b) => a.name.localeCompare(b.name));

    this.allParties = list;
    this.updateKPIs();
    this.applyFilters();
  }

  private updateKPIs(): void {
    this.totalPartiesCount = this.allParties.length;
    this.activePartiesCount = this.allParties.filter((p) => p.isActive).length;
    this.creditPartiesCount = this.allParties.filter(
      (p) => p.isActive && p.defaultCreditDays !== null && p.defaultCreditDays > 0,
    ).length;
    this.inactivePartiesCount = this.allParties.filter((p) => !p.isActive).length;
  }

  // ── Filters & Search ──

  setStatusFilter(status: 'All' | 'Active' | 'Inactive'): void {
    this.statusFilter = status;
    this.page = 1;
    this.applyFilters();
  }

  onSearch(): void {
    this.appliedSearchTerm = this.searchTerm.trim();
    this.page = 1;
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.appliedSearchTerm = '';
    this.statusFilter = 'All';
    this.page = 1;
    this.applyFilters();
  }

  onTableSizeChange(): void {
    this.page = 1;
  }

  onTableDataChange(event: number): void {
    this.page = event;
  }

  private applyFilters(): void {
    let result = [...this.allParties];

    // Status filter
    if (this.statusFilter === 'Active') {
      result = result.filter((p) => p.isActive);
    } else if (this.statusFilter === 'Inactive') {
      result = result.filter((p) => !p.isActive);
    }

    // Search filter
    if (this.appliedSearchTerm) {
      const q = this.appliedSearchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.phone.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q),
      );
    }

    this.filteredParties = result;
    this.showReset =
      Boolean(this.appliedSearchTerm) ||
      this.statusFilter !== 'All';
  }

  // ── Modals & Actions ──

  openAddModal(): void {
    this.modalError = '';
    this.partyForm = {
      name: '',
      phone: '',
      email: '',
      defaultCreditDays: 15,
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.modalError = '';
  }

  submitAddParty(): void {
    this.modalError = '';
    const name = (this.partyForm.name || '').trim();
    if (name.length < 2) {
      this.modalError = 'Party name must be at least 2 characters.';
      return;
    }

    const phone = (this.partyForm.phone || '').trim();
    const email = (this.partyForm.email || '').trim();
    const creditDays = this.partyForm.defaultCreditDays;

    const resSeller = this.erpService.createSeller(name, phone, email, creditDays);
    const resBuyer = this.erpService.createBuyer(name, phone, email, creditDays);

    if (!resSeller.ok && !resBuyer.ok) {
      this.modalError = resSeller.message || resBuyer.message;
      return;
    }

    this.closeAddModal();
    this.notificationService.show(`Party "${name}" added successfully.`, 'success', 3000);
  }

  openEditModal(party: UnifiedParty): void {
    this.modalError = '';
    this.editForm = {
      id: party.id,
      name: party.name,
      phone: party.phone,
      email: party.email,
      defaultCreditDays: party.defaultCreditDays,
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.modalError = '';
  }

  submitEditParty(): void {
    this.modalError = '';
    const name = (this.editForm.name || '').trim();
    if (name.length < 2) {
      this.modalError = 'Party name must be at least 2 characters.';
      return;
    }

    const phone = (this.editForm.phone || '').trim();
    const email = (this.editForm.email || '').trim();
    const creditDays = this.editForm.defaultCreditDays;

    if (this.editForm.id.startsWith('SEL-')) {
      this.erpService.updateSeller(this.editForm.id, name, phone, email, creditDays);
    } else if (this.editForm.id.startsWith('BUY-')) {
      this.erpService.updateBuyer(this.editForm.id, name, phone, email, creditDays);
    } else {
      this.erpService.updateSeller(this.editForm.id, name, phone, email, creditDays);
      this.erpService.updateBuyer(this.editForm.id, name, phone, email, creditDays);
    }

    this.closeEditModal();
    this.notificationService.show(
      `Party "${name}" updated successfully.`,
      'success',
      3000,
    );
  }

  openViewModal(party: UnifiedParty): void {
    this.selectedParty = party;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.selectedParty = null;
    this.showViewModal = false;
  }

  // ── Active / Inactive Status Toggle ──

  openToggleModal(party: UnifiedParty): void {
    this.partyToToggle = party;
    this.showToggleModal = true;
  }

  closeToggleModal(): void {
    this.partyToToggle = null;
    this.showToggleModal = false;
  }

  confirmStatusToggle(): void {
    if (!this.partyToToggle) return;

    const party = this.partyToToggle;
    const res =
      party.role === 'Seller'
        ? this.erpService.toggleSellerStatus(party.id)
        : this.erpService.toggleBuyerStatus(party.id);

    this.closeToggleModal();

    if (res.ok) {
      this.notificationService.show(res.message, 'success', 3000);
    } else {
      this.notificationService.show(res.message, 'error', 3500);
    }
  }

  quickToggleStatus(party: UnifiedParty): void {
    const res =
      party.role === 'Seller'
        ? this.erpService.toggleSellerStatus(party.id)
        : this.erpService.toggleBuyerStatus(party.id);

    if (res.ok) {
      this.notificationService.show(res.message, 'success', 3000);
    } else {
      this.notificationService.show(res.message, 'error', 3500);
    }
  }

  viewPartyStatement(party: UnifiedParty): void {
    this.router.navigate(['/admin/party-ledger'], {
      queryParams: { party: party.name },
    });
  }
}
