import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  SaudaErpMockService,
  PaymentEntryRecord,
} from '../../core/services/sauda-erp-mock.service';
import { NotificationService } from '../../core/services/notificationnew.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss',
})
export class PaymentsComponent implements OnInit {
  private erpService = inject(SaudaErpMockService);
  private notificationService = inject(NotificationService);
  private destroyRef = inject(DestroyRef);

  // View state
  showCreateForm = false;
  showExcelUploadModal = false;
  showReportFilterModal = false;

  // Payments list
  paymentEntries: PaymentEntryRecord[] = [];
  filteredEntries: PaymentEntryRecord[] = [];

  // Standard Bank & Cash Accounts
  allAccounts: string[] = [
    'State Bank of India (Mandi Main Branch)',
    'HDFC Bank (Current A/c - 502000)',
    'ICICI Bank (Grain Trading A/c)',
    'Punjab National Bank (Mandi Branch)',
    'Cash in Hand (Mandi Petty Cash)',
    'City Wholesale Market (Customer Ledger)',
    'Sharma Grain Traders (Supplier Ledger)',
    'Om Traders (Supplier Ledger)',
    'Marwar Agro Retailers (Customer Ledger)',
  ];

  // Manual Entry Form matching client sheet: PAYMENT ENTERY
  entryForm = {
    date: new Date().toISOString().slice(0, 10),
    voucherDetails: '',
    received: null as number | null,
    payment: null as number | null,
    account: '',
    narration: '',
  };

  // Filters & Search
  searchTerm = '';
  selectedAccountFilter = 'All';
  startDateFilter = '';
  endDateFilter = '';

  // Pagination
  page = 1;
  pageSize = 10;

  // Excel Upload state
  selectedFile: File | null = null;
  excelParsedRows: Array<{
    date: string;
    voucherDetails: string;
    received: number;
    payment: number;
    account: string;
    narration: string;
  }> = [];

  get currentClosingBalance(): number {
    return this.paymentEntries.length > 0
      ? this.paymentEntries[this.paymentEntries.length - 1].balanceAfter
      : 0;
  }

  get projectedNewBalance(): number {
    const prev = this.currentClosingBalance;
    const recv = Number(this.entryForm.received || 0);
    const pay = Number(this.entryForm.payment || 0);
    return Number((prev + recv - pay).toFixed(2));
  }

  get totalReceivedSum(): number {
    return this.filteredEntries.reduce((sum, e) => sum + Number(e.receivedAmount || 0), 0);
  }

  get totalPaymentSum(): number {
    return this.filteredEntries.reduce((sum, e) => sum + Number(e.paymentAmount || 0), 0);
  }

  ngOnInit(): void {
    this.erpService.paymentEntries$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((entries) => {
        this.paymentEntries = entries;
        this.applyFilters();
      });
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();
    const acct = this.selectedAccountFilter;
    const start = this.startDateFilter;
    const end = this.endDateFilter;

    this.filteredEntries = this.paymentEntries.filter((e) => {
      const matchSearch =
        !term ||
        e.voucherDetails.toLowerCase().includes(term) ||
        e.accountName.toLowerCase().includes(term) ||
        e.narration.toLowerCase().includes(term) ||
        (e.partyName && e.partyName.toLowerCase().includes(term));

      const matchAccount = acct === 'All' || e.accountName === acct;
      const matchStart = !start || e.entryDate >= start;
      const matchEnd = !end || e.entryDate <= end;

      return matchSearch && matchAccount && matchStart && matchEnd;
    });

    this.page = 1;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedAccountFilter = 'All';
    this.startDateFilter = '';
    this.endDateFilter = '';
    this.applyFilters();
  }

  savePaymentEntry(): void {
    if (!this.entryForm.voucherDetails.trim()) {
      this.notificationService.show('Voucher Details (Ref # / Cheque # / UTR #) is required.', 'error', 3500);
      return;
    }

    if (!this.entryForm.account) {
      this.notificationService.show('Please select or enter the A/C (Account).', 'error', 3500);
      return;
    }

    const recv = Number(this.entryForm.received || 0);
    const pay = Number(this.entryForm.payment || 0);

    if (recv <= 0 && pay <= 0) {
      this.notificationService.show('Please enter either a Received amount or Payment amount.', 'error', 3500);
      return;
    }

    const res = this.erpService.createPaymentEntry({
      entryDate: this.entryForm.date,
      voucherDetails: this.entryForm.voucherDetails.trim().toUpperCase(),
      receivedAmount: recv,
      paymentAmount: pay,
      accountName: this.entryForm.account,
      narration: this.entryForm.narration.trim() || 'Payment Entry',
      recordedBy: 'Sauda Admin',
    });

    if (res.ok) {
      this.notificationService.show(res.message, 'success', 3500);
      this.resetEntryForm();
      this.showCreateForm = false;
    } else {
      this.notificationService.show(res.message, 'error', 3500);
    }
  }

  resetEntryForm(): void {
    this.entryForm = {
      date: new Date().toISOString().slice(0, 10),
      voucherDetails: '',
      received: null,
      payment: null,
      account: '',
      narration: '',
    };
  }

  // ==========================================
  // EXCEL UPLOAD WORKFLOW (UPLOAD EXCEL)
  // ==========================================
  openExcelUploadModal(): void {
    this.selectedFile = null;
    this.excelParsedRows = [];
    this.showExcelUploadModal = true;
  }

  closeExcelUploadModal(): void {
    this.showExcelUploadModal = false;
    this.selectedFile = null;
    this.excelParsedRows = [];
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    this.selectedFile = file;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const text: string = e.target.result;
      this.parseCsvOrText(text);
    };

    reader.readAsText(file);
  }

  private parseCsvOrText(content: string): void {
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length <= 1) {
      this.notificationService.show('Uploaded file is empty or missing data rows.', 'error', 3500);
      return;
    }

    const rows: typeof this.excelParsedRows = [];
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length >= 4) {
        rows.push({
          date: parts[0] || new Date().toISOString().slice(0, 10),
          voucherDetails: parts[1] || `IMP-VCH-${i}`,
          received: Number(parts[2] || 0),
          payment: Number(parts[3] || 0),
          account: parts[4] || 'State Bank of India (Mandi Main Branch)',
          narration: parts[5] || 'Imported via Excel Batch',
        });
      }
    }

    this.excelParsedRows = rows;
  }

  confirmExcelImport(): void {
    if (this.excelParsedRows.length === 0) {
      this.notificationService.show('No valid rows found to import.', 'error', 3500);
      return;
    }

    const mapped = this.excelParsedRows.map((r) => ({
      entryDate: r.date,
      voucherDetails: r.voucherDetails.toUpperCase(),
      receivedAmount: r.received,
      paymentAmount: r.payment,
      accountName: r.account,
      narration: r.narration,
      recordedBy: 'Excel Bulk Import',
    }));

    const res = this.erpService.importPaymentEntries(mapped);
    this.notificationService.show(res.message, 'success', 4000);
    this.closeExcelUploadModal();
  }

  downloadSampleExcel(): void {
    const headers = 'DATE,VOUCHER DETAILS,RECEIVED,PAYMENT,A/C,NARRATION\n';
    const sampleRows = [
      '2026-11-20,UTR-SBI-991201,150000,0,State Bank of India (Mandi Main Branch),Payment received from customer\n',
      '2026-11-21,CHQ-445890,0,85000,Sharma Grain Traders,Supplier payment against Bajra lot\n',
      '2026-11-22,CASH-PAY-0044,0,5000,Cash in Hand (Mandi Petty Cash),Loading labour hamali paid\n',
    ].join('');

    const blob = new Blob([headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Payment_Entry_Sample_Template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ==========================================
  // REPORT GENERATION (Report generation outside)
  // ==========================================
  exportReportToCsv(): void {
    let csv = 'DATE,VOUCHER DETAILS,ACCOUNT (A/C),RECEIVED (₹),PAYMENT (₹),AUTOMATIC BALANCE (₹),NARRATION\n';

    for (const e of this.filteredEntries) {
      csv += `"${e.entryDate}","${e.voucherDetails}","${e.accountName}",${e.receivedAmount || 0},${e.paymentAmount || 0},${e.balanceAfter || 0},"${e.narration || ''}"\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Payment_Entries_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    this.notificationService.show('Report generated and downloaded successfully.', 'success', 3000);
  }

 
}
