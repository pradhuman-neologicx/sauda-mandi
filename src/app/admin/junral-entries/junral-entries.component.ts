import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  SaudaErpMockService,
  JournalEntryRecord,
  InvoiceRecord,
} from '../../core/services/sauda-erp-mock.service';
import { NotificationService } from '../../core/services/notificationnew.service';

@Component({
  selector: 'app-junral-entries',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './junral-entries.component.html',
  styleUrl: './junral-entries.component.scss',
})
export class JunralEntriesComponent implements OnInit {
  private erpService = inject(SaudaErpMockService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  // View state: 'list' or 'create'
  viewMode: 'list' | 'create' = 'create';

  // Data
  journalEntries: JournalEntryRecord[] = [];
  filteredEntries: JournalEntryRecord[] = [];
  allInvoices: InvoiceRecord[] = [];
  pendingInvoices: InvoiceRecord[] = [];
  allBuyers: string[] = [];
  allSellers: string[] = [];

  // Filter toggle in form: SHOW PENDING AMOUNT INVOICE ONLY
  showPendingOnly = true;

  // Selected Invoice for active form
  selectedInvoice: InvoiceRecord | null = null;

  // Form Model matching client sheet
  form = {
    entryDate: new Date().toISOString().slice(0, 10),
    buyer: '',
    seller: '',
    invoiceNo: '',
    dharamKanta: 0,
    mudat: 0,
    labour: 0,
    claim: 0,
    brokerage: 0,
    interest: 0,
    warehouseRent: 0,
    tds: 0,
    other: 0,
    narration: '',
  };

  // Search & Pagination in table
  searchTerm = '';
  page = 1;
  pageSize = 10;

  // View modal
  selectedEntryForView: JournalEntryRecord | null = null;
  showViewModal = false;

  get totalAdjustments(): number {
    return (
      Number(this.form.dharamKanta || 0) +
      Number(this.form.mudat || 0) +
      Number(this.form.labour || 0) +
      Number(this.form.claim || 0) +
      Number(this.form.brokerage || 0) +
      Number(this.form.interest || 0) +
      Number(this.form.warehouseRent || 0) +
      Number(this.form.tds || 0) +
      Number(this.form.other || 0)
    );
  }

  get invoicePendingAmount(): number {
    return this.selectedInvoice ? this.selectedInvoice.finalAmount : 0;
  }

  get netPendingAfterAdjustment(): number {
    return Math.max(0, this.invoicePendingAmount - this.totalAdjustments);
  }

  ngOnInit(): void {
    // 1. Subscribe to journal entries
    this.erpService.journalEntries$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((entries) => {
        this.journalEntries = entries;
        this.applyFilter();
      });

    // 2. Subscribe to invoices
    this.erpService.invoices$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((invs) => {
        this.allInvoices = invs;
        this.pendingInvoices = invs.filter((inv) => inv.status !== 'Paid');
        this.updateInvoiceSelection();
      });

    // 3. Subscribe to buyers and sellers
    this.erpService.buyers$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((buyers) => {
        this.allBuyers = buyers.map((b) => b.name);
      });

    this.erpService.sellers$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((sellers) => {
        this.allSellers = sellers.map((s) => s.name);
      });
  }

  get eligibleInvoices(): InvoiceRecord[] {
    return this.showPendingOnly ? this.pendingInvoices : this.allInvoices;
  }

  onInvoiceSelect(): void {
    if (!this.form.invoiceNo) {
      this.selectedInvoice = null;
      return;
    }
    const cleanNo = this.form.invoiceNo.trim().toLowerCase();
    const inv = this.allInvoices.find(
      (i) => i.invoiceNo.trim().toLowerCase() === cleanNo,
    );
    if (inv) {
      this.selectedInvoice = inv;
      if (inv.partyRole === 'Buyer') {
        if (!this.form.buyer) this.form.buyer = inv.partyName;
      } else {
        if (!this.form.seller) this.form.seller = inv.partyName;
      }
    } else {
      this.selectedInvoice = null;
    }
  }

  private updateInvoiceSelection(): void {
    if (this.form.invoiceNo) {
      this.selectedInvoice =
        this.allInvoices.find((i) => i.invoiceNo === this.form.invoiceNo) || null;
    }
  }

  saveJournalEntry(): void {
    if (!this.form.invoiceNo && !this.form.buyer && !this.form.seller) {
      this.notificationService.show(
        'Please select at least an Invoice or Buyer / Seller party.',
        'error',
        3500,
      );
      return;
    }

    if (this.totalAdjustments <= 0) {
      this.notificationService.show(
        'Please enter at least one deduction/adjustment amount (Dharam Kanta, Mudat, Labour, Claim, Brokerage, etc.).',
        'error',
        3500,
      );
      return;
    }

    const payload = {
      entryDate: this.form.entryDate,
      buyerName: this.form.buyer || '—',
      sellerName: this.form.seller || '—',
      invoiceNo: this.form.invoiceNo || 'DIRECT-JV',
      invoiceId: this.selectedInvoice?.id,
      originalInvoicePendingAmount: this.invoicePendingAmount,
      dharamKanta: Number(this.form.dharamKanta || 0),
      mudat: Number(this.form.mudat || 0),
      labour: Number(this.form.labour || 0),
      claim: Number(this.form.claim || 0),
      brokerage: Number(this.form.brokerage || 0),
      interest: Number(this.form.interest || 0),
      warehouseRent: Number(this.form.warehouseRent || 0),
      tds: Number(this.form.tds || 0),
      other: Number(this.form.other || 0),
      totalAdjustments: this.totalAdjustments,
      netPendingAmountAfter: this.netPendingAfterAdjustment,
      narration: this.form.narration.trim() || 'Journal Entry Adjustment',
      recordedBy: 'Sauda Admin',
    };

    const res = this.erpService.createJournalEntry(payload);
    if (res.ok) {
      this.notificationService.show(res.message, 'success', 4000);
      this.resetForm();
      this.viewMode = 'list';
    } else {
      this.notificationService.show(res.message, 'error', 3500);
    }
  }

  resetForm(): void {
    this.form = {
      entryDate: new Date().toISOString().slice(0, 10),
      buyer: '',
      seller: '',
      invoiceNo: '',
      dharamKanta: 0,
      mudat: 0,
      labour: 0,
      claim: 0,
      brokerage: 0,
      interest: 0,
      warehouseRent: 0,
      tds: 0,
      other: 0,
      narration: '',
    };
    this.selectedInvoice = null;
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredEntries = [...this.journalEntries];
    } else {
      this.filteredEntries = this.journalEntries.filter(
        (e) =>
          e.voucherNo.toLowerCase().includes(term) ||
          e.invoiceNo.toLowerCase().includes(term) ||
          e.buyerName.toLowerCase().includes(term) ||
          e.sellerName.toLowerCase().includes(term) ||
          e.narration.toLowerCase().includes(term),
      );
    }
    this.page = 1;
  }

  openViewModal(entry: JournalEntryRecord): void {
    this.selectedEntryForView = entry;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.selectedEntryForView = null;
    this.showViewModal = false;
  }

  printVoucher(): void {
    window.print();
  }
}
