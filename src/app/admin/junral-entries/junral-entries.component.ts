import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  SaudaErpMockService,
  JournalEntryRecord,
  InvoiceRecord,
  SaudaRecord,
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
  saudas: SaudaRecord[] = [];
  allInvoices: InvoiceRecord[] = [];
  pendingInvoices: InvoiceRecord[] = [];
  allBuyers: string[] = [];
  allSellers: string[] = [];

  // Filter toggle in form: SHOW PENDING AMOUNT INVOICE ONLY
  showPendingOnly = true;

  // Selected Sauda & Invoice
  selectedSaudaNo = '';
  selectedSauda: SaudaRecord | null = null;
  selectedInvoice: InvoiceRecord | null = null;

  // Form Model matching client sheet
  form = {
    entryDate: new Date().toISOString().slice(0, 10),
    saudaNo: '',
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
    otherDetails: '',
    narration: '',
  };

  // Detailed Row Calculation State (Qty in Ton, Rate user input - not prefilled)
  // 1. Dharam Kanta: Qty (Ton) * 500gm * Rate = Amount
  dkQtyTon = 0;
  dkRate: number | null = null;

  // 2. Mudat: Qty (Ton) * 5% * Rate = Amount
  mudatQtyTon = 0;
  mudatRate: number | null = null;

  // 3. Labour: Qty (Ton) * 12/15 = Amount
  labourQtyTon = 0;
  labourRate = 12;

  // 4. Claim: manual
  claimRemarks = '';

  // 5. Brokerage: Qty (Ton) * 7/10 = Amount
  brokerageQtyTon = 0;
  brokerageRate = 7;

  // 6. Interest: manual
  interestRemarks = '';

  // 7. Warehouse Rent: manual
  warehouseRentRemarks = '';

  // 8. TDS: manual
  tdsRemarks = '';

  // 9. Other: Details -> Amount
  otherDetails = '';

  // Search & Pagination in table
  searchTerm = '';
  page = 1;
  pageSize = 10;

  // View modal
  selectedEntryForView: JournalEntryRecord | null = null;
  showViewModal = false;

  get totalAdjustments(): number {
    return Number((
      Number(this.form.dharamKanta || 0) +
      Number(this.form.mudat || 0) +
      Number(this.form.labour || 0) +
      Number(this.form.claim || 0) +
      Number(this.form.brokerage || 0) +
      Number(this.form.interest || 0) +
      Number(this.form.warehouseRent || 0) +
      Number(this.form.tds || 0) +
      Number(this.form.other || 0)
    ).toFixed(2));
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

    // 2. Subscribe to saudas
    this.erpService.saudas$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((saudaList) => {
        this.saudas = saudaList;
      });

    // 3. Subscribe to invoices
    this.erpService.invoices$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((invs) => {
        this.allInvoices = invs;
        this.pendingInvoices = invs.filter((inv) => inv.status !== 'Paid');
        this.updateInvoiceSelection();
      });

    // 4. Subscribe to buyers and sellers
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

  onSaudaSelect(): void {
    if (!this.selectedSaudaNo) {
      this.selectedSauda = null;
      return;
    }

    const s = this.saudas.find((item) => item.saudaNo === this.selectedSaudaNo);
    if (!s) {
      this.selectedSauda = null;
      return;
    }

    this.selectedSauda = s;
    this.form.saudaNo = s.saudaNo;

    // Flow Requirement: Purchase, Sale, Brokerage ke hisab se buyer ya seller ka name aayega
    if (s.saudaType === 'Purchase') {
      this.form.seller = s.sellerName || s.partyName || '';
      this.form.buyer = s.clientFirm || 'Desert Fresh Traders';
    } else if (s.saudaType === 'Sales') {
      this.form.buyer = s.buyerName || s.partyName || '';
      this.form.seller = s.clientFirm || 'Desert Fresh Traders';
    } else if (s.saudaType === 'Brokerage') {
      this.form.seller = s.sellerName || '';
      this.form.buyer = s.buyerName || '';
    } else {
      // Forward / other
      this.form.seller = s.sellerName || s.partyName || '';
      this.form.buyer = s.buyerName || s.clientFirm || 'Desert Fresh Traders';
    }

    // Quantity means kitne ton maal tha (Ton auto-fill)
    const qtyTon = Number(s.quantityMt || 0);

    // 1. Dharam Kanta: quantity auto fill * 500gm readable * rate user input (prefilled ni hogi)
    this.dkQtyTon = qtyTon;
    this.dkRate = null;
    this.calcDharamKanta();

    // 2. Mudat: qty * 5% readable * rate user input (prefilled ni hogi)
    this.mudatQtyTon = qtyTon;
    this.mudatRate = null;
    this.calcMudat();

    // 3. Labour: Qty * 12/15 rate koi bhi ek select kre
    this.labourQtyTon = qtyTon;
    this.labourRate = 12;
    this.calcLabour();

    // 5. Brokerage: qty * 7/10
    this.brokerageQtyTon = qtyTon;
    this.brokerageRate = 7;
    this.calcBrokerage();

    // Check linked invoice
    if (s.invoiceNo) {
      this.form.invoiceNo = s.invoiceNo;
      this.onInvoiceSelect();
    } else {
      const party = this.form.buyer || this.form.seller;
      const match = this.eligibleInvoices.find(
        (inv) => inv.partyName.toLowerCase() === party.toLowerCase(),
      );
      if (match) {
        this.form.invoiceNo = match.invoiceNo;
        this.onInvoiceSelect();
      }
    }

    if (!this.form.narration) {
      this.form.narration = `Journal adjustment for Sauda ${s.saudaNo} (${s.saudaType}) - ${s.commodity || 'Commodity'}`;
    }
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

  // ── Calculation Handlers ────────────────────────────────────────────────
  calcDharamKanta(): void {
    const qty = Number(this.dkQtyTon || 0);
    const rate = Number(this.dkRate || 0);
    this.form.dharamKanta = Math.round(qty * 0.5 * rate);
  }

  calcMudat(): void {
    const qty = Number(this.mudatQtyTon || 0);
    const rate = Number(this.mudatRate || 0);
    this.form.mudat = Number((qty * rate * 0.05).toFixed(2));
  }

  calcLabour(): void {
    const qty = Number(this.labourQtyTon || 0);
    const rate = Number(this.labourRate || 0);
    this.form.labour = Math.round(qty * rate);
  }

  setLabourRate(rate: number): void {
    this.labourRate = rate;
    this.calcLabour();
  }

  calcBrokerage(): void {
    const qty = Number(this.brokerageQtyTon || 0);
    const rate = Number(this.brokerageRate || 0);
    this.form.brokerage = Math.round(qty * rate);
  }

  setBrokerageRate(rate: number): void {
    this.brokerageRate = rate;
    this.calcBrokerage();
  }

  saveJournalEntry(): void {
    if (!this.form.invoiceNo && !this.form.buyer && !this.form.seller && !this.form.saudaNo) {
      this.notificationService.show(
        'Please select a Sauda or Invoice to record journal adjustments.',
        'error',
        3500,
      );
      return;
    }

    if (this.totalAdjustments <= 0) {
      this.notificationService.show(
        'Please enter or calculate at least one deduction/adjustment amount.',
        'error',
        3500,
      );
      return;
    }

    const payload = {
      entryDate: this.form.entryDate,
      saudaNo: this.selectedSauda?.saudaNo || this.form.saudaNo || undefined,
      buyerName: this.form.buyer || '—',
      sellerName: this.form.seller || '—',
      invoiceNo: this.form.invoiceNo || (this.selectedSauda ? `SAU-${this.selectedSauda.saudaNo}` : 'DIRECT-JV'),
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
      otherDetails: this.otherDetails || undefined,
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
    this.selectedSaudaNo = '';
    this.selectedSauda = null;
    this.selectedInvoice = null;

    this.form = {
      entryDate: new Date().toISOString().slice(0, 10),
      saudaNo: '',
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
      otherDetails: '',
      narration: '',
    };

    this.dkQtyTon = 0;
    this.dkRate = null;

    this.mudatQtyTon = 0;
    this.mudatRate = null;

    this.labourQtyTon = 0;
    this.labourRate = 12;

    this.claimRemarks = '';

    this.brokerageQtyTon = 0;
    this.brokerageRate = 7;

    this.interestRemarks = '';
    this.warehouseRentRemarks = '';
    this.tdsRemarks = '';
    this.otherDetails = '';
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
          (e.saudaNo && e.saudaNo.toLowerCase().includes(term)) ||
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
