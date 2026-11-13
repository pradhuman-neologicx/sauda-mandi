import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { combineLatest } from 'rxjs';
import {
  BuyerRecord,
  FirmRecord,
  LedgerSettlementRecord,
  PaymentMode,
  SaudaErpMockService,
  SaudaRecord,
  SellerRecord,
} from 'src/app/core/services/sauda-erp-mock.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

export interface PartyStatementEntry {
  id: string;
  date: string;
  referenceNo: string;
  clientFirm: string;
  entryType: string;
  paymentMode: string;
  dueDate: string;
  isOverdue: boolean;
  payableAmountInr: number; // Purchase / Payable added
  paidAmountInr: number; // Paid to seller
  receivableAmountInr: number; // Sales / Receivable added
  receivedAmountInr: number; // Received from buyer
  runningNetInr: number; // + = Receivable, - = Payable
  remarks: string;
}

export interface PartyLedgerSummary {
  partyKey: string;
  partyName: string;
  partyRole: 'Seller' | 'Buyer' | 'Both';
  phone: string;
  email: string;
  sellerId?: string;
  buyerId?: string;
  defaultCreditDays: number | null;
  totalPayableInr: number;
  totalPaidInr: number;
  pendingPayableInr: number;
  totalReceivableInr: number;
  totalReceivedInr: number;
  pendingReceivableInr: number;
  netBalanceInr: number; // + = Receivable, - = Payable
  overduePayableCount: number;
  overdueReceivableCount: number;
  lastTxnDate: string;
  txnCount: number;
  statement: PartyStatementEntry[];
}

export interface AllTransactionRow {
  id: string;
  date: string;
  partyName: string;
  partyRole: 'Seller' | 'Buyer';
  clientFirm: string;
  referenceNo: string;
  entryType: string;
  modeOrCredit: string;
  payableEffectInr: number;
  receivableEffectInr: number;
  amountInr: number;
  flowLabel: 'Payable (+)' | 'Paid (-)' | 'Receivable (+)' | 'Received (-)';
  remarks: string;
}

@Component({
  selector: 'app-party-ledger',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyPipe,
    DecimalPipe,
    NgxPaginationModule,
  ],
  templateUrl: './party-ledger.component.html',
  styleUrl: './party-ledger.component.scss',
})
export class PartyLedgerComponent implements OnInit {
  private readonly erp = inject(SaudaErpMockService);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  saudas: SaudaRecord[] = [];
  sellers: SellerRecord[] = [];
  buyers: BuyerRecord[] = [];
  firms: FirmRecord[] = [];
  settlements: LedgerSettlementRecord[] = [];

  allPartySummaries: PartyLedgerSummary[] = [];
  filteredSummaries: PartyLedgerSummary[] = [];
  allTransactions: AllTransactionRow[] = [];
  filteredTransactions: AllTransactionRow[] = [];

  viewTab: 'parties' | 'transactions' = 'parties';
  selectedStatementParty: PartyLedgerSummary | null = null;

  // Filters
  searchTerm = '';
  appliedSearchTerm = '';
  roleFilter: 'All' | 'Seller' | 'Buyer' = 'All';
  balanceFilter: 'All' | 'Payable Pending' | 'Receivable Pending' | 'Settled' =
    'All';
  firmFilter = 'All';
  showReset = false;

  // Pagination
  page = 1;
  txnPage = 1;
  tableSize: number | 'all' = 10;
  readonly tableSizes: Array<number | 'all'> = [10, 25, 50, 'all'];

  readonly paymentModes: PaymentMode[] = [
    'RTGS / NEFT',
    'Cheque',
    'UPI',
    'Cash',
    'Adjustment',
  ];

  // Record Payment / Receipt Modal
  showPaymentModal = false;
  paymentError = '';
  paymentForm: {
    date: string;
    partyName: string;
    partyRole: 'Seller' | 'Buyer';
    clientFirm: string;
    entryKind: 'Payment Paid' | 'Payment Received' | 'Rebate / Adjustment';
    ledgerSide: 'Payable' | 'Receivable';
    amountInr: number | null;
    paymentMode: PaymentMode;
    referenceNo: string;
    saudaNo: string;
    remarks: string;
  } = {
    date: new Date().toISOString().slice(0, 10),
    partyName: '',
    partyRole: 'Seller',
    clientFirm: '',
    entryKind: 'Payment Paid',
    ledgerSide: 'Payable',
    amountInr: null,
    paymentMode: 'RTGS / NEFT',
    referenceNo: '',
    saudaNo: '',
    remarks: '',
  };

  // Add Party Modal (since Masters was removed)
  showAddPartyModal = false;
  partyError = '';
  newPartyForm: {
    role: 'Seller' | 'Buyer';
    name: string;
    phone: string;
    email: string;
    defaultCreditDays: number | null;
  } = {
    role: 'Seller',
    name: '',
    phone: '',
    email: '',
    defaultCreditDays: 15,
  };

  // Edit Party Modal
  showEditPartyModal = false;
  editPartyError = '';
  editPartyForm: {
    sellerId?: string;
    buyerId?: string;
    role: 'Seller' | 'Buyer' | 'Both';
    name: string;
    phone: string;
    email: string;
    defaultCreditDays: number | null;
  } = {
    role: 'Seller',
    name: '',
    phone: '',
    email: '',
    defaultCreditDays: 15,
  };

  ngOnInit(): void {
    combineLatest([
      this.erp.saudas$,
      this.erp.sellers$,
      this.erp.buyers$,
      this.erp.firms$,
      this.erp.ledgerSettlements$,
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([saudas, sellers, buyers, firms, settlements]) => {
        this.saudas = saudas;
        this.sellers = sellers;
        this.buyers = buyers;
        this.firms = firms.filter((f) => f.isActive);
        this.settlements = settlements;
        this.rebuildLedgerData();
      });
  }

  // ── KPI Totals ──

  get totalPendingPayableInr(): number {
    return this.allPartySummaries.reduce((s, p) => s + p.pendingPayableInr, 0);
  }

  get totalPayableInr(): number {
    return this.allPartySummaries.reduce((s, p) => s + p.totalPayableInr, 0);
  }

  get totalPaidInr(): number {
    return this.allPartySummaries.reduce((s, p) => s + p.totalPaidInr, 0);
  }

  get totalPendingReceivableInr(): number {
    return this.allPartySummaries.reduce(
      (s, p) => s + p.pendingReceivableInr,
      0,
    );
  }

  get totalReceivableInr(): number {
    return this.allPartySummaries.reduce((s, p) => s + p.totalReceivableInr, 0);
  }

  get totalReceivedInr(): number {
    return this.allPartySummaries.reduce((s, p) => s + p.totalReceivedInr, 0);
  }

  get netOverallPositionInr(): number {
    return this.totalPendingReceivableInr - this.totalPendingPayableInr;
  }

  get payablePartiesCount(): number {
    return this.allPartySummaries.filter((p) => p.pendingPayableInr > 0).length;
  }

  get receivablePartiesCount(): number {
    return this.allPartySummaries.filter((p) => p.pendingReceivableInr > 0)
      .length;
  }

  get pageSize(): number {
    if (this.viewTab === 'transactions') {
      return this.tableSize === 'all'
        ? Math.max(this.filteredTransactions.length, 1)
        : this.tableSize;
    }
    return this.tableSize === 'all'
      ? Math.max(this.filteredSummaries.length, 1)
      : this.tableSize;
  }

  get partyDropdownOptions(): Array<{ name: string; role: 'Seller' | 'Buyer' }> {
    const map = new Map<string, { name: string; role: 'Seller' | 'Buyer' }>();
    for (const s of this.sellers) {
      if (s.isActive) {
        map.set(s.name.toLowerCase(), { name: s.name, role: 'Seller' });
      }
    }
    for (const b of this.buyers) {
      if (b.isActive && !map.has(b.name.toLowerCase())) {
        map.set(b.name.toLowerCase(), { name: b.name, role: 'Buyer' });
      }
    }
    for (const p of this.allPartySummaries) {
      if (!map.has(p.partyKey)) {
        map.set(p.partyKey, {
          name: p.partyName,
          role: p.partyRole === 'Buyer' ? 'Buyer' : 'Seller',
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  get saudaOptionsForPayment(): SaudaRecord[] {
    const pName = (this.paymentForm.partyName || '').trim().toLowerCase();
    return this.saudas.filter((s) => {
      if (s.status === 'Voided') return false;
      if (!pName) return true;
      return (
        s.sellerName.toLowerCase() === pName ||
        s.buyerName.toLowerCase() === pName
      );
    });
  }

  // ── Ledger Computation ──

  private rebuildLedgerData(): void {
    const today = new Date().toISOString().slice(0, 10);
    const firmFilter = this.firmFilter;

    interface PartyAcc {
      partyKey: string;
      partyName: string;
      sellerId?: string;
      buyerId?: string;
      hasSeller: boolean;
      hasBuyer: boolean;
      phone: string;
      email: string;
      defaultCreditDays: number | null;
      totalPayableInr: number;
      totalPaidInr: number;
      totalReceivableInr: number;
      totalReceivedInr: number;
      overduePayableCount: number;
      overdueReceivableCount: number;
      rawEntries: Array<{
        sortDate: string;
        id: string;
        date: string;
        referenceNo: string;
        clientFirm: string;
        entryType: string;
        paymentMode: string;
        dueDate: string;
        isOverdue: boolean;
        payableAmountInr: number;
        paidAmountInr: number;
        receivableAmountInr: number;
        receivedAmountInr: number;
        remarks: string;
      }>;
    }

    const accMap = new Map<string, PartyAcc>();

    const ensureAcc = (
      name: string,
      roleHint?: 'Seller' | 'Buyer',
      phone = '',
      email = '',
      creditDays: number | null = null,
    ): PartyAcc => {
      const clean = name.trim();
      const key = clean.toLowerCase();
      let acc = accMap.get(key);
      if (!acc) {
        acc = {
          partyKey: key,
          partyName: clean,
          hasSeller: roleHint === 'Seller',
          hasBuyer: roleHint === 'Buyer',
          phone,
          email,
          defaultCreditDays: creditDays,
          totalPayableInr: 0,
          totalPaidInr: 0,
          totalReceivableInr: 0,
          totalReceivedInr: 0,
          overduePayableCount: 0,
          overdueReceivableCount: 0,
          rawEntries: [],
        };
        accMap.set(key, acc);
      } else {
        if (roleHint === 'Seller') acc.hasSeller = true;
        if (roleHint === 'Buyer') acc.hasBuyer = true;
        if (!acc.phone && phone) acc.phone = phone;
        if (!acc.email && email) acc.email = email;
        if (acc.defaultCreditDays === null && creditDays !== null) {
          acc.defaultCreditDays = creditDays;
        }
      }
      return acc;
    };

    for (const s of this.sellers) {
      const acc = ensureAcc(s.name, 'Seller', s.phone, s.email, s.defaultCreditDays);
      acc.sellerId = s.id;
    }
    for (const b of this.buyers) {
      const acc = ensureAcc(b.name, 'Buyer', b.phone, b.email, b.defaultCreditDays);
      acc.buyerId = b.id;
    }

    const txnRows: AllTransactionRow[] = [];

    // 1) Process active Sauda contracts (Purchase -> Payable to Seller, Sales -> Receivable from Buyer)
    for (const sauda of this.saudas) {
      if (sauda.status === 'Voided') continue;
      if (firmFilter !== 'All' && sauda.clientFirm !== firmFilter) continue;

      if (sauda.saudaType === 'Purchase' && sauda.sellerName) {
        const acc = ensureAcc(sauda.sellerName, 'Seller');
        acc.totalPayableInr += Number(sauda.totalAmountInr || 0);
        const isOverdue = Boolean(
          sauda.sellerDueDate && sauda.sellerDueDate < today,
        );
        if (isOverdue) acc.overduePayableCount += 1;

        acc.rawEntries.push({
          sortDate: `${sauda.saudaDate}-1`,
          id: sauda.id,
          date: sauda.saudaDate,
          referenceNo: sauda.saudaNo,
          clientFirm: sauda.clientFirm,
          entryType: 'Purchase Sauda',
          paymentMode: sauda.sellerCreditPeriodDays
            ? `Credit ${sauda.sellerCreditPeriodDays}d`
            : 'Sauda Bill',
          dueDate: sauda.sellerDueDate || '—',
          isOverdue,
          payableAmountInr: Number(sauda.totalAmountInr || 0),
          paidAmountInr: 0,
          receivableAmountInr: 0,
          receivedAmountInr: 0,
          remarks: `${sauda.commodity} (${sauda.quantityMt} MT)`,
        });

        txnRows.push({
          id: sauda.id,
          date: sauda.saudaDate,
          partyName: sauda.sellerName,
          partyRole: 'Seller',
          clientFirm: sauda.clientFirm,
          referenceNo: sauda.saudaNo,
          entryType: 'Purchase Sauda',
          modeOrCredit: sauda.sellerDueDate
            ? `Due: ${sauda.sellerDueDate}`
            : 'Credit Terms',
          payableEffectInr: Number(sauda.totalAmountInr || 0),
          receivableEffectInr: 0,
          amountInr: Number(sauda.totalAmountInr || 0),
          flowLabel: 'Payable (+)',
          remarks: `${sauda.commodity} (${sauda.quantityMt} MT)`,
        });
      } else if (sauda.saudaType === 'Sales' && sauda.buyerName) {
        const acc = ensureAcc(sauda.buyerName, 'Buyer');
        acc.totalReceivableInr += Number(sauda.totalAmountInr || 0);
        const isOverdue = Boolean(
          sauda.buyerDueDate && sauda.buyerDueDate < today,
        );
        if (isOverdue) acc.overdueReceivableCount += 1;

        acc.rawEntries.push({
          sortDate: `${sauda.saudaDate}-1`,
          id: sauda.id,
          date: sauda.saudaDate,
          referenceNo: sauda.saudaNo,
          clientFirm: sauda.clientFirm,
          entryType: 'Sales Sauda',
          paymentMode: sauda.buyerCreditPeriodDays
            ? `Credit ${sauda.buyerCreditPeriodDays}d`
            : 'Sauda Bill',
          dueDate: sauda.buyerDueDate || '—',
          isOverdue,
          payableAmountInr: 0,
          paidAmountInr: 0,
          receivableAmountInr: Number(sauda.totalAmountInr || 0),
          receivedAmountInr: 0,
          remarks: `${sauda.commodity} (${sauda.quantityMt} MT)`,
        });

        txnRows.push({
          id: sauda.id,
          date: sauda.saudaDate,
          partyName: sauda.buyerName,
          partyRole: 'Buyer',
          clientFirm: sauda.clientFirm,
          referenceNo: sauda.saudaNo,
          entryType: 'Sales Sauda',
          modeOrCredit: sauda.buyerDueDate
            ? `Due: ${sauda.buyerDueDate}`
            : 'Credit Terms',
          payableEffectInr: 0,
          receivableEffectInr: Number(sauda.totalAmountInr || 0),
          amountInr: Number(sauda.totalAmountInr || 0),
          flowLabel: 'Receivable (+)',
          remarks: `${sauda.commodity} (${sauda.quantityMt} MT)`,
        });
      }
    }

    // 2) Process Ledger Settlements (Payments Paid, Payments Received, Adjustments)
    for (const st of this.settlements) {
      if (firmFilter !== 'All' && st.clientFirm !== firmFilter) continue;
      const acc = ensureAcc(st.partyName, st.partyRole);

      if (st.ledgerSide === 'Payable') {
        acc.totalPaidInr += Number(st.amountInr || 0);
        acc.rawEntries.push({
          sortDate: `${st.date}-2`,
          id: st.id,
          date: st.date,
          referenceNo: st.referenceNo,
          clientFirm: st.clientFirm,
          entryType: st.entryKind,
          paymentMode: st.paymentMode,
          dueDate: st.saudaNo || '—',
          isOverdue: false,
          payableAmountInr: 0,
          paidAmountInr: Number(st.amountInr || 0),
          receivableAmountInr: 0,
          receivedAmountInr: 0,
          remarks: st.remarks,
        });

        txnRows.push({
          id: st.id,
          date: st.date,
          partyName: st.partyName,
          partyRole: st.partyRole,
          clientFirm: st.clientFirm,
          referenceNo: st.referenceNo,
          entryType: st.entryKind,
          modeOrCredit: st.paymentMode,
          payableEffectInr: -Number(st.amountInr || 0),
          receivableEffectInr: 0,
          amountInr: Number(st.amountInr || 0),
          flowLabel: 'Paid (-)',
          remarks: st.remarks,
        });
      } else {
        acc.totalReceivedInr += Number(st.amountInr || 0);
        acc.rawEntries.push({
          sortDate: `${st.date}-2`,
          id: st.id,
          date: st.date,
          referenceNo: st.referenceNo,
          clientFirm: st.clientFirm,
          entryType: st.entryKind,
          paymentMode: st.paymentMode,
          dueDate: st.saudaNo || '—',
          isOverdue: false,
          payableAmountInr: 0,
          paidAmountInr: 0,
          receivableAmountInr: 0,
          receivedAmountInr: Number(st.amountInr || 0),
          remarks: st.remarks,
        });

        txnRows.push({
          id: st.id,
          date: st.date,
          partyName: st.partyName,
          partyRole: st.partyRole,
          clientFirm: st.clientFirm,
          referenceNo: st.referenceNo,
          entryType: st.entryKind,
          modeOrCredit: st.paymentMode,
          payableEffectInr: 0,
          receivableEffectInr: -Number(st.amountInr || 0),
          amountInr: Number(st.amountInr || 0),
          flowLabel: 'Received (-)',
          remarks: st.remarks,
        });
      }
    }

    const summaries: PartyLedgerSummary[] = Array.from(accMap.values()).map(
      (acc) => {
        const pendingPayableInr = Math.max(
          0,
          acc.totalPayableInr - acc.totalPaidInr,
        );
        const pendingReceivableInr = Math.max(
          0,
          acc.totalReceivableInr - acc.totalReceivedInr,
        );
        // Net balance: positive = Receivable, negative = Payable
        const netBalanceInr =
          acc.totalReceivableInr -
          acc.totalReceivedInr -
          (acc.totalPayableInr - acc.totalPaidInr);

        const sortedAsc = [...acc.rawEntries].sort((a, b) =>
          a.sortDate.localeCompare(b.sortDate),
        );
        let running = 0;
        const statementAsc: PartyStatementEntry[] = sortedAsc.map((e) => {
          running +=
            e.receivableAmountInr -
            e.receivedAmountInr -
            e.payableAmountInr +
            e.paidAmountInr;
          return {
            id: e.id,
            date: e.date,
            referenceNo: e.referenceNo,
            clientFirm: e.clientFirm,
            entryType: e.entryType,
            paymentMode: e.paymentMode,
            dueDate: e.dueDate,
            isOverdue: e.isOverdue,
            payableAmountInr: e.payableAmountInr,
            paidAmountInr: e.paidAmountInr,
            receivableAmountInr: e.receivableAmountInr,
            receivedAmountInr: e.receivedAmountInr,
            runningNetInr: running,
            remarks: e.remarks,
          };
        });

        const statement = [...statementAsc].reverse();
        const lastTxnDate = statement[0]?.date || '—';
        const partyRole: PartyLedgerSummary['partyRole'] =
          acc.hasSeller && acc.hasBuyer
            ? 'Both'
            : acc.hasBuyer
              ? 'Buyer'
              : 'Seller';

        return {
          partyKey: acc.partyKey,
          partyName: acc.partyName,
          sellerId: acc.sellerId,
          buyerId: acc.buyerId,
          partyRole,
          phone: acc.phone,
          email: acc.email,
          defaultCreditDays: acc.defaultCreditDays,
          totalPayableInr: acc.totalPayableInr,
          totalPaidInr: acc.totalPaidInr,
          pendingPayableInr,
          totalReceivableInr: acc.totalReceivableInr,
          totalReceivedInr: acc.totalReceivedInr,
          pendingReceivableInr,
          netBalanceInr,
          overduePayableCount: pendingPayableInr > 0 ? acc.overduePayableCount : 0,
          overdueReceivableCount:
            pendingReceivableInr > 0 ? acc.overdueReceivableCount : 0,
          lastTxnDate,
          txnCount: statement.length,
          statement,
        };
      },
    );

    summaries.sort((a, b) => {
      const aActivity = Math.abs(a.netBalanceInr) + a.txnCount;
      const bActivity = Math.abs(b.netBalanceInr) + b.txnCount;
      return bActivity - aActivity || a.partyName.localeCompare(b.partyName);
    });

    this.allPartySummaries = summaries;
    this.allTransactions = txnRows.sort((a, b) => b.date.localeCompare(a.date));

    this.applyFilters();

    if (this.selectedStatementParty) {
      this.selectedStatementParty =
        summaries.find(
          (p) => p.partyKey === this.selectedStatementParty!.partyKey,
        ) || null;
    }
  }

  onSearch(): void {
    this.appliedSearchTerm = (this.searchTerm || '').trim();
    this.page = 1;
    this.txnPage = 1;
    this.showReset =
      !!this.appliedSearchTerm ||
      this.roleFilter !== 'All' ||
      this.balanceFilter !== 'All' ||
      this.firmFilter !== 'All';
    this.rebuildLedgerData();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.appliedSearchTerm = '';
    this.roleFilter = 'All';
    this.balanceFilter = 'All';
    this.firmFilter = 'All';
    this.showReset = false;
    this.page = 1;
    this.txnPage = 1;
    this.rebuildLedgerData();
  }

  onTableSizeChange(): void {
    this.page = 1;
    this.txnPage = 1;
  }

  setTab(tab: 'parties' | 'transactions'): void {
    this.viewTab = tab;
  }

  applyFilters(): void {
    const q = this.appliedSearchTerm.toLowerCase();

    this.filteredSummaries = this.allPartySummaries.filter((p) => {
      if (this.roleFilter === 'Seller' && p.partyRole === 'Buyer') return false;
      if (this.roleFilter === 'Buyer' && p.partyRole === 'Seller') return false;

      if (this.balanceFilter === 'Payable Pending' && p.pendingPayableInr <= 0) {
        return false;
      }
      if (
        this.balanceFilter === 'Receivable Pending' &&
        p.pendingReceivableInr <= 0
      ) {
        return false;
      }
      if (
        this.balanceFilter === 'Settled' &&
        (p.pendingPayableInr > 0 || p.pendingReceivableInr > 0)
      ) {
        return false;
      }

      if (!q) return true;
      return (
        p.partyName.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.statement.some((s) => s.referenceNo.toLowerCase().includes(q))
      );
    });

    this.filteredTransactions = this.allTransactions.filter((t) => {
      if (this.roleFilter !== 'All' && t.partyRole !== this.roleFilter) {
        return false;
      }
      if (
        this.balanceFilter === 'Payable Pending' &&
        t.payableEffectInr === 0
      ) {
        return false;
      }
      if (
        this.balanceFilter === 'Receivable Pending' &&
        t.receivableEffectInr === 0
      ) {
        return false;
      }
      if (!q) return true;
      return (
        t.partyName.toLowerCase().includes(q) ||
        t.referenceNo.toLowerCase().includes(q) ||
        t.clientFirm.toLowerCase().includes(q) ||
        t.remarks.toLowerCase().includes(q)
      );
    });
  }

  // ── Party Statement Detail ──

  openStatement(party: PartyLedgerSummary): void {
    this.selectedStatementParty = party;
  }

  backToListing(): void {
    this.selectedStatementParty = null;
  }

  // ── Record Payment / Receipt Modal ──

  openPaymentModal(preset?: PartyLedgerSummary): void {
    this.paymentError = '';
    const today = new Date().toISOString().slice(0, 10);
    const defaultParty =
      preset || this.filteredSummaries[0] || this.allPartySummaries[0];

    const isReceivableDefault = defaultParty
      ? defaultParty.pendingReceivableInr > defaultParty.pendingPayableInr ||
        defaultParty.partyRole === 'Buyer'
      : false;

    this.paymentForm = {
      date: today,
      partyName: defaultParty?.partyName || '',
      partyRole: isReceivableDefault ? 'Buyer' : 'Seller',
      clientFirm: this.firms[0]?.name || 'Desert Fresh Traders',
      entryKind: isReceivableDefault ? 'Payment Received' : 'Payment Paid',
      ledgerSide: isReceivableDefault ? 'Receivable' : 'Payable',
      amountInr: isReceivableDefault
        ? defaultParty?.pendingReceivableInr || null
        : defaultParty?.pendingPayableInr || null,
      paymentMode: 'RTGS / NEFT',
      referenceNo: '',
      saudaNo: '',
      remarks: '',
    };

    const matchingSauda = this.saudaOptionsForPayment[0];
    if (matchingSauda) {
      this.paymentForm.clientFirm = matchingSauda.clientFirm;
      this.paymentForm.saudaNo = matchingSauda.saudaNo;
    }

    this.showPaymentModal = true;
  }

  onPaymentTypeChange(
    kind: 'Payment Paid' | 'Payment Received' | 'Rebate / Adjustment',
  ): void {
    this.paymentForm.entryKind = kind;
    if (kind === 'Payment Paid') {
      this.paymentForm.ledgerSide = 'Payable';
      this.paymentForm.partyRole = 'Seller';
    } else if (kind === 'Payment Received') {
      this.paymentForm.ledgerSide = 'Receivable';
      this.paymentForm.partyRole = 'Buyer';
    }
  }

  onPaymentPartyChange(partyName: string): void {
    const found = this.allPartySummaries.find(
      (p) => p.partyName.toLowerCase() === (partyName || '').toLowerCase(),
    );
    if (found) {
      if (found.partyRole === 'Buyer') {
        this.paymentForm.partyRole = 'Buyer';
        this.paymentForm.ledgerSide = 'Receivable';
        this.paymentForm.entryKind = 'Payment Received';
      } else {
        this.paymentForm.partyRole = 'Seller';
        this.paymentForm.ledgerSide = 'Payable';
        this.paymentForm.entryKind = 'Payment Paid';
      }
    }
    const matchingSauda = this.saudaOptionsForPayment[0];
    if (matchingSauda) {
      this.paymentForm.clientFirm = matchingSauda.clientFirm;
      this.paymentForm.saudaNo = matchingSauda.saudaNo;
    }
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.paymentError = '';
  }

  submitPayment(): void {
    this.paymentError = '';
    if (
      !this.paymentForm.partyName ||
      !this.paymentForm.clientFirm ||
      !this.paymentForm.date
    ) {
      this.paymentError = 'Please select Party, Client Firm, and Date.';
      return;
    }
    if (!this.paymentForm.amountInr || Number(this.paymentForm.amountInr) <= 0) {
      this.paymentError = 'Enter a valid amount greater than zero.';
      return;
    }

    const res = this.erp.recordLedgerSettlement({
      date: this.paymentForm.date,
      partyName: this.paymentForm.partyName,
      partyRole: this.paymentForm.partyRole,
      clientFirm: this.paymentForm.clientFirm,
      entryKind: this.paymentForm.entryKind,
      ledgerSide: this.paymentForm.ledgerSide,
      amountInr: Number(this.paymentForm.amountInr),
      paymentMode: this.paymentForm.paymentMode,
      referenceNo: this.paymentForm.referenceNo,
      saudaNo: this.paymentForm.saudaNo,
      remarks: this.paymentForm.remarks,
    });

    if (!res.ok) {
      this.paymentError = res.message;
      return;
    }

    this.closePaymentModal();
    this.notify.show(res.message, 'success', 3000);
  }

  // ── Add Party Modal ──

  openAddPartyModal(): void {
    this.partyError = '';
    this.newPartyForm = {
      role: 'Seller',
      name: '',
      phone: '',
      email: '',
      defaultCreditDays: 15,
    };
    this.showAddPartyModal = true;
  }

  closeAddPartyModal(): void {
    this.showAddPartyModal = false;
    this.partyError = '';
  }

  submitNewParty(): void {
    this.partyError = '';
    const name = (this.newPartyForm.name || '').trim();
    if (name.length < 2) {
      this.partyError = 'Party name must be at least 2 characters.';
      return;
    }
    const phone = (this.newPartyForm.phone || '').trim();
    const email = (this.newPartyForm.email || '').trim();
    const creditDays = this.newPartyForm.defaultCreditDays;
    const res =
      this.newPartyForm.role === 'Seller'
        ? this.erp.createSeller(name, phone, email, creditDays)
        : this.erp.createBuyer(name, phone, email, creditDays);

    if (!res.ok) {
      this.partyError = res.message;
      return;
    }

    this.closeAddPartyModal();
    this.notify.show(res.message, 'success', 3000);
  }

  // ── Edit Party Modal ──

  openEditPartyModal(party: PartyLedgerSummary): void {
    this.editPartyError = '';
    const sRec = this.sellers.find(
      (s) => s.name.toLowerCase() === party.partyKey || s.id === party.sellerId,
    );
    const bRec = this.buyers.find(
      (b) => b.name.toLowerCase() === party.partyKey || b.id === party.buyerId,
    );

    this.editPartyForm = {
      sellerId: sRec?.id || party.sellerId,
      buyerId: bRec?.id || party.buyerId,
      role: party.partyRole,
      name: party.partyName,
      phone: party.phone || sRec?.phone || bRec?.phone || '',
      email: party.email || sRec?.email || bRec?.email || '',
      defaultCreditDays:
        party.defaultCreditDays !== null
          ? party.defaultCreditDays
          : (sRec?.defaultCreditDays ?? bRec?.defaultCreditDays ?? null),
    };
    this.showEditPartyModal = true;
  }

  closeEditPartyModal(): void {
    this.showEditPartyModal = false;
    this.editPartyError = '';
  }

  submitEditParty(): void {
    this.editPartyError = '';
    const name = (this.editPartyForm.name || '').trim();
    if (name.length < 2) {
      this.editPartyError = 'Party name must be at least 2 characters.';
      return;
    }
    const phone = (this.editPartyForm.phone || '').trim();
    const email = (this.editPartyForm.email || '').trim();
    const creditDays = this.editPartyForm.defaultCreditDays;

    if (this.editPartyForm.sellerId) {
      const res = this.erp.updateSeller(
        this.editPartyForm.sellerId,
        name,
        phone,
        email,
        creditDays,
      );
      if (!res.ok) {
        this.editPartyError = res.message;
        return;
      }
    }

    if (this.editPartyForm.buyerId) {
      const res = this.erp.updateBuyer(
        this.editPartyForm.buyerId,
        name,
        phone,
        email,
        creditDays,
      );
      if (!res.ok) {
        this.editPartyError = res.message;
        return;
      }
    }

    if (!this.editPartyForm.sellerId && !this.editPartyForm.buyerId) {
      const res =
        this.editPartyForm.role === 'Buyer'
          ? this.erp.createBuyer(name, phone, email, creditDays)
          : this.erp.createSeller(name, phone, email, creditDays);
      if (!res.ok) {
        this.editPartyError = res.message;
        return;
      }
    }

    this.closeEditPartyModal();
    this.notify.show(`Party "${name}" updated successfully.`, 'success', 3000);
  }

  abs(n: number): number {
    return Math.abs(n);
  }
}
