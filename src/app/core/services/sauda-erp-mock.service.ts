import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SaudaType = 'Brokerage' | 'Purchase' | 'Sales' | 'Forward' | 'Direct Sale';
export type SaudaStatus =
  | 'Open'
  | 'Partial'
  | 'Completed'
  | 'Voided'
  | 'On Hold'
  | 'Partly Sold'
  | 'Sold';
export type BrokerageBillingMode =
  | 'PS-1: Split'
  | 'PS-2: Buyer pays all'
  | 'PS-3: Everything together';
export type TruckStatus =
  | 'Scheduled'
  | 'Loaded'
  | 'In Transit'
  | 'Delivered'
  | 'Removed';

export interface RevisionDiff {
  field: string;
  oldValue: string;
  newValue: string;
}

export interface RevisionEntry {
  version: number;
  changedAt: string;
  changedBy: string;
  action: 'Created' | 'Updated' | 'Voided' | 'Removed';
  reason: string;
  changes: RevisionDiff[];
}

export type PackagingUom = 'Bag' | 'Crate' | 'Box' | 'Carton' | 'Sack' | 'Loose';
export type WeightUom = 'KG' | 'Quintal' | 'MT';

export interface CommodityLineItem {
  commodity: string;
  packagingUom?: PackagingUom;
  packagingQty?: number;
  weightUom?: WeightUom;
  actualWeight: number;
  rate?: number;
  ratePerKg?: number;
  buyerBrokerage?: number;
  sellerBrokerage?: number;
  lineTotal?: number;
}

export type AmendmentStatus = 'None' | 'Pending Approval' | 'Approved' | 'Rejected';

export interface SaudaAmendmentRecord {
  id: string;
  saudaId: string;
  saudaNo: string;
  maker: string;
  submittedAt: string;
  reason: string;
  proposedPayload: any;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  checker?: string;
  decidedAt?: string;
  rejectionReason?: string;
  changes: RevisionDiff[];
}

export interface SaudaRecord {
  id: string;
  saudaNo: string;
  saudaDate: string;
  saudaType: SaudaType;
  clientFirm: string;
  sellerName: string;
  buyerName: string;
  partyName: string;
  commodityItems: CommodityLineItem[];
  commodity: string;
  quantityMt: number;
  heldQuantityMt?: number;
  soldQuantityMt?: number;
  linkedSalesSaudaIds?: string[];
  totalAmountInr: number;
  expectedDeliveryDate?: string;
  dueDate?: string;
  warehouseId?: string;
  warehouseName?: string;
  godownName?: string;
  chamberName?: string;
  stackNumber?: string;
  brokerageBillingMode?: BrokerageBillingMode;
  linkedPurchaseSaudaId?: string;
  linkedPurchaseSaudaNo?: string;
  buyerBrokerageAmount?: number;
  sellerBrokerageAmount?: number;
  totalBrokerageAmount?: number;
  sellerCreditPeriodDays: number | null;
  sellerCreditStartDate: string;
  sellerDueDate: string;
  buyerCreditPeriodDays: number | null;
  buyerCreditStartDate: string;
  buyerDueDate: string;
  remarks: string;
  status: SaudaStatus;
  currentVersion: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  amendmentStatus?: AmendmentStatus;
  pendingAmendment?: SaudaAmendmentRecord;
  voidInfo?: {
    voidedBy: string;
    voidedAt: string;
    reason: string;
  };
  revisions: RevisionEntry[];
  isInvoiced?: boolean;
  invoiceId?: string;
  invoiceNo?: string;
}

export interface TruckEntryRecord {
  id: string;
  entryNo: string;
  saudaId: string;
  saudaNo: string;
  saudaType: SaudaType;
  partyName?: string;
  warehouse?: string;
  warehouseId?: string;
  godownName?: string;
  chamberName?: string;
  stackNumber?: string;
  vehicleNo: string;
  driverName?: string;
  driverPhone?: string;
  transporterName?: string;
  lrNo?: string;
  commodityItems: CommodityLineItem[];
  commodities: string;
  loadedQtyMt: number;
  freightRatePerMt: number;
  advancePaid: number;
  dispatchDate: string;
  expectedArrivalDate: string;
  status: TruckStatus;
  isFinalSubmit?: boolean;
  remarks: string;
  currentVersion: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  removalInfo?: {
    removedBy: string;
    removedAt: string;
    reason: string;
  };
  revisions: RevisionEntry[];
}

export interface FirmRecord {
  id: string;
  name: string;
  email?: string;
  whatsappNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FirmPayload {
  name: string;
  email?: string;
  whatsappNumber?: string;
}

export interface SellerRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  defaultCreditDays: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BuyerRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  defaultCreditDays: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommodityRecord {
  id: string;
  name: string;
  defaultPackagingUom: PackagingUom;
  defaultWeightUom: WeightUom;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryLogEntry {
  id: string;
  date: string;
  action: 'Stock In' | 'Stock Out' | 'Adjustment';
  referenceNo: string;
  unitsChange: number;
  weightMtChange: number;
  remarks: string;
  doneBy: string;
}

export interface InventoryRecord {
  id: string;
  warehouseId: string;
  warehouseName: string;
  isActiveWarehouse: boolean;
  godownId?: string;
  godownName?: string;
  chamberId?: string;
  chamberName?: string;
  stackNumber?: string;
  productId: string;
  productName: string;
  categoryId: string;
  categoryName: string;
  subCategoryName: string;
  commodity: string;
  partyName?: string;
  clientFirm: string;
  packagingUom: PackagingUom;
  availableUnits: number;
  availableWeightMt: number;
  averageWeightKg: number;
  minThresholdMt: number;
  lastUpdated: string;
  logs: InventoryLogEntry[];
}

export interface StockAdjustmentRecord {
  id: string;
  adjNo: string;
  partyName?: string;
  clientFirm: string;
  warehouseId: string;
  warehouseName: string;
  isActiveWarehouse: boolean;
  godownId?: string;
  godownName?: string;
  chamberId?: string;
  chamberName?: string;
  stackNumber?: string;
  commodity: string;
  productId?: string;
  productName?: string;
  adjustmentType: 'Increase' | 'Decrease';
  packagingUom: PackagingUom;
  quantity: number;
  totalWeightMt: number;
  averageWeightKg: number;
  reason: string;
  adjustmentDate: string; // YYYY-MM-DD
  submittedAt: string; // YYYY-MM-DD HH:mm
  makerRole: 'Operations Executive (Maker)' | 'Business Owner / Admin (Checker)';
  makerName: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  checkerRole?: string;
  checkerName?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface StockMovementRecord {
  id: string;
  movementNo: string;
  movementType: 'Purchase Receipt' | 'Sales Dispatch' | 'Stock Adjustment';
  movementDirection: 'Stock In' | 'Stock Out';
  partyName?: string;
  clientFirm: string;
  warehouseName: string;
  godownName?: string;
  chamberName?: string;
  stackNumber?: string;
  commodity: string;
  packagingUom: PackagingUom;
  quantity: number;
  totalWeightMt: number;
  averageWeightKg: number;
  sourceRef: string;
  truckNo?: string;
  movementDate: string;
  recordedAt: string;
  recordedBy: string;
  makerCheckerDetails?: string;
  stockBalanceUnitsAfter: number;
  stockBalanceWeightMtAfter: number;
}

export interface InvCategoryRecord {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvSubCategoryRecord {
  id: string;
  name: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvProductRecord {
  id: string;
  name: string;
  commodityName?: string;
  subCategoryId: string;
  packagingUom: string;
  packagingUoms?: string[];
  weightUom: WeightUom;
  minStock?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PackagingUomRecord {
  id: string;
  name: string;
  bagQuantity?: number;
  unit?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WeightUomRecord {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseRecord {
  id: string;
  name: string;
  partyName?: string;
  clientFirm?: string;
  address: string;
  city: string;
  contactPerson?: string;
  contactPhone?: string;
  remarks?: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ChamberConfig {
  id: string; // e.g. 'CH-01'
  name: string; // e.g. 'Chamber 1', 'Chamber A'
  capacityMt?: number;
  stackNumbers: string[]; // e.g. ['Stack No. 101', 'Stack No. 102', 'Stack No. 110']
}

export interface GodownRecord {
  id: string; // e.g. 'GD-001'
  warehouseId: string;
  warehouseName: string;
  partyName?: string;
  name: string; // e.g. 'Godown 1 (North Block)'
  supervisor?: string;
  supervisorPhone?: string;
  capacityMt?: number;
  remarks?: string;
  chambers: ChamberConfig[];
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export type UserType = 'Business Owner / Admin' | 'Operations Executive';
export type AccountStatus = 'Active' | 'Inactive';
export type PasswordSetupStatus = 'Pending' | 'Completed';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  mobile: string;
  userType: UserType;
  primaryFirm: string;
  accountStatus: AccountStatus;
  passwordSetupStatus: PasswordSetupStatus;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export type PaymentMode = 'RTGS / NEFT' | 'Cheque' | 'UPI' | 'Cash' | 'Adjustment';

export interface LedgerSettlementRecord {
  id: string;
  date: string;
  partyName: string;
  partyRole: 'Seller' | 'Buyer';
  clientFirm: string;
  entryKind: 'Payment Paid' | 'Payment Received' | 'Rebate / Adjustment';
  ledgerSide: 'Payable' | 'Receivable';
  amountInr: number;
  paymentMode: PaymentMode;
  referenceNo: string;
  saudaNo?: string;
  remarks: string;
  recordedBy: string;
  createdAt: string;
}

export interface ActionResult {
  ok: boolean;
  message: string;
  recordId?: string;
}

export type InvoiceStatus = 'Issued' | 'Paid';

export interface InvoicePaymentRecord {
  id: string;
  invoiceId: string;
  invoiceNo: string;
  paymentDate: string;
  paymentAmount: number; // Must strictly equal Invoice.finalAmount (BR-PAY-04)
  paymentMode: PaymentMode;
  paymentReferenceNo: string; // UTR / Cheque / Bank ref (BR-PAY-07)
  bankDetails: string; // Mandatory bank name, branch, etc. (BR-PAY-07)
  receiptAttachmentName?: string; // Optional (BR-PAY-07)
  recordedBy: string;
  recordedAt: string;
  remarks?: string;
}

export interface InvoiceLinkedSauda {
  saudaId: string;
  saudaNo: string;
  saudaDate: string;
  saudaType: SaudaType;
  commodity: string;
  quantityMt: number;
  heldQuantityMt?: number;
  soldQuantityMt?: number;
  linkedSalesSaudaIds?: string[];
  totalAmountInr: number;
}

export interface InvoiceRecord {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  clientFirm: string;
  partyName: string;
  partyRole: 'Seller' | 'Buyer';
  linkedSaudas: InvoiceLinkedSauda[];
  originalCalculatedAmount: number;
  finalAmount: number;
  adjustmentAmount: number; // finalAmount - originalCalculatedAmount
  adjustmentReason?: string; // Mandatory if finalAmount !== originalCalculatedAmount (BR-IN-05)
  status: InvoiceStatus; // 'Issued' | 'Paid' (BR-IN-06)
  issuedBy: string;
  issuedAt: string;
  paymentDetails?: InvoicePaymentRecord;
  createdAt: string;
}

export interface JournalEntryRecord {
  id: string;
  voucherNo: string;
  entryDate: string;
  buyerName: string;
  sellerName: string;
  invoiceNo: string;
  invoiceId?: string;
  originalInvoicePendingAmount: number;
  dharamKanta: number;
  mudat: number;
  labour: number;
  claim: number;
  brokerage: number;
  interest: number;
  warehouseRent: number;
  tds: number;
  other: number;
  totalAdjustments: number;
  netPendingAmountAfter: number;
  narration: string;
  recordedBy: string;
  createdAt: string;
}

export interface PaymentEntryRecord {
  id: string;
  entryDate: string;
  voucherDetails: string;
  receivedAmount: number;
  paymentAmount: number;
  accountName: string;
  partyName?: string;
  narration: string;
  balanceAfter: number;
  recordedBy: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class SaudaErpMockService {
  private readonly initialSaudas: SaudaRecord[] = [
    {
      id: 'SAU-2026-0001',
      saudaNo: 'SAU-2026-0001',
      saudaDate: '2026-11-04',
      saudaType: 'Purchase',
      clientFirm: 'Desert Fresh Traders',
      sellerName: 'Sharma Grain Traders',
      buyerName: '',
      partyName: 'Sharma Grain Traders',
      warehouseId: 'WH-001',
      warehouseName: 'Desert Mandi Yard A',
      godownName: 'Godown 1 (North Block)',
      chamberName: 'Chamber 1',
      stackNumber: 'Stack No. 101',
      commodityItems: [
        {
          commodity: 'Bajra',
          packagingUom: 'Bag',
          packagingQty: 100,
          weightUom: 'MT',
          actualWeight: 5,
          rate: 30,
          lineTotal: 150000,
        },
      ],
      commodity: 'Bajra',
      quantityMt: 5,
      heldQuantityMt: 5,
      soldQuantityMt: 0,
      totalAmountInr: 150000,
      expectedDeliveryDate: '2026-11-12',
      sellerCreditPeriodDays: 15,
      sellerCreditStartDate: '2026-11-04',
      sellerDueDate: '2026-11-19',
      buyerCreditPeriodDays: null,
      buyerCreditStartDate: '',
      buyerDueDate: '',
      remarks: 'Cleaned Shree Anna millet lots, standard 50kg bags',
      status: 'Completed',
      currentVersion: 2,
      amendmentStatus: 'None',
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-04 10:15',
      updatedAt: '2026-11-06 14:30',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-04 10:15',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: 'Initial Sauda contract booked in mandi session',
          changes: [
            { field: 'Commodities', oldValue: '-', newValue: 'Bajra (30 Quintal)' },
            { field: 'Total Amount', oldValue: '-', newValue: '₹1,20,000' },
          ],
        },
        {
          version: 2,
          changedAt: '2026-11-06 14:30',
          changedBy: 'Sauda Admin',
          action: 'Updated',
          reason: 'Added Jowar lot and revised total agreement value',
          changes: [
            {
              field: 'Commodities',
              oldValue: 'Bajra',
              newValue: 'Bajra, Jowar',
            },
            {
              field: 'Total Amount',
              oldValue: '₹1,20,000',
              newValue: '₹1,50,000',
            },
          ],
        },
      ],
      isInvoiced: true,
      invoiceId: 'INV-2026-0002',
      invoiceNo: 'INV-2026-0002',
    },
    {
      id: 'SAU-2026-0002',
      saudaNo: 'SAU-2026-0002',
      saudaDate: '2026-11-05',
      saudaType: 'Sales',
      clientFirm: 'Desert Fresh Traders',
      sellerName: 'Sharma Grain Traders',
      buyerName: 'City Wholesale Market',
      partyName: 'City Wholesale Market',
      linkedPurchaseSaudaId: 'SAU-2026-0001',
      linkedPurchaseSaudaNo: 'SAU-2026-0001',
      warehouseId: 'WH-001',
      warehouseName: 'Desert Mandi Yard A',
      godownName: 'Godown 1 (North Block)',
      chamberName: 'Chamber 1',
      stackNumber: 'Stack No. 101',
      brokerageBillingMode: 'PS-1: Split',
      buyerBrokerageAmount: 2500,
      sellerBrokerageAmount: 2500,
      totalBrokerageAmount: 5000,
      commodityItems: [
        {
          commodity: 'Wheat',
          packagingUom: 'Bag',
          packagingQty: 100,
          weightUom: 'Quintal',
          actualWeight: 50,
          rate: 2500,
          lineTotal: 125000,
        },
      ],
      commodity: 'Wheat',
      quantityMt: 5,
      totalAmountInr: 125000,
      sellerCreditPeriodDays: null,
      sellerCreditStartDate: '',
      sellerDueDate: '',
      buyerCreditPeriodDays: 7,
      buyerCreditStartDate: '2026-11-05',
      buyerDueDate: '2026-11-12',
      remarks: 'Lokwan Sharbati Wheat, machine-cleaned 50kg bags',
      status: 'Completed',
      currentVersion: 1,
      amendmentStatus: 'None',
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-05 11:40',
      updatedAt: '2026-11-05 11:40',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-05 11:40',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: 'Direct wholesale grain sale contract confirmed',
          changes: [
            { field: 'Commodities', oldValue: '-', newValue: 'Wheat (50 Quintal)' },
            { field: 'Total Amount', oldValue: '-', newValue: '₹1,25,000' },
          ],
        },
      ],
      isInvoiced: true,
      invoiceId: 'INV-2026-0001',
      invoiceNo: 'INV-2026-0001',
    },
    {
      id: 'SAU-2026-0003',
      saudaNo: 'SAU-2026-0003',
      saudaDate: '2026-11-06',
      saudaType: 'Brokerage',
      clientFirm: 'Rajasthan Agro',
      sellerName: 'Jai Kisan Suppliers',
      buyerName: 'Fresh Mart',
      partyName: 'Jai Kisan Suppliers / Fresh Mart',
      warehouseId: 'WH-002',
      warehouseName: 'Rajasthan Agro Godown 4',
      godownName: 'Godown A',
      chamberName: 'Chamber 1',
      stackNumber: 'Stack No. 201',
      brokerageBillingMode: 'PS-1: Split',
      commodityItems: [
        {
          commodity: 'Bajra',
          packagingUom: 'Bag',
          packagingQty: 200,
          weightUom: 'Quintal',
          actualWeight: 100,
          rate: 2500,
          lineTotal: 250000,
        },
      ],
      commodity: 'Bajra',
      quantityMt: 10,
      totalAmountInr: 250000,
      buyerBrokerageAmount: 3500,
      sellerBrokerageAmount: 3500,
      totalBrokerageAmount: 7000,
      sellerCreditPeriodDays: 10,
      sellerCreditStartDate: '2026-11-06',
      sellerDueDate: '2026-11-16',
      buyerCreditPeriodDays: 15,
      buyerCreditStartDate: '2026-11-06',
      buyerDueDate: '2026-11-21',
      remarks: 'Direct Sale agreement settled for Desi Hybrid Bajra lot',
      status: 'Partial',
      currentVersion: 1,
      amendmentStatus: 'None',
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-06 09:50',
      updatedAt: '2026-11-06 09:50',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-06 09:50',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: 'Direct Sale agreement finalized',
          changes: [
            { field: 'Commodities', oldValue: '-', newValue: 'Bajra (100 Quintal)' },
            { field: 'Total Amount', oldValue: '-', newValue: '₹2,50,000' },
          ],
        },
      ],
    },
    {
      id: 'SAU-2026-0004',
      saudaNo: 'SAU-2026-0004',
      saudaDate: '2026-11-07',
      saudaType: 'Purchase',
      clientFirm: 'Rajasthan Agro',
      sellerName: 'Om Traders',
      buyerName: '',
      partyName: 'Om Traders',
      commodityItems: [
        {
          commodity: 'Maize',
          packagingUom: 'Sack',
          packagingQty: 100,
          weightUom: 'Quintal',
          actualWeight: 50,
          rate: 1900,
          lineTotal: 95000,
        },
      ],
      commodity: 'Maize',
      quantityMt: 5,
      totalAmountInr: 95000,
      expectedDeliveryDate: '2026-11-20',
      sellerCreditPeriodDays: 30,
      sellerCreditStartDate: '2026-11-07',
      sellerDueDate: '2026-12-07',
      buyerCreditPeriodDays: null,
      buyerCreditStartDate: '',
      buyerDueDate: '',
      remarks: 'Yellow Field Maize purchase lot (5 Ton booked)',
      status: 'Partial',
      currentVersion: 1,
      amendmentStatus: 'None',
      pendingAmendment: {
        id: 'AMD-2026-0001',
        saudaId: 'SAU-2026-0004',
        saudaNo: 'SAU-2026-0004',
        maker: 'Operations Executive (Ramesh Kumar)',
        submittedAt: '2026-11-08 14:15',
        reason: 'Seller requested extension of credit period to 45 days and delivery date revision',
        status: 'Pending Approval',
        proposedPayload: {
          saudaType: 'Purchase',
          saudaDate: '2026-11-07',
          clientFirm: 'Rajasthan Agro',
          sellerName: 'Om Traders',
          buyerName: '',
          commodityItems: [
            {
              commodity: 'Maize',
              packagingUom: 'Sack',
              packagingQty: 100,
              weightUom: 'Quintal',
              actualWeight: 50,
              rate: 1900,
              lineTotal: 95000,
            },
          ],
          totalAmountInr: 95000,
          expectedDeliveryDate: '2026-11-25',
          sellerCreditPeriodDays: 45,
          sellerCreditStartDate: '2026-11-07',
          sellerDueDate: '2026-12-22',
          buyerCreditPeriodDays: null,
          buyerCreditStartDate: '',
          buyerDueDate: '',
          remarks: 'Seller requested extension of credit period to 45 days and delivery date revision',
        },
        changes: [
          { field: 'Expected Delivery Date', oldValue: '2026-11-20', newValue: '2026-11-25' },
          { field: 'Seller Credit Period', oldValue: '30 Days', newValue: '45 Days' },
          { field: 'Seller Due Date', oldValue: '2026-12-07', newValue: '2026-12-22' },
        ],
      },
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-07 16:05',
      updatedAt: '2026-11-07 16:05',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-07 16:05',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: 'New Yellow Maize purchase order received',
          changes: [
            { field: 'Commodities', oldValue: '-', newValue: 'Maize (50 Quintal)' },
            { field: 'Total Amount', oldValue: '-', newValue: '₹95,000' },
          ],
        },
      ],
    },
    {
      id: 'SAU-2026-0005',
      saudaNo: 'SAU-2026-0005',
      saudaDate: '2026-11-03',
      saudaType: 'Purchase',
      clientFirm: 'Om Sai Traders Kota',
      sellerName: 'Kota Krishi Traders',
      buyerName: '',
      partyName: 'Kota Krishi Traders',
      commodityItems: [
        {
          commodity: 'Ragi',
          packagingUom: 'Bag',
          packagingQty: 120,
          weightUom: 'Quintal',
          actualWeight: 60,
          rate: 3500,
          lineTotal: 210000,
        },
      ],
      commodity: 'Ragi',
      quantityMt: 6,
      totalAmountInr: 210000,
      expectedDeliveryDate: '2026-11-08',
      sellerCreditPeriodDays: 7,
      sellerCreditStartDate: '2026-11-03',
      sellerDueDate: '2026-11-10',
      buyerCreditPeriodDays: null,
      buyerCreditStartDate: '',
      buyerDueDate: '',
      remarks: 'Duplicate contract entry from morning floor',
      status: 'Voided',
      currentVersion: 2,
      amendmentStatus: 'None',
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-03 11:00',
      updatedAt: '2026-11-03 13:25',
      voidInfo: {
        voidedBy: 'Sauda Admin',
        voidedAt: '2026-11-03 13:25',
        reason: 'Party cancelled lot due to quality mismatch prior to loading',
      },
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-03 11:00',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: 'Initial Ragi Sauda entry',
          changes: [
            { field: 'Commodities', oldValue: '-', newValue: 'Ragi (60 Quintal)' },
            { field: 'Total Amount', oldValue: '-', newValue: '₹2,10,000' },
          ],
        },
        {
          version: 2,
          changedAt: '2026-11-03 13:25',
          changedBy: 'Sauda Admin',
          action: 'Voided',
          reason: 'Party cancelled lot due to quality mismatch prior to loading',
          changes: [{ field: 'Status', oldValue: 'Open', newValue: 'Voided' }],
        },
      ],
    },
    {
      id: 'SAU-2026-0006',
      saudaNo: 'SAU-2026-0006',
      saudaDate: '2026-11-10',
      saudaType: 'Purchase',
      clientFirm: 'Desert Fresh Traders',
      sellerName: 'Jal Kisan Suppliers',
      buyerName: '',
      partyName: 'Jal Kisan Suppliers',
      commodityItems: [
        {
          commodity: 'Bajra',
          packagingUom: 'Bag',
          packagingQty: 150,
          weightUom: 'Quintal',
          actualWeight: 40,
          rate: 3000,
          lineTotal: 120000,
        },
      ],
      commodity: 'Bajra - Desi Hybrid Bajra',
      quantityMt: 4,
      totalAmountInr: 120000,
      expectedDeliveryDate: '2026-11-16',
      sellerCreditPeriodDays: 15,
      sellerCreditStartDate: '2026-11-10',
      sellerDueDate: '2026-11-25',
      buyerCreditPeriodDays: null,
      buyerCreditStartDate: '',
      buyerDueDate: '',
      remarks: 'Desi Hybrid Bajra lot from mandi yard',
      status: 'Completed',
      currentVersion: 1,
      amendmentStatus: 'None',
      isInvoiced: false,
      createdBy: 'Amit Patel',
      createdAt: '2026-11-10 10:00',
      updatedAt: '2026-11-10 10:00',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-10 10:00',
          changedBy: 'Amit Patel',
          action: 'Created',
          reason: 'Direct purchase booked',
          changes: [
            { field: 'Commodities', oldValue: '-', newValue: 'Bajra (40 Quintal)' },
            { field: 'Total Amount', oldValue: '-', newValue: '₹1,20,000' },
          ],
        },
      ],
    },
    {
      id: 'SAU-2026-0007',
      saudaNo: 'SAU-2026-0007',
      saudaDate: '2026-11-11',
      saudaType: 'Purchase',
      clientFirm: 'Desert Fresh Traders',
      sellerName: 'Jal Kisan Suppliers',
      buyerName: '',
      partyName: 'Jal Kisan Suppliers',
      commodityItems: [
        {
          commodity: 'Jowar',
          packagingUom: 'Bag',
          packagingQty: 100,
          weightUom: 'Quintal',
          actualWeight: 40,
          rate: 3000,
          lineTotal: 120000,
        },
      ],
      commodity: 'Jowar - Maldandi White Jowar',
      quantityMt: 4,
      totalAmountInr: 120000,
      expectedDeliveryDate: '2026-11-17',
      sellerCreditPeriodDays: 15,
      sellerCreditStartDate: '2026-11-11',
      sellerDueDate: '2026-11-26',
      buyerCreditPeriodDays: null,
      buyerCreditStartDate: '',
      buyerDueDate: '',
      remarks: 'Maldandi white jowar grain lot',
      status: 'Completed',
      currentVersion: 1,
      amendmentStatus: 'None',
      isInvoiced: false,
      createdBy: 'Amit Patel',
      createdAt: '2026-11-11 11:30',
      updatedAt: '2026-11-11 11:30',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-11 11:30',
          changedBy: 'Amit Patel',
          action: 'Created',
          reason: 'Direct purchase booked',
          changes: [
            { field: 'Commodities', oldValue: '-', newValue: 'Jowar (40 Quintal)' },
            { field: 'Total Amount', oldValue: '-', newValue: '₹1,20,000' },
          ],
        },
      ],
    },
    {
      id: 'SAU-2026-0008',
      saudaNo: 'SAU-2026-0008',
      saudaDate: '2026-11-20',
      dueDate: '2027-02-20',
      saudaType: 'Forward',
      clientFirm: 'Desert Fresh Traders',
      sellerName: 'Kallash Agro Foods',
      buyerName: 'Marwar Oil Mills',
      partyName: 'Kallash Agro Foods / Marwar Oil Mills',
      commodityItems: [
        {
          commodity: 'Ground Nut',
          packagingUom: 'Bag',
          packagingQty: 400,
          weightUom: 'MT',
          actualWeight: 20,
          rate: 75,
          lineTotal: 1500000,
        },
      ],
      commodity: 'Ground Nut',
      quantityMt: 20,
      totalAmountInr: 1500000,
      sellerCreditPeriodDays: null,
      sellerCreditStartDate: '',
      sellerDueDate: '',
      buyerCreditPeriodDays: null,
      buyerCreditStartDate: '',
      buyerDueDate: '',
      remarks: 'Forward contract booked for Feb 2027 execution at ₹75/kg',
      status: 'On Hold',
      currentVersion: 1,
      amendmentStatus: 'None',
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-20 11:30',
      updatedAt: '2026-11-20 11:30',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-20 11:30',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: 'Forward contract booked',
          changes: [
            { field: 'Sauda Type', oldValue: '-', newValue: 'Forward' },
            { field: 'Due Date', oldValue: '-', newValue: '2027-02-20' },
          ],
        },
      ],
    },
    {
      id: 'SAU-2026-0009',
      saudaNo: 'SAU-2026-0009',
      saudaDate: '2026-11-10',
      saudaType: 'Sales',
      clientFirm: 'Desert Fresh Traders',
      sellerName: 'Desert Fresh Traders',
      buyerName: 'Marwar Agro Retailers',
      partyName: 'Marwar Agro Retailers',
      warehouseId: 'WH-001',
      warehouseName: 'Desert Mandi Yard A',
      godownName: 'Godown 1 (North Block)',
      chamberName: 'Chamber 1',
      stackNumber: 'Stack No. 101',
      commodityItems: [
        {
          commodity: 'Wheat',
          packagingUom: 'Bag',
          packagingQty: 100,
          weightUom: 'MT',
          actualWeight: 5,
          rate: 26,
          lineTotal: 130000,
        },
      ],
      commodity: 'Wheat',
      quantityMt: 5,
      totalAmountInr: 130000,
      sellerCreditPeriodDays: null,
      sellerCreditStartDate: '',
      sellerDueDate: '',
      buyerCreditPeriodDays: 10,
      buyerCreditStartDate: '2026-11-10',
      buyerDueDate: '2026-11-20',
      remarks: 'Sales wholesale contract (5 Ton total, multiple outward trucks scheduled)',
      status: 'Partial',
      currentVersion: 1,
      amendmentStatus: 'None',
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-10 10:00',
      updatedAt: '2026-11-10 10:00',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-10 10:00',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: 'Sales deal booked with Marwar Agro Retailers',
          changes: [
            { field: 'Commodities', oldValue: '-', newValue: 'Wheat (5 Ton)' },
            { field: 'Total Amount', oldValue: '-', newValue: '₹1,30,000' },
          ],
        },
      ],
    },
  ];

  private readonly initialTrucks: TruckEntryRecord[] = [
    // ── INWARD (Purchase) Deal 1: SAU-2026-0001 (5 Ton total: 1 Ton + 3 Ton + 1 Ton = 5 Ton Completed) ──
    {
      id: 'TRK-2026-0001',
      entryNo: 'TRK-2026-0001',
      saudaId: 'SAU-2026-0001',
      saudaNo: 'SAU-2026-0001',
      saudaType: 'Purchase',
      partyName: 'Sharma Grain Traders',
      warehouse: 'Desert Mandi Yard A',
      warehouseId: 'WH-001',
      godownName: 'Godown 1 (North Block)',
      chamberName: 'Chamber 1',
      stackNumber: 'Stack No. 101',
      vehicleNo: 'RJ07-GA-1234',
      commodityItems: [
        {
          commodity: 'Bajra',
          packagingUom: 'Bag',
          packagingQty: 20,
          weightUom: 'MT',
          actualWeight: 1.0,
        },
      ],
      commodities: 'Bajra',
      loadedQtyMt: 1.0,
      freightRatePerMt: 1100,
      advancePaid: 0,
      dispatchDate: '2026-11-04',
      expectedArrivalDate: '2026-11-04',
      status: 'Delivered',
      remarks: '1st inward truck lot (1 Ton received)',
      currentVersion: 1,
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-04 14:00',
      updatedAt: '2026-11-04 14:00',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-04 14:00',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: 'Initial truck entry linked to SAU-2026-0001',
          changes: [
            { field: 'Truck Number', oldValue: '-', newValue: 'RJ07-GA-1234' },
            { field: 'Loaded Weight', oldValue: '-', newValue: '1.00 MT' },
          ],
        },
      ],
    },
    {
      id: 'TRK-2026-0002',
      entryNo: 'TRK-2026-0002',
      saudaId: 'SAU-2026-0001',
      saudaNo: 'SAU-2026-0001',
      saudaType: 'Purchase',
      partyName: 'Sharma Grain Traders',
      warehouse: 'Desert Mandi Yard A',
      warehouseId: 'WH-001',
      godownName: 'Godown 1 (North Block)',
      chamberName: 'Chamber 1',
      stackNumber: 'Stack No. 102',
      vehicleNo: 'RJ19-EA-5566',
      commodityItems: [
        {
          commodity: 'Bajra',
          packagingUom: 'Bag',
          packagingQty: 60,
          weightUom: 'MT',
          actualWeight: 3.0,
        },
      ],
      commodities: 'Bajra',
      loadedQtyMt: 3.0,
      freightRatePerMt: 1100,
      advancePaid: 0,
      dispatchDate: '2026-11-06',
      expectedArrivalDate: '2026-11-06',
      status: 'Delivered',
      remarks: '2nd inward truck lot (3 Ton received)',
      currentVersion: 1,
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-06 11:30',
      updatedAt: '2026-11-06 11:30',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-06 11:30',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: 'Second truck entry linked to SAU-2026-0001',
          changes: [
            { field: 'Truck Number', oldValue: '-', newValue: 'RJ19-EA-5566' },
            { field: 'Loaded Weight', oldValue: '-', newValue: '3.00 MT' },
          ],
        },
      ],
    },
    {
      id: 'TRK-2026-0003',
      entryNo: 'TRK-2026-0003',
      saudaId: 'SAU-2026-0001',
      saudaNo: 'SAU-2026-0001',
      saudaType: 'Purchase',
      partyName: 'Sharma Grain Traders',
      warehouse: 'Desert Mandi Yard A',
      warehouseId: 'WH-001',
      godownName: 'Godown 1 (North Block)',
      chamberName: 'Chamber 1',
      stackNumber: 'Stack No. 103',
      vehicleNo: 'RJ14-XY-9900',
      commodityItems: [
        {
          commodity: 'Bajra',
          packagingUom: 'Bag',
          packagingQty: 20,
          weightUom: 'MT',
          actualWeight: 1.0,
        },
      ],
      commodities: 'Bajra',
      loadedQtyMt: 1.0,
      freightRatePerMt: 1100,
      advancePaid: 0,
      dispatchDate: '2026-11-08',
      expectedArrivalDate: '2026-11-08',
      status: 'Delivered',
      isFinalSubmit: true,
      remarks: '3rd and final inward truck (1 Ton received, deal completed 5/5 Ton)',
      currentVersion: 1,
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-08 16:00',
      updatedAt: '2026-11-08 16:00',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-08 16:00',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: 'Final truck entry for SAU-2026-0001 (Completed)',
          changes: [
            { field: 'Truck Number', oldValue: '-', newValue: 'RJ14-XY-9900' },
            { field: 'Loaded Weight', oldValue: '-', newValue: '1.00 MT' },
          ],
        },
      ],
    },

    // ── INWARD (Purchase) Deal 2: SAU-2026-0004 (5 Ton total: 1.5 + 1.5 = 3 Ton in, 2 Ton Remaining!) ──
    {
      id: 'TRK-2026-0004',
      entryNo: 'TRK-2026-0004',
      saudaId: 'SAU-2026-0004',
      saudaNo: 'SAU-2026-0004',
      saudaType: 'Purchase',
      partyName: 'Om Traders',
      warehouse: 'Desert Mandi Yard A',
      warehouseId: 'WH-001',
      godownName: 'Godown 1 (North Block)',
      chamberName: 'Chamber 1',
      stackNumber: 'Stack No. 101',
      vehicleNo: 'RJ07-PB-2211',
      commodityItems: [
        {
          commodity: 'Maize',
          packagingUom: 'Bag',
          packagingQty: 30,
          weightUom: 'MT',
          actualWeight: 1.5,
        },
      ],
      commodities: 'Maize',
      loadedQtyMt: 1.5,
      freightRatePerMt: 1100,
      advancePaid: 0,
      dispatchDate: '2026-11-09',
      expectedArrivalDate: '2026-11-09',
      status: 'Delivered',
      remarks: '1st inward maize truck (1.5 Ton received)',
      currentVersion: 1,
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-09 10:30',
      updatedAt: '2026-11-09 10:30',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-09 10:30',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: '1st truck entry for SAU-2026-0004',
          changes: [
            { field: 'Truck Number', oldValue: '-', newValue: 'RJ07-PB-2211' },
            { field: 'Loaded Weight', oldValue: '-', newValue: '1.50 MT' },
          ],
        },
      ],
    },
    {
      id: 'TRK-2026-0005',
      entryNo: 'TRK-2026-0005',
      saudaId: 'SAU-2026-0004',
      saudaNo: 'SAU-2026-0004',
      saudaType: 'Purchase',
      partyName: 'Om Traders',
      warehouse: 'Desert Mandi Yard A',
      warehouseId: 'WH-001',
      godownName: 'Godown 1 (North Block)',
      chamberName: 'Chamber 1',
      stackNumber: 'Stack No. 102',
      vehicleNo: 'RJ07-PB-3344',
      commodityItems: [
        {
          commodity: 'Maize',
          packagingUom: 'Bag',
          packagingQty: 30,
          weightUom: 'MT',
          actualWeight: 1.5,
        },
      ],
      commodities: 'Maize',
      loadedQtyMt: 1.5,
      freightRatePerMt: 1100,
      advancePaid: 0,
      dispatchDate: '2026-11-11',
      expectedArrivalDate: '2026-11-11',
      status: 'Delivered',
      remarks: '2nd inward maize truck (1.5 Ton received, 2 Ton still pending)',
      currentVersion: 1,
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-11 15:45',
      updatedAt: '2026-11-11 15:45',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-11 15:45',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: '2nd truck entry for SAU-2026-0004',
          changes: [
            { field: 'Truck Number', oldValue: '-', newValue: 'RJ07-PB-3344' },
            { field: 'Loaded Weight', oldValue: '-', newValue: '1.50 MT' },
          ],
        },
      ],
    },

    // ── OUTWARD (Sales) Deal 3: SAU-2026-0002 (5 Ton total: 1 Ton + 3 Ton + 1 Ton = 5 Ton Completed) ──
    {
      id: 'TRK-2026-0006',
      entryNo: 'TRK-2026-0006',
      saudaId: 'SAU-2026-0002',
      saudaNo: 'SAU-2026-0002',
      saudaType: 'Sales',
      partyName: 'City Wholesale Market',
      warehouse: 'Desert Mandi Yard A',
      warehouseId: 'WH-001',
      godownName: 'Godown 1 (North Block)',
      chamberName: 'Chamber 1',
      stackNumber: 'Stack No. 101',
      vehicleNo: 'RJ14-AB-1111',
      commodityItems: [
        {
          commodity: 'Wheat',
          packagingUom: 'Bag',
          packagingQty: 20,
          weightUom: 'MT',
          actualWeight: 1.0,
        },
      ],
      commodities: 'Wheat',
      loadedQtyMt: 1.0,
      freightRatePerMt: 1200,
      advancePaid: 0,
      dispatchDate: '2026-11-05',
      expectedArrivalDate: '2026-11-05',
      status: 'Delivered',
      remarks: '1st outward wheat dispatch (1 Ton)',
      currentVersion: 1,
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-05 16:30',
      updatedAt: '2026-11-05 16:30',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-05 16:30',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: '1st dispatch for SAU-2026-0002',
          changes: [
            { field: 'Truck Number', oldValue: '-', newValue: 'RJ14-AB-1111' },
            { field: 'Loaded Weight', oldValue: '-', newValue: '1.00 MT' },
          ],
        },
      ],
    },
    {
      id: 'TRK-2026-0007',
      entryNo: 'TRK-2026-0007',
      saudaId: 'SAU-2026-0002',
      saudaNo: 'SAU-2026-0002',
      saudaType: 'Sales',
      partyName: 'City Wholesale Market',
      warehouse: 'Desert Mandi Yard A',
      warehouseId: 'WH-001',
      godownName: 'Godown 1 (North Block)',
      chamberName: 'Chamber 1',
      stackNumber: 'Stack No. 102',
      vehicleNo: 'RJ14-AB-2222',
      commodityItems: [
        {
          commodity: 'Wheat',
          packagingUom: 'Bag',
          packagingQty: 60,
          weightUom: 'MT',
          actualWeight: 3.0,
        },
      ],
      commodities: 'Wheat',
      loadedQtyMt: 3.0,
      freightRatePerMt: 1200,
      advancePaid: 0,
      dispatchDate: '2026-11-07',
      expectedArrivalDate: '2026-11-07',
      status: 'Delivered',
      remarks: '2nd outward wheat dispatch (3 Ton)',
      currentVersion: 1,
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-07 14:15',
      updatedAt: '2026-11-07 14:15',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-07 14:15',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: '2nd dispatch for SAU-2026-0002',
          changes: [
            { field: 'Truck Number', oldValue: '-', newValue: 'RJ14-AB-2222' },
            { field: 'Loaded Weight', oldValue: '-', newValue: '3.00 MT' },
          ],
        },
      ],
    },
    {
      id: 'TRK-2026-0008',
      entryNo: 'TRK-2026-0008',
      saudaId: 'SAU-2026-0002',
      saudaNo: 'SAU-2026-0002',
      saudaType: 'Sales',
      partyName: 'City Wholesale Market',
      warehouse: 'Desert Mandi Yard A',
      warehouseId: 'WH-001',
      godownName: 'Godown 1 (North Block)',
      chamberName: 'Chamber 1',
      stackNumber: 'Stack No. 103',
      vehicleNo: 'RJ14-AB-3333',
      commodityItems: [
        {
          commodity: 'Wheat',
          packagingUom: 'Bag',
          packagingQty: 20,
          weightUom: 'MT',
          actualWeight: 1.0,
        },
      ],
      commodities: 'Wheat',
      loadedQtyMt: 1.0,
      freightRatePerMt: 1200,
      advancePaid: 0,
      dispatchDate: '2026-11-09',
      expectedArrivalDate: '2026-11-09',
      status: 'Delivered',
      isFinalSubmit: true,
      remarks: '3rd and final outward wheat dispatch (1 Ton, deal completed 5/5 Ton)',
      currentVersion: 1,
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-09 17:00',
      updatedAt: '2026-11-09 17:00',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-09 17:00',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: 'Final dispatch for SAU-2026-0002 (Completed)',
          changes: [
            { field: 'Truck Number', oldValue: '-', newValue: 'RJ14-AB-3333' },
            { field: 'Loaded Weight', oldValue: '-', newValue: '1.00 MT' },
          ],
        },
      ],
    },

    // ── OUTWARD (Sales) Deal 4: SAU-2026-0009 (5 Ton total: 1.5 + 1.5 = 3 Ton out, 2 Ton Remaining!) ──
    {
      id: 'TRK-2026-0009',
      entryNo: 'TRK-2026-0009',
      saudaId: 'SAU-2026-0009',
      saudaNo: 'SAU-2026-0009',
      saudaType: 'Sales',
      partyName: 'Marwar Agro Retailers',
      warehouse: 'Desert Mandi Yard A',
      warehouseId: 'WH-001',
      godownName: 'Godown 1 (North Block)',
      chamberName: 'Chamber 1',
      stackNumber: 'Stack No. 101',
      vehicleNo: 'RJ20-GB-4455',
      commodityItems: [
        {
          commodity: 'Wheat',
          packagingUom: 'Bag',
          packagingQty: 30,
          weightUom: 'MT',
          actualWeight: 1.5,
        },
      ],
      commodities: 'Wheat',
      loadedQtyMt: 1.5,
      freightRatePerMt: 1150,
      advancePaid: 0,
      dispatchDate: '2026-11-10',
      expectedArrivalDate: '2026-11-10',
      status: 'Delivered',
      remarks: '1st outward wheat dispatch to Marwar Agro Retailers (1.5 Ton)',
      currentVersion: 1,
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-10 11:00',
      updatedAt: '2026-11-10 11:00',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-10 11:00',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: '1st dispatch for SAU-2026-0009',
          changes: [
            { field: 'Truck Number', oldValue: '-', newValue: 'RJ20-GB-4455' },
            { field: 'Loaded Weight', oldValue: '-', newValue: '1.50 MT' },
          ],
        },
      ],
    },
    {
      id: 'TRK-2026-0010',
      entryNo: 'TRK-2026-0010',
      saudaId: 'SAU-2026-0009',
      saudaNo: 'SAU-2026-0009',
      saudaType: 'Sales',
      partyName: 'Marwar Agro Retailers',
      warehouse: 'Desert Mandi Yard A',
      warehouseId: 'WH-001',
      godownName: 'Godown 1 (North Block)',
      chamberName: 'Chamber 1',
      stackNumber: 'Stack No. 102',
      vehicleNo: 'RJ20-GB-6677',
      commodityItems: [
        {
          commodity: 'Wheat',
          packagingUom: 'Bag',
          packagingQty: 30,
          weightUom: 'MT',
          actualWeight: 1.5,
        },
      ],
      commodities: 'Wheat',
      loadedQtyMt: 1.5,
      freightRatePerMt: 1150,
      advancePaid: 0,
      dispatchDate: '2026-11-12',
      expectedArrivalDate: '2026-11-12',
      status: 'Delivered',
      remarks: '2nd outward wheat dispatch (1.5 Ton, 2 Ton still pending)',
      currentVersion: 1,
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-12 16:30',
      updatedAt: '2026-11-12 16:30',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-12 16:30',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: '2nd dispatch for SAU-2026-0009',
          changes: [
            { field: 'Truck Number', oldValue: '-', newValue: 'RJ20-GB-6677' },
            { field: 'Loaded Weight', oldValue: '-', newValue: '1.50 MT' },
          ],
        },
      ],
    },
  ];

  private readonly initialFirms: FirmRecord[] = [
    {
      id: 'FRM-001',
      name: 'Desert Fresh Traders',
      email: 'contact@desertfresh.com',
      whatsappNumber: '9829012345',
      isActive: true,
      createdAt: '2026-11-01 09:30',
      updatedAt: '2026-11-01 09:30',
    },
    {
      id: 'FRM-002',
      name: 'Rajasthan Agro',
      email: 'sales@rajasthanagro.in',
      whatsappNumber: '9829023456',
      isActive: true,
      createdAt: '2026-11-02 11:15',
      updatedAt: '2026-11-02 11:15',
    },
    {
      id: 'FRM-003',
      name: 'Shree Ganesh Agro Mills',
      email: 'info@shreeganeshagro.com',
      whatsappNumber: '9829034567',
      isActive: true,
      createdAt: '2026-11-04 14:20',
      updatedAt: '2026-11-04 14:20',
    },
    {
      id: 'FRM-004',
      name: 'Kisan Krishi Mandi Samiti',
      email: 'kisan@mandisamiti.org',
      whatsappNumber: '9829045678',
      isActive: true,
      createdAt: '2026-11-05 16:40',
      updatedAt: '2026-11-05 16:40',
    },
    {
      id: 'FRM-005',
      name: 'Om Sai Traders Kota',
      email: 'omsai.kota@traders.com',
      whatsappNumber: '9829056789',
      isActive: false,
      createdAt: '2026-11-06 10:05',
      updatedAt: '2026-11-08 17:10',
    },
  ];

  private readonly initialSellers: SellerRecord[] = [
    {
      id: 'SEL-001',
      name: 'Sharma Grain Traders',
      phone: '9829100112',
      email: 'sharma.grains@gmail.com',
      defaultCreditDays: 15,
      isActive: true,
      createdAt: '2026-11-01 10:00',
      updatedAt: '2026-11-01 10:00',
    },
    {
      id: 'SEL-002',
      name: 'Jai Kisan Suppliers',
      phone: '9828033445',
      email: 'jaikisan.agro@gmail.com',
      defaultCreditDays: 10,
      isActive: true,
      createdAt: '2026-11-02 11:20',
      updatedAt: '2026-11-02 11:20',
    },
    {
      id: 'SEL-003',
      name: 'Om Traders',
      phone: '9414122334',
      email: 'omtraders.mandi@gmail.com',
      defaultCreditDays: 30,
      isActive: true,
      createdAt: '2026-11-03 09:45',
      updatedAt: '2026-11-03 09:45',
    },
    {
      id: 'SEL-004',
      name: 'Kota Krishi Traders',
      phone: '9784511223',
      email: 'kotakrishi@yahoo.com',
      defaultCreditDays: 7,
      isActive: true,
      createdAt: '2026-11-04 12:15',
      updatedAt: '2026-11-04 12:15',
    },
    {
      id: 'SEL-005',
      name: 'Bikaner Agro Farms',
      phone: '9929055667',
      email: 'bikaner.agro@gmail.com',
      defaultCreditDays: null,
      isActive: false,
      createdAt: '2026-11-05 16:00',
      updatedAt: '2026-11-06 18:10',
    },
  ];

  private readonly initialBuyers: BuyerRecord[] = [
    {
      id: 'BUY-001',
      name: 'City Wholesale Market',
      phone: '9829200441',
      email: 'citywholesale@gmail.com',
      defaultCreditDays: 7,
      isActive: true,
      createdAt: '2026-11-01 10:30',
      updatedAt: '2026-11-01 10:30',
    },
    {
      id: 'BUY-002',
      name: 'Fresh Mart',
      phone: '9828199887',
      email: 'freshmart.orders@gmail.com',
      defaultCreditDays: 15,
      isActive: true,
      createdAt: '2026-11-02 14:10',
      updatedAt: '2026-11-02 14:10',
    },
    {
      id: 'BUY-003',
      name: 'Metro Fresh Retail',
      phone: '9950177889',
      email: 'metrofresh@retail.in',
      defaultCreditDays: 14,
      isActive: true,
      createdAt: '2026-11-03 11:00',
      updatedAt: '2026-11-03 11:00',
    },
    {
      id: 'BUY-004',
      name: 'Jaipur Mandi Traders',
      phone: '9799011220',
      email: 'jaipurmandi@gmail.com',
      defaultCreditDays: 10,
      isActive: true,
      createdAt: '2026-11-04 15:20',
      updatedAt: '2026-11-04 15:20',
    },
    {
      id: 'BUY-005',
      name: 'Bharat Cold Storage',
      phone: '9414288990',
      email: 'bharatcoldstorage@gmail.com',
      defaultCreditDays: null,
      isActive: false,
      createdAt: '2026-11-05 17:05',
      updatedAt: '2026-11-07 10:00',
    },
  ];

  private readonly initialCommodities: CommodityRecord[] = [
    {
      id: 'CMD-001',
      name: 'Bajra',
      defaultPackagingUom: 'Bag',
      defaultWeightUom: 'Quintal',
      isActive: true,
      createdAt: '2026-11-01 09:00',
      updatedAt: '2026-11-01 09:00',
    },
    {
      id: 'CMD-002',
      name: 'Jowar',
      defaultPackagingUom: 'Bag',
      defaultWeightUom: 'Quintal',
      isActive: true,
      createdAt: '2026-11-01 09:05',
      updatedAt: '2026-11-01 09:05',
    },
    {
      id: 'CMD-003',
      name: 'Wheat',
      defaultPackagingUom: 'Bag',
      defaultWeightUom: 'Quintal',
      isActive: true,
      createdAt: '2026-11-01 09:10',
      updatedAt: '2026-11-01 09:10',
    },
    {
      id: 'CMD-004',
      name: 'Maize',
      defaultPackagingUom: 'Sack',
      defaultWeightUom: 'Quintal',
      isActive: true,
      createdAt: '2026-11-01 09:15',
      updatedAt: '2026-11-01 09:15',
    },
    {
      id: 'CMD-005',
      name: 'Ragi',
      defaultPackagingUom: 'Bag',
      defaultWeightUom: 'Quintal',
      isActive: true,
      createdAt: '2026-11-02 10:00',
      updatedAt: '2026-11-02 10:00',
    },
    {
      id: 'CMD-006',
      name: 'Kangni',
      defaultPackagingUom: 'Bag',
      defaultWeightUom: 'Quintal',
      isActive: true,
      createdAt: '2026-11-02 10:15',
      updatedAt: '2026-11-02 10:15',
    },
    {
      id: 'CMD-007',
      name: 'Sanwa',
      defaultPackagingUom: 'Bag',
      defaultWeightUom: 'Quintal',
      isActive: true,
      createdAt: '2026-11-03 11:00',
      updatedAt: '2026-11-03 11:00',
    },
  ];

  private readonly initialInventory: InventoryRecord[] = [
    {
      id: 'INV-001',
      warehouseId: 'WH-001',
      warehouseName: 'Desert Mandi Yard A',
      isActiveWarehouse: true,
      productId: 'PRD-001',
      productName: 'Desi Hybrid Bajra',
      categoryId: 'CAT-001',
      categoryName: 'Millets (Shree Anna)',
      subCategoryName: 'Major Millets (Bajra, Jowar, Ragi)',
      commodity: 'Bajra',
      clientFirm: 'Desert Fresh Traders',
      packagingUom: 'Bag',
      availableUnits: 190,
      availableWeightMt: 3.8,
      averageWeightKg: 20,
      minThresholdMt: 2,
      lastUpdated: '2026-11-06 17:45',
      logs: [
        {
          id: 'LOG-101',
          date: '2026-11-05 15:10',
          action: 'Stock In',
          referenceNo: 'TRK-2026-0001',
          unitsChange: 40,
          weightMtChange: 0.8,
          remarks: 'Inward receipt against SAU-2026-0001 (Sharma Grain Traders)',
          doneBy: 'Sauda Admin',
        },
        {
          id: 'LOG-102',
          date: '2026-11-06 17:45',
          action: 'Stock In',
          referenceNo: 'TRK-2026-0002',
          unitsChange: 150,
          weightMtChange: 3,
          remarks: 'Mandi warehouse inward lot against SAU-2026-0001',
          doneBy: 'Sauda Admin',
        },
      ],
    },
    {
      id: 'INV-002',
      warehouseId: 'WH-001',
      warehouseName: 'Desert Mandi Yard A',
      isActiveWarehouse: true,
      productId: 'PRD-002',
      productName: 'Maldandi White Jowar',
      categoryId: 'CAT-001',
      categoryName: 'Millets (Shree Anna)',
      subCategoryName: 'Major Millets (Bajra, Jowar, Ragi)',
      commodity: 'Jowar',
      clientFirm: 'Desert Fresh Traders',
      packagingUom: 'Bag',
      availableUnits: 50,
      availableWeightMt: 1,
      averageWeightKg: 20,
      minThresholdMt: 1.5,
      lastUpdated: '2026-11-06 17:45',
      logs: [
        {
          id: 'LOG-103',
          date: '2026-11-06 17:45',
          action: 'Stock In',
          referenceNo: 'TRK-2026-0002',
          unitsChange: 50,
          weightMtChange: 1,
          remarks: 'Inward bags received from SAU-2026-0001',
          doneBy: 'Sauda Admin',
        },
      ],
    },
    {
      id: 'INV-003',
      warehouseId: 'WH-001',
      warehouseName: 'Desert Mandi Yard A',
      isActiveWarehouse: true,
      productId: 'PRD-003',
      productName: 'Lokwan Sharbati Wheat',
      categoryId: 'CAT-002',
      categoryName: 'Food Grains & Cereals',
      subCategoryName: 'Wheat & Barley',
      commodity: 'Wheat',
      clientFirm: 'Desert Fresh Traders',
      packagingUom: 'Bag',
      availableUnits: 0,
      availableWeightMt: 0,
      averageWeightKg: 0,
      minThresholdMt: 2,
      lastUpdated: '2026-11-09 16:00',
      logs: [
        {
          id: 'LOG-104',
          date: '2026-11-05 11:40',
          action: 'Stock In',
          referenceNo: 'OPENING-STK',
          unitsChange: 100,
          weightMtChange: 5,
          remarks: 'Opening warehouse stock',
          doneBy: 'Sauda Admin',
        },
        {
          id: 'LOG-105',
          date: '2026-11-09 16:00',
          action: 'Stock Out',
          referenceNo: 'TRK-2026-0003',
          unitsChange: -100,
          weightMtChange: -5,
          remarks: 'Delivered to City Wholesale Market (SAU-2026-0002)',
          doneBy: 'Sauda Admin',
        },
      ],
    },
    {
      id: 'INV-004',
      warehouseId: 'WH-003',
      warehouseName: 'Rajasthan Agro Godown 4',
      isActiveWarehouse: true,
      productId: 'PRD-001',
      productName: 'Desi Hybrid Bajra',
      categoryId: 'CAT-001',
      categoryName: 'Millets (Shree Anna)',
      subCategoryName: 'Major Millets (Bajra, Jowar, Ragi)',
      commodity: 'Bajra',
      clientFirm: 'Rajasthan Agro',
      packagingUom: 'Bag',
      availableUnits: 200,
      availableWeightMt: 4,
      averageWeightKg: 20,
      minThresholdMt: 2,
      lastUpdated: '2026-11-08 18:10',
      logs: [
        {
          id: 'LOG-106',
          date: '2026-11-08 18:10',
          action: 'Stock In',
          referenceNo: 'TRK-2026-0004',
          unitsChange: 200,
          weightMtChange: 4,
          remarks: 'Direct Sale transit stock against SAU-2026-0003',
          doneBy: 'Sauda Admin',
        },
      ],
    },
    {
      id: 'INV-005',
      warehouseId: 'WH-003',
      warehouseName: 'Rajasthan Agro Godown 4',
      isActiveWarehouse: true,
      productId: 'PRD-004',
      productName: 'Yellow Field Maize',
      categoryId: 'CAT-002',
      categoryName: 'Food Grains & Cereals',
      subCategoryName: 'Corn & Maize',
      commodity: 'Maize',
      clientFirm: 'Rajasthan Agro',
      packagingUom: 'Sack',
      availableUnits: 120,
      availableWeightMt: 6,
      averageWeightKg: 50,
      minThresholdMt: 2,
      lastUpdated: '2026-11-07 12:00',
      logs: [
        {
          id: 'LOG-107',
          date: '2026-11-07 12:00',
          action: 'Stock In',
          referenceNo: 'OPENING-STK',
          unitsChange: 120,
          weightMtChange: 6,
          remarks: 'Yellow Field Maize warehouse reserve',
          doneBy: 'Sauda Admin',
        },
      ],
    },
    {
      id: 'INV-006',
      warehouseId: 'WH-002',
      warehouseName: 'Fresh Terminal Cold Hub',
      isActiveWarehouse: true,
      productId: '',
      productName: 'Mustard Seeds',
      categoryId: '',
      categoryName: 'Oilseeds',
      subCategoryName: 'Mustard & Rapeseed',
      commodity: 'Mustard Seeds',
      clientFirm: 'Desert Fresh Traders',
      packagingUom: 'Bag',
      availableUnits: 150,
      availableWeightMt: 7.5,
      averageWeightKg: 50,
      minThresholdMt: 2,
      lastUpdated: '2026-11-10 11:30',
      logs: [
        {
          id: 'LOG-108',
          date: '2026-11-10 11:30',
          action: 'Stock In',
          referenceNo: 'OPENING-STK',
          unitsChange: 150,
          weightMtChange: 7.5,
          remarks: 'Cold hub initial stock deposit',
          doneBy: 'Sauda Admin',
        },
      ],
    },
    {
      id: 'INV-007',
      warehouseId: 'WH-004',
      warehouseName: 'Kota Grain Silo',
      isActiveWarehouse: true,
      productId: '',
      productName: 'Soybean Special',
      categoryId: '',
      categoryName: 'Oilseeds',
      subCategoryName: 'Soybean',
      commodity: 'Soybean',
      clientFirm: 'Desert Fresh Traders',
      packagingUom: 'Crate',
      availableUnits: 80,
      availableWeightMt: 4,
      averageWeightKg: 50,
      minThresholdMt: 1.5,
      lastUpdated: '2026-11-11 14:15',
      logs: [
        {
          id: 'LOG-109',
          date: '2026-11-11 14:15',
          action: 'Stock In',
          referenceNo: 'OPENING-STK',
          unitsChange: 80,
          weightMtChange: 4,
          remarks: 'Silo crates receipt',
          doneBy: 'Sauda Admin',
        },
      ],
    },
    {
      id: 'INV-008',
      warehouseId: 'WH-005',
      warehouseName: 'Mewar Agro Storage Yard',
      isActiveWarehouse: false,
      productId: '',
      productName: 'Desi Chana (Historical)',
      categoryId: 'CAT-003',
      categoryName: 'Pulses & Legumes',
      subCategoryName: 'Gram & Chickpeas',
      commodity: 'Desi Chana',
      clientFirm: 'Desert Fresh Traders',
      packagingUom: 'Bag',
      availableUnits: 0,
      availableWeightMt: 0,
      averageWeightKg: 0,
      minThresholdMt: 1,
      lastUpdated: '2026-10-20 10:00',
      logs: [],
    },
  ];

  private readonly initialStockAdjustments: StockAdjustmentRecord[] = [
    {
      id: 'ADJ-REC-001',
      adjNo: 'ADJ-2026-0001',
      clientFirm: 'Desert Fresh Traders',
      warehouseId: 'WH-001',
      warehouseName: 'Desert Mandi Yard A',
      isActiveWarehouse: true,
      commodity: 'Bajra',
      productId: 'PRD-001',
      productName: 'Desi Hybrid Bajra',
      adjustmentType: 'Increase',
      packagingUom: 'Bag',
      quantity: 20,
      totalWeightMt: 0.4,
      averageWeightKg: 20,
      reason: 'Physical mandi count found extra 20 bags from harvest shipment unrecorded in truck tally',
      adjustmentDate: '2026-11-12',
      submittedAt: '2026-11-12 11:30',
      makerRole: 'Operations Executive (Maker)',
      makerName: 'Amit Patel',
      status: 'Pending Approval',
    },
    {
      id: 'ADJ-REC-002',
      adjNo: 'ADJ-2026-0002',
      clientFirm: 'Rajasthan Agro',
      warehouseId: 'WH-003',
      warehouseName: 'Rajasthan Agro Godown 4',
      isActiveWarehouse: true,
      commodity: 'Maize',
      productId: 'PRD-004',
      productName: 'Yellow Field Maize',
      adjustmentType: 'Decrease',
      packagingUom: 'Sack',
      quantity: 10,
      totalWeightMt: 0.5,
      averageWeightKg: 50,
      reason: 'Damaged sacks written off due to roof seepage during unseasonal rain',
      adjustmentDate: '2026-11-09',
      submittedAt: '2026-11-09 10:15',
      makerRole: 'Operations Executive (Maker)',
      makerName: 'Suresh Meena',
      status: 'Approved',
      checkerRole: 'Business Owner / Admin (Checker)',
      checkerName: 'Rajesh Sharma',
      reviewedAt: '2026-11-09 14:00',
    },
    {
      id: 'ADJ-REC-003',
      adjNo: 'ADJ-2026-0003',
      clientFirm: 'Desert Fresh Traders',
      warehouseId: 'WH-001',
      warehouseName: 'Desert Mandi Yard A',
      isActiveWarehouse: true,
      commodity: 'Jowar',
      productId: 'PRD-002',
      productName: 'Maldandi White Jowar',
      adjustmentType: 'Decrease',
      packagingUom: 'Bag',
      quantity: 30,
      totalWeightMt: 0.6,
      averageWeightKg: 20,
      reason: 'Party claimed 30 bags short delivery without weighbridge slip',
      adjustmentDate: '2026-11-07',
      submittedAt: '2026-11-07 16:00',
      makerRole: 'Operations Executive (Maker)',
      makerName: 'Amit Patel',
      status: 'Rejected',
      checkerRole: 'Business Owner / Admin (Checker)',
      checkerName: 'Rajesh Sharma',
      reviewedAt: '2026-11-08 09:30',
      rejectionReason: 'Discrepancy rejected. Unverified by gate weighbridge operator. Dispatched truck LR matches billed count.',
    },
  ];

  private readonly initialStockMovements: StockMovementRecord[] = [
    {
      id: 'MOV-006',
      movementNo: 'MOV-2026-0006',
      movementType: 'Sales Dispatch',
      movementDirection: 'Stock Out',
      clientFirm: 'Desert Fresh Traders',
      warehouseName: 'Desert Mandi Yard A',
      commodity: 'Wheat',
      packagingUom: 'Bag',
      quantity: 100,
      totalWeightMt: 5,
      averageWeightKg: 50,
      sourceRef: 'SAU-2026-0002',
      truckNo: 'TRK-2026-0003',
      movementDate: '2026-11-09',
      recordedAt: '2026-11-09 16:00',
      recordedBy: 'Sauda Admin',
      stockBalanceUnitsAfter: 0,
      stockBalanceWeightMtAfter: 0,
    },
    {
      id: 'MOV-005',
      movementNo: 'MOV-2026-0005',
      movementType: 'Stock Adjustment',
      movementDirection: 'Stock Out',
      clientFirm: 'Rajasthan Agro',
      warehouseName: 'Rajasthan Agro Godown 4',
      commodity: 'Maize',
      packagingUom: 'Sack',
      quantity: 10,
      totalWeightMt: 0.5,
      averageWeightKg: 50,
      sourceRef: 'ADJ-2026-0002',
      movementDate: '2026-11-09',
      recordedAt: '2026-11-09 14:00',
      recordedBy: 'Rajesh Sharma',
      makerCheckerDetails: 'Maker: Suresh Meena | Checker: Rajesh Sharma',
      stockBalanceUnitsAfter: 120,
      stockBalanceWeightMtAfter: 6,
    },
    {
      id: 'MOV-004',
      movementNo: 'MOV-2026-0004',
      movementType: 'Purchase Receipt',
      movementDirection: 'Stock In',
      clientFirm: 'Rajasthan Agro',
      warehouseName: 'Rajasthan Agro Godown 4',
      commodity: 'Bajra',
      packagingUom: 'Bag',
      quantity: 200,
      totalWeightMt: 4,
      averageWeightKg: 20,
      sourceRef: 'SAU-2026-0003',
      truckNo: 'TRK-2026-0004',
      movementDate: '2026-11-08',
      recordedAt: '2026-11-08 18:10',
      recordedBy: 'Sauda Admin',
      stockBalanceUnitsAfter: 200,
      stockBalanceWeightMtAfter: 4,
    },
    {
      id: 'MOV-003',
      movementNo: 'MOV-2026-0003',
      movementType: 'Purchase Receipt',
      movementDirection: 'Stock In',
      clientFirm: 'Desert Fresh Traders',
      warehouseName: 'Desert Mandi Yard A',
      commodity: 'Jowar',
      packagingUom: 'Bag',
      quantity: 50,
      totalWeightMt: 1,
      averageWeightKg: 20,
      sourceRef: 'SAU-2026-0001',
      truckNo: 'TRK-2026-0002',
      movementDate: '2026-11-06',
      recordedAt: '2026-11-06 17:45',
      recordedBy: 'Sauda Admin',
      stockBalanceUnitsAfter: 50,
      stockBalanceWeightMtAfter: 1,
    },
    {
      id: 'MOV-002',
      movementNo: 'MOV-2026-0002',
      movementType: 'Purchase Receipt',
      movementDirection: 'Stock In',
      clientFirm: 'Desert Fresh Traders',
      warehouseName: 'Desert Mandi Yard A',
      commodity: 'Bajra',
      packagingUom: 'Bag',
      quantity: 150,
      totalWeightMt: 3,
      averageWeightKg: 20,
      sourceRef: 'SAU-2026-0001',
      truckNo: 'TRK-2026-0002',
      movementDate: '2026-11-06',
      recordedAt: '2026-11-06 17:45',
      recordedBy: 'Sauda Admin',
      stockBalanceUnitsAfter: 190,
      stockBalanceWeightMtAfter: 3.8,
    },
    {
      id: 'MOV-001',
      movementNo: 'MOV-2026-0001',
      movementType: 'Purchase Receipt',
      movementDirection: 'Stock In',
      clientFirm: 'Desert Fresh Traders',
      warehouseName: 'Desert Mandi Yard A',
      commodity: 'Bajra',
      packagingUom: 'Bag',
      quantity: 40,
      totalWeightMt: 0.8,
      averageWeightKg: 20,
      sourceRef: 'SAU-2026-0001',
      truckNo: 'TRK-2026-0001',
      movementDate: '2026-11-05',
      recordedAt: '2026-11-05 15:10',
      recordedBy: 'Sauda Admin',
      stockBalanceUnitsAfter: 40,
      stockBalanceWeightMtAfter: 0.8,
    },
  ];

  private readonly initialInvCategories: InvCategoryRecord[] = [
    {
      id: 'CAT-001',
      name: 'Millets (Shree Anna)',
      isActive: true,
      createdAt: '2026-11-01 09:00',
      updatedAt: '2026-11-01 09:00',
    },
    {
      id: 'CAT-002',
      name: 'Food Grains & Cereals',
      isActive: true,
      createdAt: '2026-11-01 09:10',
      updatedAt: '2026-11-01 09:10',
    },
    {
      id: 'CAT-003',
      name: 'Pulses & Legumes',
      isActive: true,
      createdAt: '2026-11-02 10:00',
      updatedAt: '2026-11-02 10:00',
    },
    {
      id: 'CAT-004',
      name: 'Packaging Materials',
      isActive: true,
      createdAt: '2026-11-02 10:30',
      updatedAt: '2026-11-02 10:30',
    },
  ];

  private readonly initialInvSubCategories: InvSubCategoryRecord[] = [
    {
      id: 'SUB-001',
      name: 'Major Millets (Bajra, Jowar, Ragi)',
      categoryId: 'CAT-001',
      isActive: true,
      createdAt: '2026-11-01 09:20',
      updatedAt: '2026-11-01 09:20',
    },
    {
      id: 'SUB-002',
      name: 'Minor Millets (Kangni, Sanwa, Kutki)',
      categoryId: 'CAT-001',
      isActive: true,
      createdAt: '2026-11-01 09:25',
      updatedAt: '2026-11-01 09:25',
    },
    {
      id: 'SUB-003',
      name: 'Wheat & Barley',
      categoryId: 'CAT-002',
      isActive: true,
      createdAt: '2026-11-01 09:30',
      updatedAt: '2026-11-01 09:30',
    },
    {
      id: 'SUB-004',
      name: 'Corn & Maize',
      categoryId: 'CAT-002',
      isActive: true,
      createdAt: '2026-11-02 10:15',
      updatedAt: '2026-11-02 10:15',
    },
    {
      id: 'SUB-005',
      name: 'Gunny & PP Bags',
      categoryId: 'CAT-004',
      isActive: true,
      createdAt: '2026-11-02 10:40',
      updatedAt: '2026-11-02 10:40',
    },
    {
      id: 'SUB-006',
      name: 'Jute Sacks',
      categoryId: 'CAT-004',
      isActive: true,
      createdAt: '2026-11-02 10:45',
      updatedAt: '2026-11-02 10:45',
    },
  ];

  private readonly initialInvProducts: InvProductRecord[] = [
    {
      id: 'PRD-001',
      name: 'Desi Hybrid Bajra',
      commodityName: 'Bajra',
      subCategoryId: 'SUB-001',
      packagingUom: 'Bag',
      weightUom: 'Quintal',
      minStock: 100,
      isActive: true,
      createdAt: '2026-11-03 10:00',
      updatedAt: '2026-11-03 10:00',
    },
    {
      id: 'PRD-002',
      name: 'Maldandi White Jowar',
      commodityName: 'Jowar',
      subCategoryId: 'SUB-001',
      packagingUom: 'Bag',
      weightUom: 'Quintal',
      minStock: 80,
      isActive: true,
      createdAt: '2026-11-03 10:15',
      updatedAt: '2026-11-03 10:15',
    },
    {
      id: 'PRD-003',
      name: 'Lokwan Sharbati Wheat',
      commodityName: 'Wheat',
      subCategoryId: 'SUB-003',
      packagingUom: 'Bag',
      weightUom: 'Quintal',
      minStock: 150,
      isActive: true,
      createdAt: '2026-11-03 10:30',
      updatedAt: '2026-11-03 10:30',
    },
    {
      id: 'PRD-004',
      name: 'Yellow Field Maize',
      commodityName: 'Maize',
      subCategoryId: 'SUB-004',
      packagingUom: 'Sack',
      weightUom: 'Quintal',
      minStock: 120,
      isActive: true,
      createdAt: '2026-11-03 10:45',
      updatedAt: '2026-11-03 10:45',
    },
    {
      id: 'PRD-005',
      name: 'Mandya Organic Ragi',
      commodityName: 'Ragi',
      subCategoryId: 'SUB-001',
      packagingUom: 'Bag',
      weightUom: 'Quintal',
      minStock: 60,
      isActive: true,
      createdAt: '2026-11-04 11:00',
      updatedAt: '2026-11-04 11:00',
    },
    {
      id: 'PRD-006',
      name: 'Kangni Foxtail Millet',
      commodityName: 'Kangni',
      subCategoryId: 'SUB-002',
      packagingUom: 'Bag',
      weightUom: 'Quintal',
      minStock: 50,
      isActive: true,
      createdAt: '2026-11-04 11:15',
      updatedAt: '2026-11-04 11:15',
    },
    {
      id: 'PRD-007',
      name: 'Sanwa Barnyard Millet',
      commodityName: 'Sanwa',
      subCategoryId: 'SUB-002',
      packagingUom: 'Bag',
      weightUom: 'Quintal',
      minStock: 40,
      isActive: true,
      createdAt: '2026-11-04 11:30',
      updatedAt: '2026-11-04 11:30',
    },
    {
      id: 'PRD-008',
      name: '50 Kg PP Woven Grain Bag',
      subCategoryId: 'SUB-005',
      packagingUom: 'Bag',
      weightUom: 'KG',
      minStock: 500,
      isActive: true,
      createdAt: '2026-11-04 11:45',
      updatedAt: '2026-11-04 11:45',
    },
  ];

  private readonly initialLedgerSettlements: LedgerSettlementRecord[] = [
    {
      id: 'TXN-2026-0001',
      date: '2026-11-06',
      partyName: 'Sharma Grain Traders',
      partyRole: 'Seller',
      clientFirm: 'Desert Fresh Traders',
      entryKind: 'Payment Paid',
      ledgerSide: 'Payable',
      amountInr: 60000,
      paymentMode: 'RTGS / NEFT',
      referenceNo: 'UTR-2611068841',
      saudaNo: 'SAU-2026-0001',
      remarks: 'Part payment released after initial Bajra bag receipts',
      recordedBy: 'Sauda Admin',
      createdAt: '2026-11-06 16:30',
    },
    {
      id: 'TXN-2026-0002',
      date: '2026-11-08',
      partyName: 'City Wholesale Market',
      partyRole: 'Buyer',
      clientFirm: 'Desert Fresh Traders',
      entryKind: 'Payment Received',
      ledgerSide: 'Receivable',
      amountInr: 45000,
      paymentMode: 'RTGS / NEFT',
      referenceNo: 'NEFT-994021',
      saudaNo: 'SAU-2026-0002',
      remarks: 'Part receipt against Wheat lot dispatch',
      recordedBy: 'Sauda Admin',
      createdAt: '2026-11-08 14:15',
    },
    {
      id: 'TXN-2026-0003',
      date: '2026-11-09',
      partyName: 'Om Traders',
      partyRole: 'Seller',
      clientFirm: 'Rajasthan Agro',
      entryKind: 'Payment Paid',
      ledgerSide: 'Payable',
      amountInr: 25000,
      paymentMode: 'Cheque',
      referenceNo: 'CHQ-408112',
      saudaNo: 'SAU-2026-0004',
      remarks: 'Booking advance paid for Maize Purchase Sauda',
      recordedBy: 'Sauda Admin',
      createdAt: '2026-11-09 12:10',
    },
  ];

  private readonly initialInvoices: InvoiceRecord[] = [
    {
      id: 'INV-2026-0001',
      invoiceNo: 'INV-2026-0001',
      invoiceDate: '2026-11-09',
      clientFirm: 'Desert Fresh Traders',
      partyName: 'City Wholesale Market',
      partyRole: 'Buyer',
      linkedSaudas: [
        {
          saudaId: 'SAU-2026-0002',
          saudaNo: 'SAU-2026-0002',
          saudaDate: '2026-11-05',
          saudaType: 'Sales',
          commodity: 'Wheat',
          quantityMt: 5,
          totalAmountInr: 125000,
        },
      ],
      originalCalculatedAmount: 125000,
      finalAmount: 125000,
      adjustmentAmount: 0,
      status: 'Paid',
      issuedBy: 'Amit Patel (Operations Executive)',
      issuedAt: '2026-11-09 10:00',
      paymentDetails: {
        id: 'PAY-2026-0001',
        invoiceId: 'INV-2026-0001',
        invoiceNo: 'INV-2026-0001',
        paymentDate: '2026-11-10',
        paymentAmount: 125000,
        paymentMode: 'RTGS / NEFT',
        paymentReferenceNo: 'UTR-20261110-881920',
        bankDetails: 'State Bank of India, Mandi Branch, A/c 3810029102',
        receiptAttachmentName: 'SBI_Settlement_Challan_881920.pdf',
        recordedBy: 'Rajesh Sharma (Admin)',
        recordedAt: '2026-11-10 14:30',
        remarks: 'Full settlement of Wheat Sales Sauda INV-2026-0001',
      },
      createdAt: '2026-11-09 10:00',
    },
    {
      id: 'INV-2026-0002',
      invoiceNo: 'INV-2026-0002',
      invoiceDate: '2026-11-12',
      clientFirm: 'Desert Fresh Traders',
      partyName: 'Sharma Grain Traders',
      partyRole: 'Seller',
      linkedSaudas: [
        {
          saudaId: 'SAU-2026-0001',
          saudaNo: 'SAU-2026-0001',
          saudaDate: '2026-11-04',
          saudaType: 'Purchase',
          commodity: 'Bajra, Jowar',
          quantityMt: 5,
          totalAmountInr: 150000,
        },
      ],
      originalCalculatedAmount: 150000,
      finalAmount: 148500,
      adjustmentAmount: -1500,
      adjustmentReason: 'Agreed moisture & cleaning deduction (-₹1,500) per mandi quality test',
      status: 'Issued',
      issuedBy: 'Amit Patel (Operations Executive)',
      issuedAt: '2026-11-12 11:30',
      createdAt: '2026-11-12 11:30',
    },
    {
      id: 'INV-2026-0003',
      invoiceNo: 'INV-2026-0003',
      invoiceDate: '2026-11-15',
      clientFirm: 'Rajasthan Agro',
      partyName: 'Om Traders',
      partyRole: 'Seller',
      linkedSaudas: [
        {
          saudaId: 'SAU-2026-0004',
          saudaNo: 'SAU-2026-0004',
          saudaDate: '2026-11-07',
          saudaType: 'Purchase',
          commodity: 'Maize',
          quantityMt: 5,
          totalAmountInr: 95000,
        },
      ],
      originalCalculatedAmount: 95000,
      finalAmount: 95000,
      adjustmentAmount: 0,
      status: 'Issued',
      issuedBy: 'Sauda Admin',
      issuedAt: '2026-11-15 14:00',
      createdAt: '2026-11-15 14:00',
    },
    {
      id: 'INV-2026-0004',
      invoiceNo: 'INV-2026-0004',
      invoiceDate: '2026-11-18',
      clientFirm: 'Desert Fresh Traders',
      partyName: 'Marwar Agro Retailers',
      partyRole: 'Buyer',
      linkedSaudas: [
        {
          saudaId: 'SAU-2026-0009',
          saudaNo: 'SAU-2026-0009',
          saudaDate: '2026-11-14',
          saudaType: 'Sales',
          commodity: 'Wheat',
          quantityMt: 5,
          totalAmountInr: 130000,
        },
      ],
      originalCalculatedAmount: 130000,
      finalAmount: 130000,
      adjustmentAmount: 0,
      status: 'Issued',
      issuedBy: 'Sauda Admin',
      issuedAt: '2026-11-18 16:30',
      createdAt: '2026-11-18 16:30',
    },
  ];

  private readonly initialJournalEntries: JournalEntryRecord[] = [
    {
      id: 'JRN-2026-0001',
      voucherNo: 'JRN-2026-0001',
      entryDate: '2026-11-16',
      buyerName: 'City Wholesale Market',
      sellerName: 'Sharma Grain Traders',
      invoiceNo: 'INV-2026-0002',
      invoiceId: 'INV-2026-0002',
      originalInvoicePendingAmount: 148500,
      dharamKanta: 500,
      mudat: 1200,
      labour: 800,
      claim: 0,
      brokerage: 1500,
      interest: 0,
      warehouseRent: 1000,
      tds: 150,
      other: 0,
      totalAdjustments: 5150,
      netPendingAmountAfter: 143350,
      narration: 'Weighbridge, mudat discount & godown rent deductions settled against Bajra Sauda.',
      recordedBy: 'Sauda Admin',
      createdAt: '2026-11-16 11:20',
    },
  ];

  private readonly initialPaymentEntries: PaymentEntryRecord[] = [
    {
      id: 'PAY-2026-0001',
      entryDate: '2026-11-01',
      voucherDetails: 'OPENING-BALANCE',
      receivedAmount: 500000,
      paymentAmount: 0,
      accountName: 'State Bank of India (Mandi Main Branch)',
      partyName: '',
      narration: 'Opening balance brought forward in Mandi Bank A/c',
      balanceAfter: 500000,
      recordedBy: 'Sauda Admin',
      createdAt: '2026-11-01 09:00',
    },
    {
      id: 'PAY-2026-0002',
      entryDate: '2026-11-06',
      voucherDetails: 'CHQ-778901',
      receivedAmount: 0,
      paymentAmount: 100000,
      accountName: 'Sharma Grain Traders',
      partyName: 'Sharma Grain Traders',
      narration: 'Advance payment towards Bajra consignment',
      balanceAfter: 400000,
      recordedBy: 'Sauda Admin',
      createdAt: '2026-11-06 15:40',
    },
    {
      id: 'PAY-2026-0003',
      entryDate: '2026-11-10',
      voucherDetails: 'UTR-20261110-881920',
      receivedAmount: 125000,
      paymentAmount: 0,
      accountName: 'City Wholesale Market',
      partyName: 'City Wholesale Market',
      narration: 'Full settlement received against Wheat Sales INV-2026-0001',
      balanceAfter: 525000,
      recordedBy: 'Sauda Admin',
      createdAt: '2026-11-10 14:30',
    },
    {
      id: 'PAY-2026-0004',
      entryDate: '2026-11-14',
      voucherDetails: 'VCH-CASH-0012',
      receivedAmount: 0,
      paymentAmount: 12500,
      accountName: 'Cash in Hand (Mandi Petty Cash)',
      partyName: 'Mandi Labour Union',
      narration: 'Hamali and unloader labour charges paid for 5 MT unloading',
      balanceAfter: 512500,
      recordedBy: 'Sauda Admin',
      createdAt: '2026-11-14 18:00',
    },
  ];

  private readonly initialPackagingUoms: PackagingUomRecord[] = [
    { id: 'PUOM-001', name: 'Bag', bagQuantity: 50, unit: 'Kg', isActive: true, createdAt: '2026-11-01 09:00', updatedAt: '2026-11-01 09:00' },
    { id: 'PUOM-002', name: 'Crate', bagQuantity: 20, unit: 'Kg', isActive: true, createdAt: '2026-11-01 09:05', updatedAt: '2026-11-01 09:05' },
    { id: 'PUOM-003', name: 'Box', bagQuantity: 25, unit: 'Kg', isActive: true, createdAt: '2026-11-01 09:10', updatedAt: '2026-11-01 09:10' },
    { id: 'PUOM-004', name: 'Carton', bagQuantity: 30, unit: 'Kg', isActive: true, createdAt: '2026-11-01 09:15', updatedAt: '2026-11-01 09:15' },
    { id: 'PUOM-005', name: 'Sack', bagQuantity: 100, unit: 'Kg', isActive: true, createdAt: '2026-11-01 09:20', updatedAt: '2026-11-01 09:20' },
    { id: 'PUOM-006', name: 'Loose', bagQuantity: 1, unit: 'Kg', isActive: true, createdAt: '2026-11-01 09:25', updatedAt: '2026-11-01 09:25' },
  ];

  private readonly initialWeightUoms: WeightUomRecord[] = [
    { id: 'WUOM-001', name: 'KG', isActive: true, createdAt: '2026-11-01 09:00', updatedAt: '2026-11-01 09:00' },
    { id: 'WUOM-002', name: 'Quintal', isActive: true, createdAt: '2026-11-01 09:05', updatedAt: '2026-11-01 09:05' },
    { id: 'WUOM-003', name: 'MT', isActive: true, createdAt: '2026-11-01 09:10', updatedAt: '2026-11-01 09:10' },
  ];

  private readonly initialWarehouses: WarehouseRecord[] = [
    {
      id: 'WH-001',
      name: 'Desert Mandi Yard A',
      clientFirm: 'Desert Fresh Traders',
      partyName: 'Sharma Grain Traders',
      address: 'Plot 12-15, Mandi Yard Phase 1, Basni Industrial Area',
      city: 'Jodhpur',
      contactPerson: 'Kailash Choudhary',
      contactPhone: '9829012345',
      remarks: 'Primary grains and pulses depot with 500 MT covered capacity',
      isActive: true,
      createdAt: '2026-11-01 10:00',
      createdBy: 'Business Owner / Admin',
      updatedAt: '2026-11-01 10:00',
      updatedBy: 'Business Owner / Admin',
    },
    {
      id: 'WH-002',
      name: 'Fresh Terminal Cold Hub',
      clientFirm: 'Desert Fresh Traders',
      partyName: 'Desert Fresh Traders',
      address: 'Warehouse No. 8, Agro Food Park, Sitapura Industrial Area',
      city: 'Jaipur',
      contactPerson: 'Mukesh Sharma',
      contactPhone: '9829023456',
      remarks: 'Cold storage facility with climate-controlled sheds for seeds & mustard',
      isActive: true,
      createdAt: '2026-11-01 10:15',
      createdBy: 'Business Owner / Admin',
      updatedAt: '2026-11-01 10:15',
      updatedBy: 'Business Owner / Admin',
    },
    {
      id: 'WH-003',
      name: 'Rajasthan Agro Godown 4',
      clientFirm: 'Rajasthan Agro',
      partyName: 'Rajasthan Agro Traders',
      address: 'Old Mandi Road, Near Railway Goods Yard, Karni Industrial Area',
      city: 'Bikaner',
      contactPerson: 'Rajendra Solanki',
      contactPhone: '9829034567',
      remarks: 'Heavy bulk commodity godown, direct rail connectivity',
      isActive: true,
      createdAt: '2026-11-01 10:30',
      createdBy: 'Business Owner / Admin',
      updatedAt: '2026-11-01 10:30',
      updatedBy: 'Business Owner / Admin',
    },
    {
      id: 'WH-004',
      name: 'Kota Grain Silo',
      clientFirm: 'Rajasthan Agro',
      partyName: 'Kota Grain Mandi Agency',
      address: 'Sector 5, RIICO Mandi Complex, Chambal Bypass Road',
      city: 'Kota',
      contactPerson: 'Deepak Meena',
      contactPhone: '9829045678',
      remarks: 'Bulk grain storage silos with automated weighbridge facility',
      isActive: true,
      createdAt: '2026-11-01 10:45',
      createdBy: 'Business Owner / Admin',
      updatedAt: '2026-11-01 10:45',
      updatedBy: 'Business Owner / Admin',
    },
    {
      id: 'WH-005',
      name: 'Mewar Agro Storage Yard',
      clientFirm: 'Desert Fresh Traders',
      partyName: 'Mewar Agro Supplies',
      address: 'Depot 3, Sukher Mandi Complex, NH-8',
      city: 'Udaipur',
      contactPerson: 'Bhawani Singh',
      contactPhone: '9829056789',
      remarks: 'Decommissioned storage yard undergoing renovation; currently empty',
      isActive: false,
      createdAt: '2026-10-15 11:00',
      createdBy: 'Business Owner / Admin',
      updatedAt: '2026-11-10 14:20',
      updatedBy: 'Business Owner / Admin',
    },
  ];

  private saudasSubject = new BehaviorSubject<SaudaRecord[]>(this.initialSaudas);
  private trucksSubject = new BehaviorSubject<TruckEntryRecord[]>(
    this.initialTrucks,
  );
  private firmsSubject = new BehaviorSubject<FirmRecord[]>(this.initialFirms);
  private sellersSubject = new BehaviorSubject<SellerRecord[]>(
    this.initialSellers,
  );
  private buyersSubject = new BehaviorSubject<BuyerRecord[]>(
    this.initialBuyers,
  );
  private commoditiesSubject = new BehaviorSubject<CommodityRecord[]>(
    this.initialCommodities,
  );
  private inventorySubject = new BehaviorSubject<InventoryRecord[]>(
    this.initialInventory,
  );
  private invCategoriesSubject = new BehaviorSubject<InvCategoryRecord[]>(
    this.initialInvCategories,
  );
  private invSubCategoriesSubject = new BehaviorSubject<InvSubCategoryRecord[]>(
    this.initialInvSubCategories,
  );
  private invProductsSubject = new BehaviorSubject<InvProductRecord[]>(
    this.initialInvProducts,
  );
  private ledgerSettlementsSubject = new BehaviorSubject<LedgerSettlementRecord[]>(
    this.initialLedgerSettlements,
  );
  private packagingUomsSubject = new BehaviorSubject<PackagingUomRecord[]>(
    this.initialPackagingUoms,
  );
  private weightUomsSubject = new BehaviorSubject<WeightUomRecord[]>(
    this.initialWeightUoms,
  );
  private readonly initialUsers: UserRecord[] = [
    {
      id: 'USR-001',
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@jpbrokers.com',
      mobile: '9829012345',
      userType: 'Business Owner / Admin',
      primaryFirm: 'Desert Fresh Traders, Rajasthan Agro, Shree Ganesh Agro Mills, Kisan Krishi Mandi Samiti',
      accountStatus: 'Active',
      passwordSetupStatus: 'Completed',
      createdBy: 'System Setup',
      createdAt: '2026-10-01 10:00',
      updatedBy: 'System Setup',
      updatedAt: '2026-10-01 10:00',
    },
    {
      id: 'USR-002',
      name: 'Vikram Singh',
      email: 'vikram.singh@jpbrokers.com',
      mobile: '9829023456',
      userType: 'Business Owner / Admin',
      primaryFirm: 'Desert Fresh Traders, Rajasthan Agro, Shree Ganesh Agro Mills, Kisan Krishi Mandi Samiti',
      accountStatus: 'Active',
      passwordSetupStatus: 'Completed',
      createdBy: 'Rajesh Sharma',
      createdAt: '2026-10-15 11:30',
      updatedBy: 'Rajesh Sharma',
      updatedAt: '2026-10-15 11:30',
    },
    {
      id: 'USR-003',
      name: 'Amit Patel',
      email: 'amit.patel@jpbrokers.com',
      mobile: '9829034567',
      userType: 'Operations Executive',
      primaryFirm: 'Desert Fresh Traders, Rajasthan Agro',
      accountStatus: 'Active',
      passwordSetupStatus: 'Completed',
      createdBy: 'Rajesh Sharma',
      createdAt: '2026-11-01 09:15',
      updatedBy: 'Rajesh Sharma',
      updatedAt: '2026-11-01 09:15',
    },
    {
      id: 'USR-004',
      name: 'Suresh Meena',
      email: 'suresh.meena@jpbrokers.com',
      mobile: '9829045678',
      userType: 'Operations Executive',
      primaryFirm: 'Rajasthan Agro, Shree Ganesh Agro Mills',
      accountStatus: 'Active',
      passwordSetupStatus: 'Pending',
      createdBy: 'Vikram Singh',
      createdAt: '2026-11-10 14:20',
      updatedBy: 'Vikram Singh',
      updatedAt: '2026-11-10 14:20',
    },
    {
      id: 'USR-005',
      name: 'Pooja Verma',
      email: 'pooja.verma@jpbrokers.com',
      mobile: '9829056789',
      userType: 'Operations Executive',
      primaryFirm: 'Desert Fresh Traders, Shree Ganesh Agro Mills',
      accountStatus: 'Inactive',
      passwordSetupStatus: 'Completed',
      createdBy: 'Rajesh Sharma',
      createdAt: '2026-10-20 16:45',
      updatedBy: 'Rajesh Sharma',
      updatedAt: '2026-11-05 10:10',
    },
  ];

  private readonly initialGodowns: GodownRecord[] = [
    {
      id: 'GD-001',
      warehouseId: 'WH-001',
      warehouseName: 'Desert Mandi Yard A',
      name: 'Godown 1',
      supervisor: 'Rameshwar Lal',
      supervisorPhone: '9829011122',
      capacityMt: 350,
      remarks: 'Primary covered godown for pulses and wheat stock',
      chambers: [
        {
          id: 'CH-01',
          name: 'Chamber A',
          capacityMt: 180,
          stackNumbers: ['Stack No. 101', 'Stack No. 102', 'Stack No. 103', 'Stack No. 104'],
        },
        {
          id: 'CH-02',
          name: 'Chamber B',
          capacityMt: 170,
          stackNumbers: ['Stack No. 105', 'Stack No. 106', 'Stack No. 110'],
        },
      ],
      isActive: true,
      createdAt: '2026-11-02 09:30',
      createdBy: 'Business Owner / Admin',
      updatedAt: '2026-11-02 09:30',
      updatedBy: 'Business Owner / Admin',
    },
    {
      id: 'GD-002',
      warehouseId: 'WH-001',
      warehouseName: 'Desert Mandi Yard A',
      name: 'Godown 2',
      supervisor: 'Suraj Mal',
      supervisorPhone: '9829033344',
      capacityMt: 250,
      remarks: 'Dry floor ventilated storage for mustard & guar seed',
      chambers: [
        {
          id: 'CH-01',
          name: 'Chamber 1',
          capacityMt: 130,
          stackNumbers: ['Stack No. 201', 'Stack No. 202', 'Stack No. 203'],
        },
        {
          id: 'CH-02',
          name: 'Chamber 2',
          capacityMt: 120,
          stackNumbers: ['Stack No. 204', 'Stack No. 205', 'Stack No. 208'],
        },
      ],
      isActive: true,
      createdAt: '2026-11-03 11:15',
      createdBy: 'Business Owner / Admin',
      updatedAt: '2026-11-03 11:15',
      updatedBy: 'Business Owner / Admin',
    },
    {
      id: 'GD-003',
      warehouseId: 'WH-002',
      warehouseName: 'Fresh Terminal Cold Hub',
      name: 'Central Cold Godown C-1',
      supervisor: 'Mukesh Sharma',
      supervisorPhone: '9829023456',
      capacityMt: 500,
      remarks: 'Insulated climate-controlled multi-chamber unit',
      chambers: [
        {
          id: 'CH-01',
          name: 'Chamber 1',
          capacityMt: 200,
          stackNumbers: ['Stack No. 301', 'Stack No. 302', 'Stack No. 303', 'Stack No. 304'],
        },
        {
          id: 'CH-02',
          name: 'Chamber 2',
          capacityMt: 150,
          stackNumbers: ['Stack No. 305', 'Stack No. 306', 'Stack No. 310'],
        },
        {
          id: 'CH-03',
          name: 'Chamber 3',
          capacityMt: 150,
          stackNumbers: ['Stack No. 311', 'Stack No. 312', 'Stack No. 315'],
        },
      ],
      isActive: true,
      createdAt: '2026-11-04 14:00',
      createdBy: 'Business Owner / Admin',
      updatedAt: '2026-11-04 14:00',
      updatedBy: 'Business Owner / Admin',
    },
    {
      id: 'GD-004',
      warehouseId: 'WH-003',
      warehouseName: 'Rajasthan Agro Godown 4',
      name: 'Transit Godown T4',
      supervisor: 'Rajendra Solanki',
      supervisorPhone: '9829034567',
      capacityMt: 150,
      remarks: 'Temporary staging & dispatch godown',
      chambers: [
        {
          id: 'CH-01',
          name: 'General Inward Bay',
          capacityMt: 80,
          stackNumbers: ['Stack No. 401', 'Stack No. 402'],
        },
        {
          id: 'CH-02',
          name: 'General Outward Bay',
          capacityMt: 70,
          stackNumbers: ['Stack No. 403', 'Stack No. 404'],
        },
      ],
      isActive: false,
      createdAt: '2026-11-05 16:30',
      createdBy: 'Business Owner / Admin',
      updatedAt: '2026-11-05 16:30',
      updatedBy: 'Business Owner / Admin',
    },
  ];

  private warehousesSubject = new BehaviorSubject<WarehouseRecord[]>(
    this.initialWarehouses,
  );
  private godownsSubject = new BehaviorSubject<GodownRecord[]>(
    this.initialGodowns,
  );
  private usersSubject = new BehaviorSubject<UserRecord[]>(this.initialUsers);
  private stockAdjustmentsSubject = new BehaviorSubject<StockAdjustmentRecord[]>(
    this.initialStockAdjustments,
  );
  private stockMovementsSubject = new BehaviorSubject<StockMovementRecord[]>(
    this.initialStockMovements,
  );
  private invoicesSubject = new BehaviorSubject<InvoiceRecord[]>(
    this.initialInvoices,
  );
  private journalEntriesSubject = new BehaviorSubject<JournalEntryRecord[]>(
    this.initialJournalEntries,
  );
  private paymentEntriesSubject = new BehaviorSubject<PaymentEntryRecord[]>(
    this.initialPaymentEntries,
  );

  readonly saudas$ = this.saudasSubject.asObservable();
  readonly trucks$ = this.trucksSubject.asObservable();
  readonly firms$ = this.firmsSubject.asObservable();
  readonly sellers$ = this.sellersSubject.asObservable();
  readonly buyers$ = this.buyersSubject.asObservable();
  readonly commodities$ = this.commoditiesSubject.asObservable();
  readonly inventory$ = this.inventorySubject.asObservable();
  readonly stockAdjustments$ = this.stockAdjustmentsSubject.asObservable();
  readonly stockMovements$ = this.stockMovementsSubject.asObservable();
  readonly invCategories$ = this.invCategoriesSubject.asObservable();
  readonly invSubCategories$ = this.invSubCategoriesSubject.asObservable();
  readonly invProducts$ = this.invProductsSubject.asObservable();
  readonly ledgerSettlements$ = this.ledgerSettlementsSubject.asObservable();
  readonly invoices$ = this.invoicesSubject.asObservable();
  readonly journalEntries$ = this.journalEntriesSubject.asObservable();
  readonly paymentEntries$ = this.paymentEntriesSubject.asObservable();
  readonly packagingUoms$ = this.packagingUomsSubject.asObservable();
  readonly weightUoms$ = this.weightUomsSubject.asObservable();
  readonly warehouses$ = this.warehousesSubject.asObservable();
  readonly godowns$ = this.godownsSubject.asObservable();
  readonly users$ = this.usersSubject.asObservable();

  constructor() {
    this.recomputeAllSaudaStatuses();
  }

  getGodownsSnapshot(): GodownRecord[] {
    return this.godownsSubject.value;
  }

  getSaudasSnapshot(): SaudaRecord[] {
    return this.saudasSubject.value;
  }

  getTrucksSnapshot(): TruckEntryRecord[] {
    return this.trucksSubject.value;
  }

  getActiveTrucksForSauda(saudaId: string): TruckEntryRecord[] {
    return this.trucksSubject.value.filter(
      (t) => t.saudaId === saudaId && t.status !== 'Removed',
    );
  }

  getAllTrucksForSauda(saudaId: string): TruckEntryRecord[] {
    return this.trucksSubject.value.filter((t) => t.saudaId === saudaId);
  }

  getDispatchedQtyMt(saudaId: string, excludeTruckId?: string): number {
    return this.trucksSubject.value
      .filter(
        (t) =>
          t.saudaId === saudaId &&
          t.status !== 'Removed' &&
          t.id !== excludeTruckId,
      )
      .reduce((sum, t) => sum + Number(t.loadedQtyMt || 0), 0);
  }

  getRemainingQtyMt(saudaId: string, excludeTruckId?: string): number {
    const sauda = this.saudasSubject.value.find((s) => s.id === saudaId);
    if (!sauda || sauda.status === 'Voided') {
      return 0;
    }
    const used = this.getDispatchedQtyMt(saudaId, excludeTruckId);
    return Math.max(0, Number((sauda.quantityMt - used).toFixed(2)));
  }

  getSaudaValueInr(sauda: SaudaRecord): number {
    return Number(sauda.totalAmountInr || 0);
  }

  computeTotalWeightMt(items: CommodityLineItem[]): number {
    const totalMt = (items || []).reduce((sum, item) => {
      const wt = Number(item.actualWeight || 0);
      if (item.weightUom === 'KG') return sum + wt / 1000;
      if (item.weightUom === 'Quintal') return sum + wt / 10;
      return sum + wt;
    }, 0);
    return Number(totalMt.toFixed(3));
  }

  convertItemToMt(item: CommodityLineItem): number {
    const wt = Number(item.actualWeight || 0);
    if (item.weightUom === 'KG') return Number((wt / 1000).toFixed(3));
    if (item.weightUom === 'Quintal') return Number((wt / 10).toFixed(3));
    return Number(wt.toFixed(3));
  }

  getWarehouseCommodityStock(
    clientFirm: string,
    warehouseName: string,
    commodityName: string,
  ): number {
    if (!warehouseName || !commodityName) return 0;
    const whTrimmed = warehouseName.trim().toLowerCase();
    const commTrimmed = commodityName.trim().toLowerCase();
    const firmTrimmed = (clientFirm || '').trim().toLowerCase();

    const matchedProduct = this.invProductsSubject.value.find(
      (p) =>
        (p.commodityName && p.commodityName.toLowerCase() === commTrimmed) ||
        p.name.toLowerCase().includes(commTrimmed) ||
        commTrimmed.includes(p.name.toLowerCase()),
    );
    const productId = matchedProduct?.id || '';

    const matchingRecords = this.inventorySubject.value.filter((inv) => {
      const matchWh =
        inv.warehouseName.trim().toLowerCase() === whTrimmed ||
        inv.warehouseId.trim().toLowerCase() === whTrimmed;
      const matchFirm =
        !firmTrimmed || inv.clientFirm.trim().toLowerCase() === firmTrimmed;
      const matchComm = productId
        ? inv.productId === productId ||
          (!inv.productId && inv.commodity.trim().toLowerCase() === commTrimmed)
        : inv.commodity.trim().toLowerCase() === commTrimmed ||
          inv.productName.trim().toLowerCase().includes(commTrimmed) ||
          commTrimmed.includes(inv.commodity.trim().toLowerCase());
      return matchWh && matchFirm && matchComm;
    });

    const total = matchingRecords.reduce(
      (sum, r) => sum + (Number(r.availableWeightMt) || 0),
      0,
    );
    return Number(total.toFixed(3));
  }

  // ── Sauda Operations ──

  createSauda(
    payload: Omit<
      SaudaRecord,
      | 'id'
      | 'saudaNo'
      | 'commodity'
      | 'quantityMt'
      | 'partyName'
      | 'status'
      | 'currentVersion'
      | 'createdBy'
      | 'createdAt'
      | 'updatedAt'
      | 'revisions'
    >,
  ): ActionResult {
    if (!payload.commodityItems || payload.commodityItems.length === 0) {
      return { ok: false, message: 'At least one commodity row is required.' };
    }

    const seen = new Set<string>();
    for (const item of payload.commodityItems) {
      if (!item.commodity) {
        return { ok: false, message: 'Please select a commodity for every row.' };
      }
      if (seen.has(item.commodity)) {
        return {
          ok: false,
          message: `Duplicate commodity "${item.commodity}". Each commodity can appear only once per Sauda.`,
        };
      }
      seen.add(item.commodity);
      if (Number(item.actualWeight) <= 0) {
        return {
          ok: false,
          message: 'Quantity in Ton must be greater than zero.',
        };
      }
    }

    if (payload.saudaType !== 'Purchase' && Number(payload.totalAmountInr) < 0) {
      return {
        ok: false,
        message: 'Total Sauda Amount cannot be negative.',
      };
    }

    if (
      payload.sellerName &&
      payload.buyerName &&
      payload.sellerName.trim().toLowerCase() ===
        payload.buyerName.trim().toLowerCase()
    ) {
      return {
        ok: false,
        message:
          'Seller and Buyer cannot be the same party in one deal (BR-SA-10, EX-02).',
      };
    }

    const quantityMt = this.computeTotalWeightMt(payload.commodityItems);
    const commodity = payload.commodityItems.map((i) => i.commodity).join(', ');
    const partyName = this.derivePartyName(
      payload.saudaType,
      payload.sellerName,
      payload.buyerName,
    );

    // Business rules per Sauda Type
    let status: SaudaStatus = 'Open';
    let heldQuantityMt: number | undefined = undefined;
    let soldQuantityMt: number | undefined = undefined;

    if (payload.saudaType === 'Purchase') {
      status = 'Open';
      heldQuantityMt = quantityMt;
      soldQuantityMt = 0;
    } else if (payload.saudaType === 'Sales') {
      status = 'Open';
      if (payload.linkedPurchaseSaudaId) {
        const linked = this.saudasSubject.value.find(
          (s) => s.id === payload.linkedPurchaseSaudaId,
        );
        if (linked) {
          const currentHeld =
            linked.heldQuantityMt !== undefined
              ? linked.heldQuantityMt
              : linked.quantityMt;
          const remainingHeld = Math.max(
            0,
            Number((currentHeld - quantityMt).toFixed(3)),
          );
          const updatedSold = Number(
            ((linked.soldQuantityMt || 0) + quantityMt).toFixed(3),
          );
          const updatedStatus: SaudaStatus =
            remainingHeld === 0 ? 'Sold' : 'Partly Sold';

          const updatedSaudas = this.saudasSubject.value.map((s) =>
            s.id === linked.id
              ? {
                  ...s,
                  heldQuantityMt: remainingHeld,
                  soldQuantityMt: updatedSold,
                  status: updatedStatus,
                }
              : s,
          );
          this.saudasSubject.next(updatedSaudas);
        }
      }
    } else if (payload.saudaType === 'Forward') {
      status = 'On Hold';
    } else {
      // Brokerage Sauda
      status = 'Open';
    }

    const nextNum = this.saudasSubject.value.length + 1;
    const code = `SAU-2026-${String(nextNum).padStart(4, '0')}`;
    const now = this.formatTimestamp();

    const newSauda: SaudaRecord = {
      ...payload,
      id: code,
      saudaNo: code,
      partyName,
      commodity,
      quantityMt,
      heldQuantityMt,
      soldQuantityMt,
      status,
      currentVersion: 1,
      amendmentStatus: 'None',
      createdBy: 'Sauda Admin',
      createdAt: now,
      updatedAt: now,
      revisions: [
        {
          version: 1,
          changedAt: now,
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: 'New Sauda contract created',
          changes: [
            { field: 'Client Firm', oldValue: '-', newValue: payload.clientFirm },
            { field: 'Party', oldValue: '-', newValue: partyName },
            { field: 'Commodities', oldValue: '-', newValue: commodity },
            {
              field: 'Total Amount',
              oldValue: '-',
              newValue: `₹${payload.totalAmountInr.toLocaleString('en-IN')}`,
            },
          ],
        },
      ],
    };

    this.saudasSubject.next([newSauda, ...this.saudasSubject.value]);
    return { ok: true, message: `Sauda ${code} created successfully.`, recordId: code };
  }

  updateSauda(
    id: string,
    payload: Omit<
      SaudaRecord,
      | 'id'
      | 'saudaNo'
      | 'commodity'
      | 'quantityMt'
      | 'partyName'
      | 'status'
      | 'currentVersion'
      | 'createdBy'
      | 'createdAt'
      | 'updatedAt'
      | 'revisions'
      | 'voidInfo'
    >,
    revisionReason: string,
  ): ActionResult {
    const existing = this.saudasSubject.value.find((s) => s.id === id);
    if (!existing) {
      return { ok: false, message: 'Sauda record not found.' };
    }
    if (existing.status === 'Voided') {
      return { ok: false, message: 'Voided Sauda contracts cannot be edited.' };
    }
    if (!revisionReason || revisionReason.trim().length < 5) {
      return {
        ok: false,
        message: 'Revision reason (min 5 characters) is mandatory.',
      };
    }
    if (!payload.commodityItems || payload.commodityItems.length === 0) {
      return { ok: false, message: 'At least one commodity row is required.' };
    }

    const seen = new Set<string>();
    for (const item of payload.commodityItems) {
      if (!item.commodity) {
        return { ok: false, message: 'Please select a commodity for every row.' };
      }
      if (seen.has(item.commodity)) {
        return {
          ok: false,
          message: `Duplicate commodity "${item.commodity}". Each commodity can appear only once per Sauda.`,
        };
      }
      seen.add(item.commodity);
      if (Number(item.actualWeight) <= 0) {
        return {
          ok: false,
          message: 'Quantity in Ton must be greater than zero.',
        };
      }
    }

    if (Number(payload.totalAmountInr) < 0) {
      return {
        ok: false,
        message: 'Total Sauda Amount cannot be negative.',
      };
    }

    const quantityMt = this.computeTotalWeightMt(payload.commodityItems);
    const dispatched = this.getDispatchedQtyMt(id);
    if (quantityMt < dispatched) {
      return {
        ok: false,
        message: `Total weight (${quantityMt} MT) cannot be reduced below already dispatched truck quantity (${dispatched} MT).`,
      };
    }

    const commodity = payload.commodityItems.map((i) => i.commodity).join(', ');
    const partyName = this.derivePartyName(
      payload.saudaType,
      payload.sellerName,
      payload.buyerName,
    );

    const changes: RevisionDiff[] = [];
    this.pushDiff(changes, 'Sauda Type', existing.saudaType, payload.saudaType);
    this.pushDiff(changes, 'Client Firm', existing.clientFirm, payload.clientFirm);
    this.pushDiff(changes, 'Party', existing.partyName, partyName);
    this.pushDiff(changes, 'Commodities', existing.commodity, commodity);
    this.pushDiff(
      changes,
      'Total Weight (MT)',
      `${existing.quantityMt} MT`,
      `${quantityMt} MT`,
    );
    this.pushDiff(
      changes,
      'Total Amount',
      `₹${existing.totalAmountInr.toLocaleString('en-IN')}`,
      `₹${payload.totalAmountInr.toLocaleString('en-IN')}`,
    );
    this.pushDiff(
      changes,
      'Seller Due Date',
      existing.sellerDueDate,
      payload.sellerDueDate,
    );
    this.pushDiff(
      changes,
      'Buyer Due Date',
      existing.buyerDueDate,
      payload.buyerDueDate,
    );
    this.pushDiff(changes, 'Remarks', existing.remarks, payload.remarks);

    if (changes.length === 0) {
      return {
        ok: false,
        message: 'No field changes detected to save a revision.',
      };
    }

    const now = this.formatTimestamp();
    const nextVersion = existing.currentVersion + 1;
    const updatedSauda: SaudaRecord = {
      ...existing,
      ...payload,
      partyName,
      commodity,
      quantityMt,
      currentVersion: nextVersion,
      updatedAt: now,
      revisions: [
        ...existing.revisions,
        {
          version: nextVersion,
          changedAt: now,
          changedBy: 'Sauda Admin',
          action: 'Updated',
          reason: revisionReason.trim(),
          changes,
        },
      ],
    };

    const nextList = this.saudasSubject.value.map((s) =>
      s.id === id ? updatedSauda : s,
    );
    this.saudasSubject.next(nextList);
    this.recomputeAllSaudaStatuses();

    return {
      ok: true,
      message: `Sauda ${existing.saudaNo} updated (Revision v${nextVersion}).`,
    };
  }

  initiateAmendment(
    id: string,
    payload: any,
    reason: string,
    maker = 'Operations Executive',
  ): ActionResult {
    const existing = this.saudasSubject.value.find((s) => s.id === id);
    if (!existing) {
      return { ok: false, message: 'Sauda record not found.' };
    }
    if (existing.status === 'Voided') {
      return { ok: false, message: 'Voided Sauda contracts cannot be amended.' };
    }
    if (existing.amendmentStatus === 'Pending Approval') {
      return {
        ok: false,
        message: `An amendment is already pending approval for ${existing.saudaNo} (AF-07). Resolve the pending amendment before submitting another.`,
      };
    }
    if (!reason || reason.trim().length < 5) {
      return {
        ok: false,
        message: 'Reason for amendment (minimum 5 characters) is mandatory (BR-SA-27).',
      };
    }
    if (!payload.commodityItems || payload.commodityItems.length === 0) {
      return { ok: false, message: 'At least one commodity row is required.' };
    }

    const seen = new Set<string>();
    for (const item of payload.commodityItems) {
      if (!item.commodity) {
        return { ok: false, message: 'Please select a commodity for every row.' };
      }
      if (seen.has(item.commodity)) {
        return {
          ok: false,
          message: `Duplicate commodity "${item.commodity}". Each commodity can appear only once per Sauda (BR-SA-07).`,
        };
      }
      seen.add(item.commodity);
      if (Number(item.actualWeight) <= 0) {
        return {
          ok: false,
          message: 'Quantity in Ton must be greater than zero.',
        };
      }
    }

    if (Number(payload.totalAmountInr) < 0) {
      return {
        ok: false,
        message: 'Total Sauda Amount cannot be negative.',
      };
    }

    const quantityMt = this.computeTotalWeightMt(payload.commodityItems);
    const dispatched = this.getDispatchedQtyMt(id);
    if (quantityMt < dispatched) {
      return {
        ok: false,
        message: `Total weight (${quantityMt} MT) cannot be reduced below already dispatched truck quantity (${dispatched} MT).`,
      };
    }

    const commodity = payload.commodityItems.map((i: any) => i.commodity).join(', ');
    const partyName = this.derivePartyName(
      payload.saudaType,
      payload.sellerName,
      payload.buyerName,
    );

    const changes: RevisionDiff[] = [];
    this.pushDiff(changes, 'Sauda Type', existing.saudaType, payload.saudaType);
    this.pushDiff(changes, 'Client Firm', existing.clientFirm, payload.clientFirm);
    this.pushDiff(changes, 'Party', existing.partyName, partyName);
    this.pushDiff(changes, 'Commodities', existing.commodity, commodity);
    this.pushDiff(
      changes,
      'Total Weight (MT)',
      `${existing.quantityMt} MT`,
      `${quantityMt} MT`,
    );
    this.pushDiff(
      changes,
      'Total Amount',
      `₹${existing.totalAmountInr.toLocaleString('en-IN')}`,
      `₹${Number(payload.totalAmountInr).toLocaleString('en-IN')}`,
    );
    if (existing.expectedDeliveryDate || payload.expectedDeliveryDate) {
      this.pushDiff(
        changes,
        'Expected Delivery Date',
        existing.expectedDeliveryDate || '—',
        payload.expectedDeliveryDate || '—',
      );
    }
    if (existing.buyerBrokerageAmount !== payload.buyerBrokerageAmount) {
      this.pushDiff(
        changes,
        'Buyer Direct Sale',
        existing.buyerBrokerageAmount ? `₹${existing.buyerBrokerageAmount}` : '₹0',
        payload.buyerBrokerageAmount ? `₹${payload.buyerBrokerageAmount}` : '₹0',
      );
    }
    if (existing.sellerBrokerageAmount !== payload.sellerBrokerageAmount) {
      this.pushDiff(
        changes,
        'Seller Direct Sale',
        existing.sellerBrokerageAmount ? `₹${existing.sellerBrokerageAmount}` : '₹0',
        payload.sellerBrokerageAmount ? `₹${payload.sellerBrokerageAmount}` : '₹0',
      );
    }
    this.pushDiff(
      changes,
      'Seller Credit Period',
      existing.sellerCreditPeriodDays !== null ? `${existing.sellerCreditPeriodDays} Days` : '—',
      payload.sellerCreditPeriodDays !== null && payload.sellerCreditPeriodDays !== '' ? `${payload.sellerCreditPeriodDays} Days` : '—',
    );
    this.pushDiff(
      changes,
      'Seller Due Date',
      existing.sellerDueDate || '—',
      payload.sellerDueDate || '—',
    );
    this.pushDiff(
      changes,
      'Buyer Credit Period',
      existing.buyerCreditPeriodDays !== null ? `${existing.buyerCreditPeriodDays} Days` : '—',
      payload.buyerCreditPeriodDays !== null && payload.buyerCreditPeriodDays !== '' ? `${payload.buyerCreditPeriodDays} Days` : '—',
    );
    this.pushDiff(
      changes,
      'Buyer Due Date',
      existing.buyerDueDate || '—',
      payload.buyerDueDate || '—',
    );
    this.pushDiff(changes, 'Remarks', existing.remarks || '—', payload.remarks || '—');

    if (changes.length === 0) {
      return {
        ok: false,
        message: 'No changes detected compared to existing Sauda contract.',
      };
    }

    const now = this.formatTimestamp();
    const amendmentId = `AMD-${String(Date.now()).slice(-6)}`;
    const pendingAmendment: SaudaAmendmentRecord = {
      id: amendmentId,
      saudaId: existing.id,
      saudaNo: existing.saudaNo,
      maker,
      submittedAt: now,
      reason: reason.trim(),
      proposedPayload: {
        ...payload,
        partyName,
        commodity,
        quantityMt,
      },
      status: 'Pending Approval',
      changes,
    };

    const updatedSauda: SaudaRecord = {
      ...existing,
      amendmentStatus: 'Pending Approval',
      pendingAmendment,
      updatedAt: now,
    };

    const nextList = this.saudasSubject.value.map((s) =>
      s.id === id ? updatedSauda : s,
    );
    this.saudasSubject.next(nextList);

    return {
      ok: true,
      message: `Amendment submitted for ${existing.saudaNo}. Pending Checker approval (AF-04).`,
    };
  }

  approveAmendment(
    id: string,
    checker = 'Business Owner / Admin',
  ): ActionResult {
    const existing = this.saudasSubject.value.find((s) => s.id === id);
    if (!existing) {
      return { ok: false, message: 'Sauda record not found.' };
    }
    if (!existing.pendingAmendment) {
      return { ok: false, message: 'No pending amendment found on this Sauda.' };
    }

    const pending = existing.pendingAmendment;
    if (pending.maker.trim().toLowerCase() === checker.trim().toLowerCase()) {
      return {
        ok: false,
        message: 'Maker and Checker cannot be the same user (Segregation of Duties - BR-SA-28).',
      };
    }

    const now = this.formatTimestamp();
    const nextVersion = existing.currentVersion + 1;
    const proposed = pending.proposedPayload;

    const approvedSauda: SaudaRecord = {
      ...existing,
      ...proposed,
      currentVersion: nextVersion,
      amendmentStatus: 'Approved',
      pendingAmendment: undefined,
      updatedAt: now,
      revisions: [
        ...existing.revisions,
        {
          version: nextVersion,
          changedAt: now,
          changedBy: checker,
          action: 'Updated',
          reason: `[Amendment Approved by ${checker}] ${pending.reason}`,
          changes: pending.changes,
        },
      ],
    };

    const nextList = this.saudasSubject.value.map((s) =>
      s.id === id ? approvedSauda : s,
    );
    this.saudasSubject.next(nextList);
    this.recomputeAllSaudaStatuses();

    return {
      ok: true,
      message: `Amendment approved for ${existing.saudaNo} (v${nextVersion} published).`,
    };
  }

  rejectAmendment(
    id: string,
    rejectionReason: string,
    checker = 'Business Owner / Admin',
  ): ActionResult {
    const existing = this.saudasSubject.value.find((s) => s.id === id);
    if (!existing) {
      return { ok: false, message: 'Sauda record not found.' };
    }
    if (!existing.pendingAmendment) {
      return { ok: false, message: 'No pending amendment found on this Sauda.' };
    }
    if (!rejectionReason || rejectionReason.trim().length < 5) {
      return {
        ok: false,
        message: 'Rejection reason (min 5 characters) is mandatory (BR-SA-30).',
      };
    }

    const pending = existing.pendingAmendment;
    const now = this.formatTimestamp();

    // Contract terms remain completely unchanged (BR-SA-31)
    const updatedSauda: SaudaRecord = {
      ...existing,
      amendmentStatus: 'Rejected',
      pendingAmendment: undefined,
      updatedAt: now,
      revisions: [
        ...existing.revisions,
        {
          version: existing.currentVersion,
          changedAt: now,
          changedBy: checker,
          action: 'Updated',
          reason: `[Amendment Rejected by ${checker}] Rejection Reason: ${rejectionReason.trim()} (Original proposed: ${pending.reason})`,
          changes: [],
        },
      ],
    };

    const nextList = this.saudasSubject.value.map((s) =>
      s.id === id ? updatedSauda : s,
    );
    this.saudasSubject.next(nextList);

    return {
      ok: true,
      message: `Amendment rejected for ${existing.saudaNo}. Active contract terms remain unchanged (BR-SA-31).`,
    };
  }

  private derivePartyName(
    type: SaudaType,
    sellerName: string,
    buyerName: string,
  ): string {
    const s = (sellerName || '').trim();
    const b = (buyerName || '').trim();
    if (type === 'Purchase') return s || '—';
    if (type === 'Sales') return b || '—';
    if (type === 'Brokerage') return s && b ? `${s} → ${b}` : s || b || '—';
    if (type === 'Forward') return s && b ? `${s} / ${b}` : s || b || '—';
    if (s && b) return `${s} / ${b}`;
    return s || b || '—';
  }

  executeForwardSauda(id: string): ActionResult {
    const saudas = this.saudasSubject.value;
    const sauda = saudas.find((s) => s.id === id);
    if (!sauda) {
      return { ok: false, message: 'Forward Sauda not found.' };
    }
    const updated = saudas.map((s) =>
      s.id === id
        ? {
            ...s,
            status: 'Open' as SaudaStatus,
            updatedAt: this.formatTimestamp(),
          }
        : s,
    );
    this.saudasSubject.next(updated);
    return { ok: true, message: `Forward Sauda ${sauda.saudaNo} executed successfully and converted to normal deal.` };
  }

  voidSauda(id: string, reason: string): ActionResult {
    const existing = this.saudasSubject.value.find((s) => s.id === id);
    if (!existing) {
      return { ok: false, message: 'Sauda record not found.' };
    }
    if (existing.status === 'Voided') {
      return { ok: false, message: 'Sauda is already voided.' };
    }

    const activeTrucks = this.getActiveTrucksForSauda(id);
    if (activeTrucks.length > 0) {
      return {
        ok: false,
        message: `Cannot void ${existing.saudaNo}: ${activeTrucks.length} active truck entry(s) are linked. Remove active trucks first.`,
      };
    }

    if (!reason || reason.trim().length < 10) {
      return {
        ok: false,
        message: 'Void reason must be at least 10 characters.',
      };
    }

    const now = this.formatTimestamp();
    const nextVersion = existing.currentVersion + 1;
    const voidedSauda: SaudaRecord = {
      ...existing,
      status: 'Voided',
      currentVersion: nextVersion,
      updatedAt: now,
      voidInfo: {
        voidedBy: 'Sauda Admin',
        voidedAt: now,
        reason: reason.trim(),
      },
      revisions: [
        ...existing.revisions,
        {
          version: nextVersion,
          changedAt: now,
          changedBy: 'Sauda Admin',
          action: 'Voided',
          reason: reason.trim(),
          changes: [
            { field: 'Status', oldValue: existing.status, newValue: 'Voided' },
          ],
        },
      ],
    };

    this.saudasSubject.next(
      this.saudasSubject.value.map((s) => (s.id === id ? voidedSauda : s)),
    );
    return {
      ok: true,
      message: `Sauda ${existing.saudaNo} has been marked as Voided.`,
    };
  }

  // ── Truck Operations ──

  createTruck(
    payload: Omit<
      TruckEntryRecord,
      | 'id'
      | 'entryNo'
      | 'saudaNo'
      | 'saudaType'
      | 'commodities'
      | 'loadedQtyMt'
      | 'currentVersion'
      | 'createdBy'
      | 'createdAt'
      | 'updatedAt'
      | 'revisions'
      | 'removalInfo'
    >,
  ): ActionResult {
    const sauda = this.saudasSubject.value.find((s) => s.id === payload.saudaId);
    if (!sauda) {
      return { ok: false, message: 'Selected Sauda contract does not exist.' };
    }
    if (sauda.status === 'Voided') {
      return {
        ok: false,
        message: 'Cannot assign a truck to a Voided Sauda contract.',
      };
    }
    if (sauda.saudaType === 'Brokerage' || sauda.saudaType === 'Direct Sale') {
      return {
        ok: false,
        message: 'Direct Sale Saudas are not eligible for truck fulfilment (BR-TF-12, EX-02).',
      };
    }
    if (!payload.warehouse || !payload.warehouse.trim()) {
      return {
        ok: false,
        message: 'Warehouse selection is mandatory for every truck entry (BR-TF-04, BR-TF-05, EX-04).',
      };
    }
    const warehouseName = payload.warehouse.trim();
    const wh = this.warehousesSubject.value.find(
      (w) =>
        w.name.trim().toLowerCase() === warehouseName.toLowerCase() ||
        w.id.trim().toLowerCase() === warehouseName.toLowerCase(),
    );
    if (!wh || !wh.isActive) {
      return {
        ok: false,
        message: `Selected warehouse "${warehouseName}" is inactive or invalid (EX-05).`,
      };
    }
    if (!payload.commodityItems || payload.commodityItems.length === 0) {
      return { ok: false, message: 'At least one commodity row is required.' };
    }

    const seen = new Set<string>();
    const allowedCommodities = new Set(
      sauda.commodityItems.map((c) => c.commodity),
    );
    for (const item of payload.commodityItems) {
      if (!item.commodity) {
        return { ok: false, message: 'Please select a commodity for every row.' };
      }
      if (allowedCommodities.size > 0 && !allowedCommodities.has(item.commodity)) {
        return {
          ok: false,
          message: `Commodity "${item.commodity}" is not part of linked Sauda ${sauda.saudaNo}.`,
        };
      }
      if (seen.has(item.commodity)) {
        return {
          ok: false,
          message: `Duplicate commodity "${item.commodity}". Each commodity can appear once per truck entry.`,
        };
      }
      seen.add(item.commodity);
      if (Number(item.actualWeight) <= 0) {
        return {
          ok: false,
          message: 'Quantity in Ton must be greater than zero.',
        };
      }
    }

    const loadedQtyMt = this.computeTotalWeightMt(payload.commodityItems);
    const remaining = this.getRemainingQtyMt(payload.saudaId);
    if (!payload.isFinalSubmit && loadedQtyMt > remaining) {
      return {
        ok: false,
        message: `Total truck weight (${loadedQtyMt} MT) exceeds remaining Sauda balance (${remaining} MT).`,
      };
    }
    if (sauda.saudaType === 'Sales') {
      for (const item of payload.commodityItems) {
        const itemMt = this.convertItemToMt(item);
        const availableStock = this.getWarehouseCommodityStock(
          sauda.clientFirm,
          payload.warehouse,
          item.commodity,
        );
        if (itemMt > availableStock) {
          return {
            ok: false,
            message: `Insufficient stock in ${payload.warehouse} for ${item.commodity}. Available: ${availableStock.toFixed(2)} MT, Requested: ${itemMt.toFixed(2)} MT (BR-TF-10, EX-06).`,
          };
        }
      }
    }
    if (payload.expectedArrivalDate && payload.expectedArrivalDate < payload.dispatchDate) {
      return {
        ok: false,
        message: 'Expected arrival date cannot be earlier than truck entry date.',
      };
    }

    const nextNum = this.trucksSubject.value.length + 1;
    const entryNo = `TRK-2026-${String(nextNum).padStart(4, '0')}`;
    const now = this.formatTimestamp();
    const commodities = payload.commodityItems.map((c) => c.commodity).join(', ');

    const newTruck: TruckEntryRecord = {
      ...payload,
      id: entryNo,
      entryNo,
      saudaNo: sauda.saudaNo,
      saudaType: sauda.saudaType,
      partyName: payload.partyName || sauda.partyName,
      commodities,
      loadedQtyMt,
      vehicleNo: payload.vehicleNo.trim().toUpperCase(),
      currentVersion: 1,
      createdBy: 'Sauda Admin',
      createdAt: now,
      updatedAt: now,
      revisions: [
        {
          version: 1,
          changedAt: now,
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: payload.isFinalSubmit
            ? `Final truck entry created against ${sauda.saudaNo} (Sauda Completed)`
            : `Truck entry created against ${sauda.saudaNo}`,
          changes: [
            {
              field: 'Truck Number',
              oldValue: '-',
              newValue: payload.vehicleNo.trim().toUpperCase(),
            },
            ...(payload.warehouse
              ? [{ field: 'Warehouse', oldValue: '-', newValue: payload.warehouse }]
              : []),
            { field: 'Commodities', oldValue: '-', newValue: commodities },
            {
              field: 'Loaded Weight (MT)',
              oldValue: '-',
              newValue: `${loadedQtyMt} MT`,
            },
          ],
        },
      ],
    };

    if (payload.isFinalSubmit) {
      const priorLoaded = this.trucksSubject.value
        .filter((t) => t.saudaId === sauda.id && t.status !== 'Removed')
        .reduce((sum, t) => sum + Number(t.loadedQtyMt || 0), 0);
      const totalActualLoadedMt = Number((priorLoaded + loadedQtyMt).toFixed(3));
      const prevQty = sauda.quantityMt || 1;
      const unitRate = sauda.totalAmountInr / prevQty;
      const newTotalAmount = Math.round(totalActualLoadedMt * unitRate);

      const updatedSauda: SaudaRecord = {
        ...sauda,
        quantityMt: totalActualLoadedMt,
        heldQuantityMt: sauda.saudaType === 'Purchase' ? totalActualLoadedMt : sauda.heldQuantityMt,
        totalAmountInr: newTotalAmount,
        status: 'Completed',
        updatedAt: now,
        revisions: [
          ...sauda.revisions,
          {
            version: sauda.currentVersion + 1,
            changedAt: now,
            changedBy: 'Sauda Admin',
            action: 'Updated',
            reason: `Sauda finalized via Final Truck Entry. Quantity adjusted from ${sauda.quantityMt} MT to actual fulfilled ${totalActualLoadedMt} MT and marked Completed.`,
            changes: [
              { field: 'Quantity', oldValue: `${sauda.quantityMt} MT`, newValue: `${totalActualLoadedMt} MT` },
              { field: 'Total Amount', oldValue: `₹${sauda.totalAmountInr.toLocaleString('en-IN')}`, newValue: `₹${newTotalAmount.toLocaleString('en-IN')}` },
              { field: 'Status', oldValue: sauda.status, newValue: 'Completed' },
            ],
          },
        ],
        currentVersion: sauda.currentVersion + 1,
      };

      this.saudasSubject.next(
        this.saudasSubject.value.map((s) => (s.id === sauda.id ? updatedSauda : s)),
      );
    }

    this.trucksSubject.next([newTruck, ...this.trucksSubject.value]);
    this.syncInventoryForTruck(null, newTruck);
    this.recomputeAllSaudaStatuses();

    return {
      ok: true,
      message: payload.isFinalSubmit
        ? `Truck entry ${entryNo} saved. Sauda ${sauda.saudaNo} marked Completed with final quantity.`
        : `Truck entry ${entryNo} created successfully.`,
      recordId: entryNo,
    };
  }

  updateTruck(
    id: string,
    payload: Omit<
      TruckEntryRecord,
      | 'id'
      | 'entryNo'
      | 'saudaNo'
      | 'saudaType'
      | 'commodities'
      | 'loadedQtyMt'
      | 'currentVersion'
      | 'createdBy'
      | 'createdAt'
      | 'updatedAt'
      | 'revisions'
      | 'removalInfo'
    >,
    revisionReason: string,
  ): ActionResult {
    const existing = this.trucksSubject.value.find((t) => t.id === id);
    if (!existing) {
      return { ok: false, message: 'Truck entry not found.' };
    }
    if (existing.status === 'Removed') {
      return {
        ok: false,
        message: 'Removed truck entries cannot be edited.',
      };
    }
    if (!revisionReason || revisionReason.trim().length < 5) {
      return {
        ok: false,
        message: 'Revision reason (min 5 characters) is mandatory.',
      };
    }

    const sauda = this.saudasSubject.value.find((s) => s.id === payload.saudaId);
    if (!sauda || sauda.status === 'Voided') {
      return {
        ok: false,
        message: 'Linked Sauda must be active and non-voided.',
      };
    }
    if (sauda.saudaType === 'Brokerage' || sauda.saudaType === 'Direct Sale') {
      return {
        ok: false,
        message: 'Direct Sale Saudas are not eligible for truck fulfilment (BR-TF-12, EX-02).',
      };
    }
    if (!payload.warehouse || !payload.warehouse.trim()) {
      return {
        ok: false,
        message: 'Warehouse selection is mandatory for every truck entry (BR-TF-04, BR-TF-05, EX-04).',
      };
    }
    const warehouseName = payload.warehouse.trim();
    const wh = this.warehousesSubject.value.find(
      (w) =>
        w.name.trim().toLowerCase() === warehouseName.toLowerCase() ||
        w.id.trim().toLowerCase() === warehouseName.toLowerCase(),
    );
    if (!wh || !wh.isActive) {
      return {
        ok: false,
        message: `Selected warehouse "${warehouseName}" is inactive or invalid (EX-05).`,
      };
    }
    if (!payload.commodityItems || payload.commodityItems.length === 0) {
      return { ok: false, message: 'At least one commodity row is required.' };
    }

    const seen = new Set<string>();
    const allowedCommodities = new Set(
      sauda.commodityItems.map((c) => c.commodity),
    );
    for (const item of payload.commodityItems) {
      if (!item.commodity) {
        return { ok: false, message: 'Please select a commodity for every row.' };
      }
      if (allowedCommodities.size > 0 && !allowedCommodities.has(item.commodity)) {
        return {
          ok: false,
          message: `Commodity "${item.commodity}" is not part of linked Sauda ${sauda.saudaNo}.`,
        };
      }
      if (seen.has(item.commodity)) {
        return {
          ok: false,
          message: `Duplicate commodity "${item.commodity}".`,
        };
      }
      seen.add(item.commodity);
      if (Number(item.actualWeight) <= 0) {
        return {
          ok: false,
          message: 'Quantity in Ton must be greater than zero.',
        };
      }
    }

    const loadedQtyMt = this.computeTotalWeightMt(payload.commodityItems);
    const remaining = this.getRemainingQtyMt(payload.saudaId, id);
    if (!payload.isFinalSubmit && loadedQtyMt > remaining) {
      return {
        ok: false,
        message: `Total truck weight (${loadedQtyMt} MT) exceeds available Sauda balance (${remaining} MT).`,
      };
    }
    if (sauda.saudaType === 'Sales') {
      for (const item of payload.commodityItems) {
        const itemMt = this.convertItemToMt(item);
        let availableStock = this.getWarehouseCommodityStock(
          sauda.clientFirm,
          payload.warehouse,
          item.commodity,
        );
        if (
          this.isDispatchedTruckStatus(existing.status) &&
          (existing.warehouse || '').trim().toLowerCase() ===
            payload.warehouse.trim().toLowerCase()
        ) {
          const prevItem = existing.commodityItems.find(
            (ci) =>
              ci.commodity.trim().toLowerCase() ===
              item.commodity.trim().toLowerCase(),
          );
          if (prevItem) {
            availableStock += this.convertItemToMt(prevItem);
          }
        }
        if (itemMt > availableStock) {
          return {
            ok: false,
            message: `Insufficient stock in ${payload.warehouse} for ${item.commodity}. Available: ${availableStock.toFixed(2)} MT, Requested: ${itemMt.toFixed(2)} MT (BR-TF-10, EX-06).`,
          };
        }
      }
    }
    if (payload.expectedArrivalDate && payload.expectedArrivalDate < payload.dispatchDate) {
      return {
        ok: false,
        message: 'Expected arrival date cannot be earlier than truck entry date.',
      };
    }

    const normalizedVehicle = payload.vehicleNo.trim().toUpperCase();
    const commodities = payload.commodityItems.map((c) => c.commodity).join(', ');
    const changes: RevisionDiff[] = [];
    this.pushDiff(changes, 'Linked Sauda', existing.saudaNo, sauda.saudaNo);
    this.pushDiff(changes, 'Warehouse', existing.warehouse || '—', payload.warehouse || '—');
    this.pushDiff(changes, 'Truck Number', existing.vehicleNo, normalizedVehicle);
    this.pushDiff(changes, 'Truck Entry Date', existing.dispatchDate, payload.dispatchDate);
    this.pushDiff(changes, 'Commodities', existing.commodities, commodities);
    this.pushDiff(
      changes,
      'Loaded Weight (MT)',
      `${existing.loadedQtyMt} MT`,
      `${loadedQtyMt} MT`,
    );
    this.pushDiff(changes, 'Status', existing.status, payload.status);
    this.pushDiff(changes, 'Remarks', existing.remarks, payload.remarks);

    if (changes.length === 0) {
      return {
        ok: false,
        message: 'No field changes detected to save a revision.',
      };
    }

    const now = this.formatTimestamp();
    const nextVersion = existing.currentVersion + 1;
    const updatedTruck: TruckEntryRecord = {
      ...existing,
      ...payload,
      saudaNo: sauda.saudaNo,
      saudaType: sauda.saudaType,
      commodities,
      loadedQtyMt,
      vehicleNo: normalizedVehicle,
      currentVersion: nextVersion,
      updatedAt: now,
      revisions: [
        ...existing.revisions,
        {
          version: nextVersion,
          changedAt: now,
          changedBy: 'Sauda Admin',
          action: 'Updated',
          reason: revisionReason.trim(),
          changes,
        },
      ],
    };

    if (payload.isFinalSubmit) {
      const priorLoaded = this.trucksSubject.value
        .filter((t) => t.saudaId === sauda.id && t.id !== id && t.status !== 'Removed')
        .reduce((sum, t) => sum + Number(t.loadedQtyMt || 0), 0);
      const totalActualLoadedMt = Number((priorLoaded + loadedQtyMt).toFixed(3));
      const prevQty = sauda.quantityMt || 1;
      const unitRate = sauda.totalAmountInr / prevQty;
      const newTotalAmount = Math.round(totalActualLoadedMt * unitRate);

      const updatedSauda: SaudaRecord = {
        ...sauda,
        quantityMt: totalActualLoadedMt,
        heldQuantityMt: sauda.saudaType === 'Purchase' ? totalActualLoadedMt : sauda.heldQuantityMt,
        totalAmountInr: newTotalAmount,
        status: 'Completed',
        updatedAt: now,
        revisions: [
          ...sauda.revisions,
          {
            version: sauda.currentVersion + 1,
            changedAt: now,
            changedBy: 'Sauda Admin',
            action: 'Updated',
            reason: `Sauda finalized via Final Truck Entry edit. Quantity adjusted from ${sauda.quantityMt} MT to actual fulfilled ${totalActualLoadedMt} MT and marked Completed.`,
            changes: [
              { field: 'Quantity', oldValue: `${sauda.quantityMt} MT`, newValue: `${totalActualLoadedMt} MT` },
              { field: 'Total Amount', oldValue: `₹${sauda.totalAmountInr.toLocaleString('en-IN')}`, newValue: `₹${newTotalAmount.toLocaleString('en-IN')}` },
              { field: 'Status', oldValue: sauda.status, newValue: 'Completed' },
            ],
          },
        ],
        currentVersion: sauda.currentVersion + 1,
      };

      this.saudasSubject.next(
        this.saudasSubject.value.map((s) => (s.id === sauda.id ? updatedSauda : s)),
      );
    }

    this.trucksSubject.next(
      this.trucksSubject.value.map((t) => (t.id === id ? updatedTruck : t)),
    );
    this.syncInventoryForTruck(existing, updatedTruck);
    this.recomputeAllSaudaStatuses();

    return {
      ok: true,
      message: `Truck entry ${existing.entryNo} updated (Revision v${nextVersion}).`,
      recordId: existing.id,
    };
  }

  removeTruck(id: string, reason: string): ActionResult {
    const existing = this.trucksSubject.value.find((t) => t.id === id);
    if (!existing) {
      return { ok: false, message: 'Truck entry not found.' };
    }
    if (existing.status === 'Removed') {
      return { ok: false, message: 'Truck entry is already removed.' };
    }
    if (existing.status === 'Delivered') {
      return {
        ok: false,
        message: 'Delivered truck entries cannot be removed.',
      };
    }
    if (!reason || reason.trim().length < 10) {
      return {
        ok: false,
        message: 'Removal reason must be at least 10 characters.',
      };
    }

    const now = this.formatTimestamp();
    const nextVersion = existing.currentVersion + 1;
    const removedTruck: TruckEntryRecord = {
      ...existing,
      status: 'Removed',
      currentVersion: nextVersion,
      updatedAt: now,
      removalInfo: {
        removedBy: 'Sauda Admin',
        removedAt: now,
        reason: reason.trim(),
      },
      revisions: [
        ...existing.revisions,
        {
          version: nextVersion,
          changedAt: now,
          changedBy: 'Sauda Admin',
          action: 'Removed',
          reason: reason.trim(),
          changes: [
            {
              field: 'Status',
              oldValue: existing.status,
              newValue: 'Removed',
            },
          ],
        },
      ],
    };

    this.trucksSubject.next(
      this.trucksSubject.value.map((t) => (t.id === id ? removedTruck : t)),
    );
    this.syncInventoryForTruck(existing, removedTruck);
    this.recomputeAllSaudaStatuses();

    return {
      ok: true,
      message: `Truck entry ${existing.entryNo} removed and Sauda balance restored.`,
    };
  }

  // ── Firm Operations ──

  createFirm(payload: FirmPayload | string): ActionResult {
    const rawName = typeof payload === 'string' ? payload : payload.name;
    const email = typeof payload === 'string' ? '' : (payload.email || '').trim();
    const whatsapp =
      typeof payload === 'string' ? '' : (payload.whatsappNumber || '').trim();

    const trimmed = (rawName || '').trim();
    if (trimmed.length < 2) {
      return {
        ok: false,
        message: 'Firm name must be at least 2 characters.',
      };
    }

    const duplicate = this.firmsSubject.value.some(
      (f) => f.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (duplicate) {
      return { ok: false, message: `Firm "${trimmed}" already exists.` };
    }

    const nextNum = this.firmsSubject.value.length + 1;
    const id = `FRM-${String(nextNum).padStart(3, '0')}`;
    const now = this.formatTimestamp();

    const newFirm: FirmRecord = {
      id,
      name: trimmed,
      email: email || undefined,
      whatsappNumber: whatsapp || undefined,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    this.firmsSubject.next([newFirm, ...this.firmsSubject.value]);
    return { ok: true, message: `Firm "${trimmed}" added successfully.` };
  }

  updateFirm(id: string, payload: FirmPayload | string): ActionResult {
    const existing = this.firmsSubject.value.find((f) => f.id === id);
    if (!existing) {
      return { ok: false, message: 'Firm not found.' };
    }

    const rawName = typeof payload === 'string' ? payload : payload.name;
    const email =
      typeof payload === 'string' ? existing.email : (payload.email || '').trim();
    const whatsapp =
      typeof payload === 'string'
        ? existing.whatsappNumber
        : (payload.whatsappNumber || '').trim();

    const trimmed = (rawName || '').trim();
    if (trimmed.length < 2) {
      return {
        ok: false,
        message: 'Firm name must be at least 2 characters.',
      };
    }

    const duplicate = this.firmsSubject.value.some(
      (f) => f.id !== id && f.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (duplicate) {
      return { ok: false, message: `Firm "${trimmed}" already exists.` };
    }

    const now = this.formatTimestamp();
    this.firmsSubject.next(
      this.firmsSubject.value.map((f) =>
        f.id === id
          ? {
              ...f,
              name: trimmed,
              email: email || undefined,
              whatsappNumber: whatsapp || undefined,
              updatedAt: now,
            }
          : f,
      ),
    );
    return { ok: true, message: `Firm "${trimmed}" updated successfully.` };
  }

  toggleFirmStatus(id: string): ActionResult {
    const existing = this.firmsSubject.value.find((f) => f.id === id);
    if (!existing) {
      return { ok: false, message: 'Firm not found.' };
    }

    const nextActive = !existing.isActive;
    const now = this.formatTimestamp();
    this.firmsSubject.next(
      this.firmsSubject.value.map((f) =>
        f.id === id ? { ...f, isActive: nextActive, updatedAt: now } : f,
      ),
    );

    return {
      ok: true,
      message: `${existing.name} marked as ${nextActive ? 'Active' : 'Inactive'}.`,
    };
  }

  // ── Seller Master Operations ──

  createSeller(
    name: string,
    phone: string,
    email: string = '',
    defaultCreditDays: number | null = null,
  ): ActionResult {
    const trimmed = (name || '').trim();
    if (trimmed.length < 2) {
      return { ok: false, message: 'Seller name must be at least 2 characters.' };
    }
    if (
      this.sellersSubject.value.some(
        (s) => s.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      return { ok: false, message: `Seller "${trimmed}" already exists.` };
    }
    const nextNum = this.sellersSubject.value.length + 1;
    const now = this.formatTimestamp();
    const record: SellerRecord = {
      id: `SEL-${String(nextNum).padStart(3, '0')}`,
      name: trimmed,
      phone: (phone || '').trim(),
      email: (email || '').trim().toLowerCase(),
      defaultCreditDays:
        defaultCreditDays !== null && defaultCreditDays !== undefined
          ? Number(defaultCreditDays)
          : null,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.sellersSubject.next([record, ...this.sellersSubject.value]);
    return { ok: true, message: `Seller "${trimmed}" added successfully.` };
  }

  updateSeller(
    id: string,
    name: string,
    phone: string,
    email: string = '',
    defaultCreditDays: number | null = null,
  ): ActionResult {
    const existing = this.sellersSubject.value.find((s) => s.id === id);
    if (!existing) return { ok: false, message: 'Seller not found.' };
    const trimmed = (name || '').trim();
    if (trimmed.length < 2) {
      return { ok: false, message: 'Seller name must be at least 2 characters.' };
    }
    if (
      this.sellersSubject.value.some(
        (s) => s.id !== id && s.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      return { ok: false, message: `Seller "${trimmed}" already exists.` };
    }
    const oldName = existing.name;
    const now = this.formatTimestamp();
    this.sellersSubject.next(
      this.sellersSubject.value.map((s) =>
        s.id === id
          ? {
              ...s,
              name: trimmed,
              phone: (phone || '').trim(),
              email: (email || '').trim().toLowerCase(),
              defaultCreditDays:
                defaultCreditDays !== null && defaultCreditDays !== undefined
                  ? Number(defaultCreditDays)
                  : null,
              updatedAt: now,
            }
          : s,
      ),
    );
    if (oldName !== trimmed) {
      this.saudasSubject.next(
        this.saudasSubject.value.map((sau) => {
          if (sau.sellerName === oldName) {
            const nextParty = sau.saudaType === 'Purchase' ? trimmed : sau.partyName.replace(oldName, trimmed);
            return { ...sau, sellerName: trimmed, partyName: nextParty };
          }
          return sau;
        }),
      );
      this.ledgerSettlementsSubject.next(
        this.ledgerSettlementsSubject.value.map((st: LedgerSettlementRecord) =>
          st.partyName === oldName ? { ...st, partyName: trimmed } : st,
        ),
      );
    }
    if (oldName !== trimmed) {
      this.saudasSubject.next(
        this.saudasSubject.value.map((sau) => {
          if (sau.sellerName === oldName) {
            const nextParty = sau.saudaType === 'Purchase' ? trimmed : sau.partyName.replace(oldName, trimmed);
            return { ...sau, sellerName: trimmed, partyName: nextParty };
          }
          return sau;
        }),
      );
      this.ledgerSettlementsSubject.next(
        this.ledgerSettlementsSubject.value.map((st: LedgerSettlementRecord) =>
          st.partyName === oldName ? { ...st, partyName: trimmed } : st,
        ),
      );
    }
    return { ok: true, message: `Seller "${trimmed}" updated successfully.` };
  }

  toggleSellerStatus(id: string): ActionResult {
    const existing = this.sellersSubject.value.find((s) => s.id === id);
    if (!existing) return { ok: false, message: 'Seller not found.' };
    const nextActive = !existing.isActive;
    const now = this.formatTimestamp();
    this.sellersSubject.next(
      this.sellersSubject.value.map((s) =>
        s.id === id ? { ...s, isActive: nextActive, updatedAt: now } : s,
      ),
    );
    return {
      ok: true,
      message: `${existing.name} marked as ${nextActive ? 'Active' : 'Inactive'}.`,
    };
  }

  // ── Buyer Master Operations ──

  createBuyer(
    name: string,
    phone: string,
    email: string = '',
    defaultCreditDays: number | null = null,
  ): ActionResult {
    const trimmed = (name || '').trim();
    if (trimmed.length < 2) {
      return { ok: false, message: 'Buyer name must be at least 2 characters.' };
    }
    if (
      this.buyersSubject.value.some(
        (b) => b.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      return { ok: false, message: `Buyer "${trimmed}" already exists.` };
    }
    const nextNum = this.buyersSubject.value.length + 1;
    const now = this.formatTimestamp();
    const record: BuyerRecord = {
      id: `BUY-${String(nextNum).padStart(3, '0')}`,
      name: trimmed,
      phone: (phone || '').trim(),
      email: (email || '').trim().toLowerCase(),
      defaultCreditDays:
        defaultCreditDays !== null && defaultCreditDays !== undefined
          ? Number(defaultCreditDays)
          : null,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.buyersSubject.next([record, ...this.buyersSubject.value]);
    return { ok: true, message: `Buyer "${trimmed}" added successfully.` };
  }

  updateBuyer(
    id: string,
    name: string,
    phone: string,
    email: string = '',
    defaultCreditDays: number | null = null,
  ): ActionResult {
    const existing = this.buyersSubject.value.find((b) => b.id === id);
    if (!existing) return { ok: false, message: 'Buyer not found.' };
    const trimmed = (name || '').trim();
    if (trimmed.length < 2) {
      return { ok: false, message: 'Buyer name must be at least 2 characters.' };
    }
    if (
      this.buyersSubject.value.some(
        (b) => b.id !== id && b.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      return { ok: false, message: `Buyer "${trimmed}" already exists.` };
    }
    const oldName = existing.name;
    const now = this.formatTimestamp();
    this.buyersSubject.next(
      this.buyersSubject.value.map((b) =>
        b.id === id
          ? {
              ...b,
              name: trimmed,
              phone: (phone || '').trim(),
              email: (email || '').trim().toLowerCase(),
              defaultCreditDays:
                defaultCreditDays !== null && defaultCreditDays !== undefined
                  ? Number(defaultCreditDays)
                  : null,
              updatedAt: now,
            }
          : b,
      ),
    );
    if (oldName !== trimmed) {
      this.saudasSubject.next(
        this.saudasSubject.value.map((sau) => {
          if (sau.buyerName === oldName) {
            const nextParty = sau.saudaType === 'Sales' ? trimmed : sau.partyName.replace(oldName, trimmed);
            return { ...sau, buyerName: trimmed, partyName: nextParty };
          }
          return sau;
        }),
      );
      this.ledgerSettlementsSubject.next(
        this.ledgerSettlementsSubject.value.map((st: LedgerSettlementRecord) =>
          st.partyName === oldName ? { ...st, partyName: trimmed } : st,
        ),
      );
    }
    if (oldName !== trimmed) {
      this.saudasSubject.next(
        this.saudasSubject.value.map((sau) => {
          if (sau.buyerName === oldName) {
            const nextParty = sau.saudaType === 'Sales' ? trimmed : sau.partyName.replace(oldName, trimmed);
            return { ...sau, buyerName: trimmed, partyName: nextParty };
          }
          return sau;
        }),
      );
      this.ledgerSettlementsSubject.next(
        this.ledgerSettlementsSubject.value.map((st: LedgerSettlementRecord) =>
          st.partyName === oldName ? { ...st, partyName: trimmed } : st,
        ),
      );
    }
    return { ok: true, message: `Buyer "${trimmed}" updated successfully.` };
  }

  toggleBuyerStatus(id: string): ActionResult {
    const existing = this.buyersSubject.value.find((b) => b.id === id);
    if (!existing) return { ok: false, message: 'Buyer not found.' };
    const nextActive = !existing.isActive;
    const now = this.formatTimestamp();
    this.buyersSubject.next(
      this.buyersSubject.value.map((b) =>
        b.id === id ? { ...b, isActive: nextActive, updatedAt: now } : b,
      ),
    );
    return {
      ok: true,
      message: `${existing.name} marked as ${nextActive ? 'Active' : 'Inactive'}.`,
    };
  }

  // ── Commodity Master Operations ──

  createCommodity(
    name: string,
    defaultPackagingUom: PackagingUom,
    defaultWeightUom: WeightUom,
  ): ActionResult {
    const trimmed = (name || '').trim();
    if (trimmed.length < 2) {
      return {
        ok: false,
        message: 'Commodity name must be at least 2 characters.',
      };
    }
    if (
      this.commoditiesSubject.value.some(
        (c) => c.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      return { ok: false, message: `Commodity "${trimmed}" already exists.` };
    }
    const nextNum = this.commoditiesSubject.value.length + 1;
    const now = this.formatTimestamp();
    const record: CommodityRecord = {
      id: `CMD-${String(nextNum).padStart(3, '0')}`,
      name: trimmed,
      defaultPackagingUom,
      defaultWeightUom,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.commoditiesSubject.next([record, ...this.commoditiesSubject.value]);
    return { ok: true, message: `Commodity "${trimmed}" added successfully.` };
  }

  updateCommodity(
    id: string,
    name: string,
    defaultPackagingUom: PackagingUom,
    defaultWeightUom: WeightUom,
  ): ActionResult {
    const existing = this.commoditiesSubject.value.find((c) => c.id === id);
    if (!existing) return { ok: false, message: 'Commodity not found.' };
    const trimmed = (name || '').trim();
    if (trimmed.length < 2) {
      return {
        ok: false,
        message: 'Commodity name must be at least 2 characters.',
      };
    }
    if (
      this.commoditiesSubject.value.some(
        (c) => c.id !== id && c.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      return { ok: false, message: `Commodity "${trimmed}" already exists.` };
    }
    const now = this.formatTimestamp();
    this.commoditiesSubject.next(
      this.commoditiesSubject.value.map((c) =>
        c.id === id
          ? {
              ...c,
              name: trimmed,
              defaultPackagingUom,
              defaultWeightUom,
              updatedAt: now,
            }
          : c,
      ),
    );
    return { ok: true, message: `Commodity "${trimmed}" updated successfully.` };
  }

  toggleCommodityStatus(id: string): ActionResult {
    const existing = this.commoditiesSubject.value.find((c) => c.id === id);
    if (!existing) return { ok: false, message: 'Commodity not found.' };
    const nextActive = !existing.isActive;
    const now = this.formatTimestamp();
    this.commoditiesSubject.next(
      this.commoditiesSubject.value.map((c) =>
        c.id === id ? { ...c, isActive: nextActive, updatedAt: now } : c,
      ),
    );
    return {
      ok: true,
      message: `${existing.name} marked as ${nextActive ? 'Active' : 'Inactive'}.`,
    };
  }

  // ── Inventory Operations ──

  adjustInventoryStock(payload: {
    productId: string;
    clientFirm: string;
    warehouseId?: string;
    packagingUom?: PackagingUom;
    action: 'Stock In' | 'Stock Out';
    units: number;
    weightMt: number;
    minThresholdMt?: number;
    referenceNo: string;
    remarks: string;
  }): ActionResult {
    if (!payload.productId || !payload.clientFirm) {
      return {
        ok: false,
        message: 'Product and Client Firm are required.',
      };
    }
    const product = this.invProductsSubject.value.find(
      (p) => p.id === payload.productId,
    );
    if (!product) {
      return { ok: false, message: 'Selected product was not found in Product Master.' };
    }
    if (Number(payload.units) <= 0 || Number(payload.weightMt) <= 0) {
      return {
        ok: false,
        message: 'Packaging units and weight (MT) must be greater than zero.',
      };
    }

    const { categoryId, categoryName, subCategoryName, commodity } =
      this.resolveProductHierarchy(product);
    const packagingUom = (
      payload.packagingUom ||
      (product.packagingUoms && product.packagingUoms[0]) ||
      (product.packagingUom ? product.packagingUom.split(',')[0].trim() : 'Bag')
    ) as PackagingUom;
    const now = this.formatTimestamp();

    const warehouse = this.warehousesSubject.value.find(
      (w) => w.id === payload.warehouseId || w.name.toLowerCase() === (payload.warehouseId || '').toLowerCase(),
    ) || this.warehousesSubject.value[0];
    const warehouseId = warehouse?.id || 'WH-001';
    const warehouseName = warehouse?.name || 'Desert Mandi Yard A';
    const isActiveWarehouse = warehouse ? warehouse.isActive : true;

    const existing = this.inventorySubject.value.find(
      (i) =>
        (i.productId === product.id ||
          (!i.productId && i.commodity.toLowerCase() === commodity.toLowerCase())) &&
        i.clientFirm.toLowerCase() === payload.clientFirm.toLowerCase() &&
        (i.warehouseId === warehouseId || i.warehouseName.toLowerCase() === warehouseName.toLowerCase()),
    );

    const sign = payload.action === 'Stock In' ? 1 : -1;
    const unitsDelta = sign * Number(payload.units);
    const weightDelta = Number((sign * Number(payload.weightMt)).toFixed(3));

    if (payload.action === 'Stock Out') {
      if (!existing) {
        return {
          ok: false,
          message: `No stock record exists for ${product.name} under ${payload.clientFirm} in ${warehouseName}.`,
        };
      }
      if (Number(payload.weightMt) > existing.availableWeightMt) {
        return {
          ok: false,
          message: `Cannot dispatch ${payload.weightMt} MT. Only ${existing.availableWeightMt} MT available in ${warehouseName}.`,
        };
      }
    }

    const logEntry: InventoryLogEntry = {
      id: `LOG-${Date.now().toString().slice(-5)}-${Math.floor(Math.random() * 90 + 10)}`,
      date: now,
      action: payload.action,
      referenceNo: (payload.referenceNo || 'MANUAL').trim().toUpperCase(),
      unitsChange: unitsDelta,
      weightMtChange: weightDelta,
      remarks: (payload.remarks || '').trim() || `${payload.action} recorded`,
      doneBy: 'Sauda Admin',
    };

    if (existing) {
      const newUnits = Math.max(0, existing.availableUnits + unitsDelta);
      const newWeight = Math.max(
        0,
        Number((existing.availableWeightMt + weightDelta).toFixed(3)),
      );
      const newAvgWeight = newUnits > 0 ? Number(((newWeight * 1000) / newUnits).toFixed(2)) : 0;

      const updated: InventoryRecord = {
        ...existing,
        warehouseId,
        warehouseName,
        isActiveWarehouse,
        productId: product.id,
        productName: product.name,
        categoryId,
        categoryName,
        subCategoryName,
        commodity,
        packagingUom,
        availableUnits: newUnits,
        availableWeightMt: newWeight,
        averageWeightKg: newAvgWeight,
        minThresholdMt:
          payload.minThresholdMt !== undefined
            ? Number(payload.minThresholdMt)
            : existing.minThresholdMt,
        lastUpdated: now,
        logs: [logEntry, ...existing.logs],
      };
      this.inventorySubject.next(
        this.inventorySubject.value.map((i) =>
          i.id === existing.id ? updated : i,
        ),
      );
      return {
        ok: true,
        message: `${payload.action} updated for ${product.name} (${existing.clientFirm}) in ${warehouseName}.`,
      };
    }

    const nextNum = this.inventorySubject.value.length + 1;
    const initialUnits = Number(payload.units);
    const initialWeight = Number(payload.weightMt);
    const initialAvgWeight = initialUnits > 0 ? Number(((initialWeight * 1000) / initialUnits).toFixed(2)) : 0;

    const newItem: InventoryRecord = {
      id: `INV-${String(nextNum).padStart(3, '0')}`,
      warehouseId,
      warehouseName,
      isActiveWarehouse,
      productId: product.id,
      productName: product.name,
      categoryId,
      categoryName,
      subCategoryName,
      commodity,
      clientFirm: payload.clientFirm,
      packagingUom,
      availableUnits: initialUnits,
      availableWeightMt: initialWeight,
      averageWeightKg: initialAvgWeight,
      minThresholdMt:
        payload.minThresholdMt !== undefined
          ? Number(payload.minThresholdMt)
          : 2,
      lastUpdated: now,
      logs: [logEntry],
    };

    this.inventorySubject.next([newItem, ...this.inventorySubject.value]);
    return {
      ok: true,
      message: `Inventory stock added for ${product.name} (${payload.clientFirm}) in ${warehouseName}.`,
    };
  }

  // ── Stock Adjustments (UC-INV-04 & UC-INV-05) ──

  createStockAdjustment(
    payload: {
      clientFirm?: string;
      partyName?: string;
      warehouseId: string;
      godownId?: string;
      godownName?: string;
      chamberId?: string;
      chamberName?: string;
      stackNumber?: string;
      commodity: string;
      productId?: string;
      adjustmentType: 'Increase' | 'Decrease';
      packagingUom: PackagingUom;
      quantity: number;
      totalWeightMt: number;
      reason: string;
      adjustmentDate?: string;
    },
    makerRole: 'Operations Executive (Maker)' | 'Business Owner / Admin (Checker)',
    makerName: string,
  ): ActionResult {
    const effectiveParty = (payload.partyName || payload.clientFirm || '').trim();
    if (!effectiveParty || !payload.warehouseId || !payload.commodity) {
      return {
        ok: false,
        message: 'Party, Warehouse and Commodity are mandatory.',
      };
    }

    const weight = Number(payload.totalWeightMt);
    const qty = Number(payload.quantity) || (weight > 0 ? Math.max(1, Math.round((weight * 1000) / 50)) : 1);
    if (!weight || weight <= 0) {
      return {
        ok: false,
        message: 'Quantity (MT) must be greater than zero.',
      };
    }

    const reason = (payload.reason || '').trim();
    if (!reason) {
      return {
        ok: false,
        message: 'Reason for stock adjustment is mandatory.',
      };
    }

    const warehouse = this.warehousesSubject.value.find(
      (w) => w.id === payload.warehouseId || w.name.toLowerCase() === payload.warehouseId.toLowerCase(),
    );
    const warehouseId = warehouse?.id || payload.warehouseId;
    const warehouseName = warehouse?.name || payload.warehouseId;
    const isActiveWarehouse = warehouse ? warehouse.isActive : true;

    // For Decrease adjustments: validate quantity and weight independently against available stock
    if (payload.adjustmentType === 'Decrease') {
      const existing = this.inventorySubject.value.find(
        (i) =>
          ((i.partyName && i.partyName.toLowerCase() === effectiveParty.toLowerCase()) ||
            i.clientFirm.toLowerCase() === effectiveParty.toLowerCase()) &&
          (i.warehouseId === warehouseId || i.warehouseName.toLowerCase() === warehouseName.toLowerCase()) &&
          i.commodity.toLowerCase() === payload.commodity.toLowerCase(),
      );

      const availableUnits = existing ? existing.availableUnits : 0;
      const availableWeight = existing ? existing.availableWeightMt : 0;

      if (weight > availableWeight) {
        return {
          ok: false,
          message: `Requested weight (${weight} MT) exceeds available weight (${availableWeight} MT) in ${warehouseName}.`,
        };
      }
    }

    // Resolve product / category if applicable
    const matchedProduct = payload.productId
      ? this.invProductsSubject.value.find((p) => p.id === payload.productId)
      : this.invProductsSubject.value.find(
          (p) =>
            p.commodityName?.toLowerCase() === payload.commodity.toLowerCase() ||
            p.name.toLowerCase().includes(payload.commodity.toLowerCase()),
        );

    const now = this.formatTimestamp();
    const adjDate = payload.adjustmentDate || now.slice(0, 10);
    const currentAdjustments = this.stockAdjustmentsSubject.value;
    const nextSeq = currentAdjustments.length + 1;
    const adjNo = `ADJ-2026-${String(nextSeq).padStart(4, '0')}`;

    const averageWeightKg = Number(((weight * 1000) / qty).toFixed(2));

    const newAdjustment: StockAdjustmentRecord = {
      id: `ADJ-REC-${Date.now().toString().slice(-5)}`,
      adjNo,
      partyName: effectiveParty,
      clientFirm: effectiveParty,
      warehouseId,
      warehouseName,
      isActiveWarehouse,
      godownId: payload.godownId,
      godownName: payload.godownName,
      chamberId: payload.chamberId,
      chamberName: payload.chamberName,
      stackNumber: payload.stackNumber,
      commodity: payload.commodity,
      productId: matchedProduct?.id || payload.productId,
      productName: matchedProduct?.name || payload.commodity,
      adjustmentType: payload.adjustmentType,
      packagingUom: payload.packagingUom,
      quantity: qty,
      totalWeightMt: Number(weight.toFixed(3)),
      averageWeightKg,
      reason,
      adjustmentDate: adjDate,
      submittedAt: now,
      makerRole,
      makerName: makerName || 'Operations Executive',
      status: 'Pending Approval',
    };

    // Pending requests DO NOT affect inventory at creation (UC-INV-04)
    this.stockAdjustmentsSubject.next([newAdjustment, ...currentAdjustments]);

    return {
      ok: true,
      message: `Stock Adjustment request ${adjNo} created successfully with status "Pending Approval".`,
    };
  }

  approveStockAdjustment(
    adjustmentId: string,
    checkerRole: string,
    checkerName: string,
  ): ActionResult {
    const list = this.stockAdjustmentsSubject.value;
    const adj = list.find((a) => a.id === adjustmentId || a.adjNo === adjustmentId);
    if (!adj) {
      return { ok: false, message: 'Stock Adjustment request not found.' };
    }

    if (adj.status !== 'Pending Approval') {
      return {
        ok: false,
        message: `Request is already ${adj.status}. Only Pending Approval requests can be reviewed.`,
      };
    }

    // Segregation of duties: Maker cannot approve their own request (UC-INV-05)
    if (checkerName.trim().toLowerCase() === adj.makerName.trim().toLowerCase()) {
      return {
        ok: false,
        message: `Segregation of duties: Maker (${adj.makerName}) cannot approve their own adjustment request. Another Admin must review.`,
      };
    }

    const now = this.formatTimestamp();
    const inventoryList = [...this.inventorySubject.value];
    const existingIdx = inventoryList.findIndex(
      (i) =>
        i.clientFirm.toLowerCase() === adj.clientFirm.toLowerCase() &&
        (i.warehouseId === adj.warehouseId || i.warehouseName.toLowerCase() === adj.warehouseName.toLowerCase()) &&
        i.commodity.toLowerCase() === adj.commodity.toLowerCase(),
    );

    const sign = adj.adjustmentType === 'Increase' ? 1 : -1;
    const unitsDelta = sign * adj.quantity;
    const weightDelta = Number((sign * adj.totalWeightMt).toFixed(3));

    // Re-validate Decrease against latest stock at approval time (UC-INV-05)
    if (adj.adjustmentType === 'Decrease') {
      if (existingIdx < 0) {
        return {
          ok: false,
          message: `Approval blocked: No stock record found in ${adj.warehouseName} for ${adj.commodity} (${adj.clientFirm}). Request remains Pending Approval.`,
        };
      }
      const existing = inventoryList[existingIdx];
      if (adj.totalWeightMt > existing.availableWeightMt) {
        return {
          ok: false,
          message: `Approval blocked: Current stock (${existing.availableWeightMt} MT) is insufficient for requested decrease. Request remains Pending Approval.`,
        };
      }
    }

    let balanceUnitsAfter = 0;
    let balanceWeightAfter = 0;

    const logEntry: InventoryLogEntry = {
      id: `LOG-ADJ-${Date.now().toString().slice(-5)}`,
      date: now,
      action: adj.adjustmentType === 'Increase' ? 'Stock In' : 'Stock Out',
      referenceNo: adj.adjNo,
      unitsChange: unitsDelta,
      weightMtChange: weightDelta,
      remarks: `Stock Adjustment (${adj.adjNo}): ${adj.reason}`,
      doneBy: `${checkerName} (Checker)`,
    };

    if (existingIdx >= 0) {
      const existing = inventoryList[existingIdx];
      balanceUnitsAfter = Math.max(0, existing.availableUnits + unitsDelta);
      balanceWeightAfter = Math.max(
        0,
        Number((existing.availableWeightMt + weightDelta).toFixed(3)),
      );
      const avgWeight = balanceUnitsAfter > 0 ? Number(((balanceWeightAfter * 1000) / balanceUnitsAfter).toFixed(2)) : 0;

      inventoryList[existingIdx] = {
        ...existing,
        availableUnits: balanceUnitsAfter,
        availableWeightMt: balanceWeightAfter,
        averageWeightKg: avgWeight,
        lastUpdated: now,
        logs: [logEntry, ...existing.logs],
      };
    } else {
      // New inventory balance lot created by Increase
      balanceUnitsAfter = Math.max(0, unitsDelta);
      balanceWeightAfter = Math.max(0, weightDelta);
      const avgWeight = balanceUnitsAfter > 0 ? Number(((balanceWeightAfter * 1000) / balanceUnitsAfter).toFixed(2)) : 0;
      const nextNum = inventoryList.length + 1;

      const newInv: InventoryRecord = {
        id: `INV-${String(nextNum).padStart(3, '0')}`,
        warehouseId: adj.warehouseId,
        warehouseName: adj.warehouseName,
        isActiveWarehouse: adj.isActiveWarehouse,
        godownId: adj.godownId,
        godownName: adj.godownName,
        chamberId: adj.chamberId,
        chamberName: adj.chamberName,
        stackNumber: adj.stackNumber,
        productId: adj.productId || '',
        productName: adj.productName || adj.commodity,
        categoryId: '',
        categoryName: 'Stock Lot',
        subCategoryName: '—',
        commodity: adj.commodity,
        partyName: adj.partyName || adj.clientFirm,
        clientFirm: adj.clientFirm,
        packagingUom: adj.packagingUom,
        availableUnits: balanceUnitsAfter,
        availableWeightMt: balanceWeightAfter,
        averageWeightKg: avgWeight,
        minThresholdMt: 2,
        lastUpdated: now,
        logs: [logEntry],
      };
      inventoryList.unshift(newInv);
    }

    // Atomic update of stock
    this.inventorySubject.next(inventoryList);

    // Update adjustment status
    const updatedAdj: StockAdjustmentRecord = {
      ...adj,
      status: 'Approved',
      checkerRole,
      checkerName,
      reviewedAt: now,
    };
    this.stockAdjustmentsSubject.next(
      list.map((a) => (a.id === adj.id ? updatedAdj : a)),
    );

    // Append to completed stock movements (UC-INV-06)
    const nextMovSeq = this.stockMovementsSubject.value.length + 1;
    const newMovement: StockMovementRecord = {
      id: `MOV-${Date.now().toString().slice(-5)}`,
      movementNo: `MOV-2026-${String(nextMovSeq).padStart(4, '0')}`,
      movementType: 'Stock Adjustment',
      movementDirection: adj.adjustmentType === 'Increase' ? 'Stock In' : 'Stock Out',
      partyName: adj.partyName || adj.clientFirm,
      clientFirm: adj.clientFirm,
      warehouseName: adj.warehouseName,
      godownName: adj.godownName,
      chamberName: adj.chamberName,
      stackNumber: adj.stackNumber,
      commodity: adj.commodity,
      packagingUom: adj.packagingUom,
      quantity: adj.quantity,
      totalWeightMt: adj.totalWeightMt,
      averageWeightKg: adj.averageWeightKg,
      sourceRef: adj.adjNo,
      movementDate: adj.adjustmentDate,
      recordedAt: now,
      recordedBy: checkerName,
      makerCheckerDetails: `Maker: ${adj.makerName} | Checker: ${checkerName}`,
      stockBalanceUnitsAfter: balanceUnitsAfter,
      stockBalanceWeightMtAfter: balanceWeightAfter,
    };
    this.stockMovementsSubject.next([
      newMovement,
      ...this.stockMovementsSubject.value,
    ]);

    return {
      ok: true,
      message: `Stock Adjustment ${adj.adjNo} Approved successfully. Live inventory updated.`,
    };
  }

  rejectStockAdjustment(
    adjustmentId: string,
    rejectionReason: string,
    checkerRole: string,
    checkerName: string,
  ): ActionResult {
    const list = this.stockAdjustmentsSubject.value;
    const adj = list.find((a) => a.id === adjustmentId || a.adjNo === adjustmentId);
    if (!adj) {
      return { ok: false, message: 'Stock Adjustment request not found.' };
    }

    if (adj.status !== 'Pending Approval') {
      return {
        ok: false,
        message: `Request is already ${adj.status}. Only Pending Approval requests can be reviewed.`,
      };
    }

    // Segregation of duties: Maker cannot reject their own request
    if (checkerName.trim().toLowerCase() === adj.makerName.trim().toLowerCase()) {
      return {
        ok: false,
        message: `Segregation of duties: Maker (${adj.makerName}) cannot review their own adjustment request. Another Admin must review.`,
      };
    }

    const trimmedReason = (rejectionReason || '').trim();
    if (!trimmedReason) {
      return {
        ok: false,
        message: 'Rejection reason is mandatory.',
      };
    }

    const now = this.formatTimestamp();
    const updatedAdj: StockAdjustmentRecord = {
      ...adj,
      status: 'Rejected',
      checkerRole,
      checkerName,
      reviewedAt: now,
      rejectionReason: trimmedReason,
    };

    // Rejected adjustments DO NOT change inventory and are NOT added to completed stock movements (UC-INV-05, UC-INV-06)
    this.stockAdjustmentsSubject.next(
      list.map((a) => (a.id === adj.id ? updatedAdj : a)),
    );

    return {
      ok: true,
      message: `Stock Adjustment ${adj.adjNo} has been Rejected. Inventory remains unchanged.`,
    };
  }

  private resolveProductHierarchy(product: InvProductRecord): {
    categoryId: string;
    categoryName: string;
    subCategoryName: string;
    commodity: string;
  } {
    const subCat = this.invSubCategoriesSubject.value.find(
      (s) => s.id === product.subCategoryId,
    );
    const cat = subCat
      ? this.invCategoriesSubject.value.find((c) => c.id === subCat.categoryId)
      : undefined;
    return {
      categoryId: cat?.id || '',
      categoryName: cat?.name || 'Uncategorized',
      subCategoryName: subCat?.name || '—',
      commodity: product.commodityName || product.name,
    };
  }

  private isDispatchedTruckStatus(status: TruckStatus): boolean {
    return status === 'Loaded' || status === 'In Transit' || status === 'Delivered';
  }

  private syncInventoryForTruck(
    prevTruck: TruckEntryRecord | null,
    nextTruck: TruckEntryRecord | null,
  ): void {
    const wasDispatched = prevTruck
      ? this.isDispatchedTruckStatus(prevTruck.status)
      : false;
    const isNowDispatched = nextTruck
      ? this.isDispatchedTruckStatus(nextTruck.status)
      : false;

    if (!wasDispatched && !isNowDispatched) {
      return;
    }
    if (wasDispatched && prevTruck) {
      this.applyTruckInventoryDelta(prevTruck, -1, true);
    }
    if (isNowDispatched && nextTruck) {
      this.applyTruckInventoryDelta(nextTruck, 1, false);
    }
  }

  private applyTruckInventoryDelta(
    truck: TruckEntryRecord,
    operationSign: 1 | -1,
    isReversal: boolean,
  ): void {
    const sauda = this.saudasSubject.value.find((s) => s.id === truck.saudaId);
    if (!sauda || sauda.saudaType === 'Brokerage' || sauda.saudaType === 'Direct Sale') {
      return;
    }

    const baseSign = sauda.saudaType === 'Purchase' ? 1 : -1;
    const effectiveSign = baseSign * operationSign;
    const now = this.formatTimestamp();
    let list = [...this.inventorySubject.value];

    const warehouse = this.warehousesSubject.value.find(
      (w) => w.name.toLowerCase() === (truck.warehouse || '').toLowerCase() || w.id === truck.warehouse,
    );
    const warehouseName = warehouse ? warehouse.name : (truck.warehouse || 'Desert Mandi Yard A');
    const warehouseId = warehouse ? warehouse.id : 'WH-001';
    const isActiveWarehouse = warehouse ? warehouse.isActive : true;

    for (const item of truck.commodityItems) {
      const itemWeightMt = Number(
        (item.weightUom === 'KG'
          ? item.actualWeight / 1000
          : item.weightUom === 'Quintal'
            ? item.actualWeight / 10
            : item.actualWeight
        ).toFixed(3),
      );
      if (itemWeightMt <= 0 && Number(item.packagingQty || 0) <= 0) {
        continue;
      }

      const lowerComm = item.commodity.trim().toLowerCase();
      const matchedProduct = this.invProductsSubject.value.find(
        (p) =>
          (p.commodityName && p.commodityName.toLowerCase() === lowerComm) ||
          p.name.toLowerCase().includes(lowerComm) ||
          lowerComm.includes(p.name.toLowerCase()),
      );

      const hierarchy = matchedProduct
        ? this.resolveProductHierarchy(matchedProduct)
        : {
            categoryId: '',
            categoryName: 'Uncategorized',
            subCategoryName: '—',
            commodity: item.commodity,
          };
      const productId = matchedProduct?.id || '';
      const productName = matchedProduct?.name || item.commodity;

      const unitsDelta = effectiveSign * Number(item.packagingQty || 0);
      const weightDelta = Number((effectiveSign * itemWeightMt).toFixed(3));
      const logAction: InventoryLogEntry['action'] = isReversal
        ? 'Adjustment'
        : effectiveSign >= 0
          ? 'Stock In'
          : 'Stock Out';
      const remarks = isReversal
        ? `Reversed ${truck.entryNo} (${truck.status}) stock impact for ${sauda.saudaNo}`
        : `Auto ${sauda.saudaType === 'Purchase' ? 'inward' : 'dispatch'} from ${truck.entryNo} (${truck.status}) — ${sauda.saudaNo} at ${warehouseName}`;

      const logEntry: InventoryLogEntry = {
        id: `LOG-${Date.now().toString().slice(-5)}-${Math.floor(Math.random() * 90 + 10)}`,
        date: now,
        action: logAction,
        referenceNo: truck.entryNo,
        unitsChange: unitsDelta,
        weightMtChange: weightDelta,
        remarks,
        doneBy: 'Truck Auto-Sync',
      };

      const existingIdx = list.findIndex(
        (i) =>
          (productId
            ? i.productId === productId ||
              (!i.productId && i.commodity.toLowerCase() === lowerComm)
            : i.commodity.toLowerCase() === lowerComm) &&
          i.clientFirm.toLowerCase() === sauda.clientFirm.toLowerCase() &&
          i.warehouseName.toLowerCase() === warehouseName.toLowerCase(),
      );

      let newUnits = 0;
      let newWeight = 0;
      let newAvgWeight = 0;

      if (existingIdx >= 0) {
        const existing = list[existingIdx];
        newUnits = Math.max(0, existing.availableUnits + unitsDelta);
        newWeight = Math.max(
          0,
          Number((existing.availableWeightMt + weightDelta).toFixed(3)),
        );
        newAvgWeight = newUnits > 0 ? Number(((newWeight * 1000) / newUnits).toFixed(2)) : 0;

        list[existingIdx] = {
          ...existing,
          warehouseId,
          warehouseName,
          isActiveWarehouse,
          productId: productId || existing.productId,
          productName: productName || existing.productName,
          categoryId: hierarchy.categoryId || existing.categoryId,
          categoryName: hierarchy.categoryName || existing.categoryName,
          subCategoryName: hierarchy.subCategoryName || existing.subCategoryName,
          availableUnits: newUnits,
          availableWeightMt: newWeight,
          averageWeightKg: newAvgWeight,
          lastUpdated: now,
          logs: [logEntry, ...existing.logs],
        };
      } else {
        const nextNum = list.length + 1;
        newUnits = Math.max(0, unitsDelta);
        newWeight = Math.max(0, weightDelta);
        newAvgWeight = newUnits > 0 ? Number(((newWeight * 1000) / newUnits).toFixed(2)) : 0;

        list = [
          {
            id: `INV-${String(nextNum).padStart(3, '0')}`,
            warehouseId,
            warehouseName,
            isActiveWarehouse,
            productId,
            productName,
            categoryId: hierarchy.categoryId,
            categoryName: hierarchy.categoryName,
            subCategoryName: hierarchy.subCategoryName,
            commodity: item.commodity,
            clientFirm: sauda.clientFirm,
            packagingUom: (
              item.packagingUom ||
              (matchedProduct?.packagingUoms && matchedProduct.packagingUoms[0]) ||
              (matchedProduct?.packagingUom ? matchedProduct.packagingUom.split(',')[0].trim() : 'Bag')
            ) as PackagingUom,
            availableUnits: newUnits,
            availableWeightMt: newWeight,
            averageWeightKg: newAvgWeight,
            minThresholdMt: 2,
            lastUpdated: now,
            logs: [logEntry],
          },
          ...list,
        ];
      }

      // Record in Stock Movement History if not a reversal (UC-INV-06)
      if (!isReversal) {
        const nextMovSeq = this.stockMovementsSubject.value.length + 1;
        const movRecord: StockMovementRecord = {
          id: `MOV-${Date.now().toString().slice(-5)}-${Math.floor(Math.random() * 90 + 10)}`,
          movementNo: `MOV-2026-${String(nextMovSeq).padStart(4, '0')}`,
          movementType: sauda.saudaType === 'Purchase' ? 'Purchase Receipt' : 'Sales Dispatch',
          movementDirection: effectiveSign >= 0 ? 'Stock In' : 'Stock Out',
          clientFirm: sauda.clientFirm,
          warehouseName,
          commodity: item.commodity,
          packagingUom: (
            item.packagingUom ||
            (matchedProduct?.packagingUoms && matchedProduct.packagingUoms[0]) ||
            (matchedProduct?.packagingUom ? matchedProduct.packagingUom.split(',')[0].trim() : 'Bag')
          ) as PackagingUom,
          quantity: Math.abs(unitsDelta),
          totalWeightMt: Math.abs(weightDelta),
          averageWeightKg: newAvgWeight,
          sourceRef: sauda.saudaNo,
          truckNo: truck.entryNo,
          movementDate: truck.dispatchDate || now.slice(0, 10),
          recordedAt: now,
          recordedBy: 'Truck Auto-Sync',
          stockBalanceUnitsAfter: newUnits,
          stockBalanceWeightMtAfter: newWeight,
        };
        this.stockMovementsSubject.next([movRecord, ...this.stockMovementsSubject.value]);
      }
    }

    this.inventorySubject.next(list);
  }

  // ── Inventory Categories, Sub-Categories & Product Master ──

  createInvCategory(name: string): ActionResult {
    const trimmed = (name || '').trim();
    if (trimmed.length < 2) {
      return { ok: false, message: 'Category name must be at least 2 characters.' };
    }
    if (
      this.invCategoriesSubject.value.some(
        (c) => c.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      return { ok: false, message: `Category "${trimmed}" already exists.` };
    }
    const nextNum = this.invCategoriesSubject.value.length + 1;
    const now = this.formatTimestamp();
    const record: InvCategoryRecord = {
      id: `CAT-${String(nextNum).padStart(3, '0')}`,
      name: trimmed,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.invCategoriesSubject.next([record, ...this.invCategoriesSubject.value]);
    return { ok: true, message: `Category "${trimmed}" created successfully.` };
  }

  updateInvCategory(id: string, name: string): ActionResult {
    const existing = this.invCategoriesSubject.value.find((c) => c.id === id);
    if (!existing) return { ok: false, message: 'Category not found.' };
    const trimmed = (name || '').trim();
    if (trimmed.length < 2) {
      return { ok: false, message: 'Category name must be at least 2 characters.' };
    }
    if (
      this.invCategoriesSubject.value.some(
        (c) => c.id !== id && c.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      return { ok: false, message: `Category "${trimmed}" already exists.` };
    }
    const now = this.formatTimestamp();
    this.invCategoriesSubject.next(
      this.invCategoriesSubject.value.map((c) =>
        c.id === id ? { ...c, name: trimmed, updatedAt: now } : c,
      ),
    );
    return { ok: true, message: `Category "${trimmed}" updated successfully.` };
  }

  toggleInvCategoryStatus(id: string): ActionResult {
    const existing = this.invCategoriesSubject.value.find((c) => c.id === id);
    if (!existing) return { ok: false, message: 'Category not found.' };
    const nextActive = !existing.isActive;
    const now = this.formatTimestamp();
    this.invCategoriesSubject.next(
      this.invCategoriesSubject.value.map((c) =>
        c.id === id ? { ...c, isActive: nextActive, updatedAt: now } : c,
      ),
    );
    return {
      ok: true,
      message: `${existing.name} marked as ${nextActive ? 'Active' : 'Inactive'}.`,
    };
  }

  createInvSubCategory(name: string, categoryId: string): ActionResult {
    const trimmed = (name || '').trim();
    if (trimmed.length < 2 || !categoryId) {
      return {
        ok: false,
        message: 'Sub Category name and parent Category are required.',
      };
    }
    if (
      this.invSubCategoriesSubject.value.some(
        (sc) =>
          sc.categoryId === categoryId &&
          sc.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      return {
        ok: false,
        message: `Sub Category "${trimmed}" already exists in this category.`,
      };
    }
    const nextNum = this.invSubCategoriesSubject.value.length + 1;
    const now = this.formatTimestamp();
    const record: InvSubCategoryRecord = {
      id: `SUB-${String(nextNum).padStart(3, '0')}`,
      name: trimmed,
      categoryId,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.invSubCategoriesSubject.next([
      record,
      ...this.invSubCategoriesSubject.value,
    ]);
    return {
      ok: true,
      message: `Sub Category "${trimmed}" created successfully.`,
    };
  }

  updateInvSubCategory(
    id: string,
    name: string,
    categoryId: string,
  ): ActionResult {
    const existing = this.invSubCategoriesSubject.value.find(
      (sc) => sc.id === id,
    );
    if (!existing) return { ok: false, message: 'Sub Category not found.' };
    const trimmed = (name || '').trim();
    if (trimmed.length < 2 || !categoryId) {
      return {
        ok: false,
        message: 'Sub Category name and parent Category are required.',
      };
    }
    if (
      this.invSubCategoriesSubject.value.some(
        (sc) =>
          sc.id !== id &&
          sc.categoryId === categoryId &&
          sc.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      return {
        ok: false,
        message: `Sub Category "${trimmed}" already exists in this category.`,
      };
    }
    const now = this.formatTimestamp();
    this.invSubCategoriesSubject.next(
      this.invSubCategoriesSubject.value.map((sc) =>
        sc.id === id
          ? { ...sc, name: trimmed, categoryId, updatedAt: now }
          : sc,
      ),
    );
    return {
      ok: true,
      message: `Sub Category "${trimmed}" updated successfully.`,
    };
  }

  toggleInvSubCategoryStatus(id: string): ActionResult {
    const existing = this.invSubCategoriesSubject.value.find(
      (sc) => sc.id === id,
    );
    if (!existing) return { ok: false, message: 'Sub Category not found.' };
    const nextActive = !existing.isActive;
    const now = this.formatTimestamp();
    this.invSubCategoriesSubject.next(
      this.invSubCategoriesSubject.value.map((sc) =>
        sc.id === id ? { ...sc, isActive: nextActive, updatedAt: now } : sc,
      ),
    );
    return {
      ok: true,
      message: `${existing.name} marked as ${nextActive ? 'Active' : 'Inactive'}.`,
    };
  }

  createInvProduct(payload: {
    name: string;
    subCategoryId: string;
    packagingUom: string;
    packagingUoms?: string[];
    weightUom: WeightUom;
    minStock?: number;
  }): ActionResult {
    const trimmed = (payload.name || '').trim();
    if (trimmed.length < 2 || !payload.subCategoryId) {
      return {
        ok: false,
        message: 'Product name and Sub Category are required.',
      };
    }
    if (payload.minStock !== undefined && Number(payload.minStock) < 0) {
      return { ok: false, message: 'Min stock cannot be negative.' };
    }
    if (
      this.invProductsSubject.value.some(
        (p) => p.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      return { ok: false, message: `Product "${trimmed}" already exists.` };
    }
    const nextNum = this.invProductsSubject.value.length + 1;
    const now = this.formatTimestamp();
    const uoms =
      payload.packagingUoms && payload.packagingUoms.length > 0
        ? payload.packagingUoms
        : payload.packagingUom
          ? payload.packagingUom.split(',').map((s) => s.trim()).filter(Boolean)
          : ['Bag'];
    const packagingUomStr = uoms.join(', ');

    const record: InvProductRecord = {
      id: `PRD-${String(nextNum).padStart(3, '0')}`,
      name: trimmed,
      subCategoryId: payload.subCategoryId,
      packagingUom: packagingUomStr,
      packagingUoms: uoms,
      weightUom: payload.weightUom,
      minStock: payload.minStock !== undefined ? Number(payload.minStock) : 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.invProductsSubject.next([record, ...this.invProductsSubject.value]);
    return { ok: true, message: `Product "${trimmed}" created successfully.` };
  }

  updateInvProduct(
    id: string,
    payload: {
      name: string;
      subCategoryId: string;
      packagingUom: string;
      packagingUoms?: string[];
      weightUom: WeightUom;
      minStock?: number;
    },
  ): ActionResult {
    const existing = this.invProductsSubject.value.find((p) => p.id === id);
    if (!existing) return { ok: false, message: 'Product not found.' };
    const trimmed = (payload.name || '').trim();
    if (trimmed.length < 2 || !payload.subCategoryId) {
      return {
        ok: false,
        message: 'Product name and Sub Category are required.',
      };
    }
    if (payload.minStock !== undefined && Number(payload.minStock) < 0) {
      return { ok: false, message: 'Min stock cannot be negative.' };
    }
    if (
      this.invProductsSubject.value.some(
        (p) => p.id !== id && p.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      return { ok: false, message: `Product "${trimmed}" already exists.` };
    }
    const now = this.formatTimestamp();
    const uoms =
      payload.packagingUoms && payload.packagingUoms.length > 0
        ? payload.packagingUoms
        : payload.packagingUom
          ? payload.packagingUom.split(',').map((s) => s.trim()).filter(Boolean)
          : ['Bag'];
    const packagingUomStr = uoms.join(', ');

    this.invProductsSubject.next(
      this.invProductsSubject.value.map((p) =>
        p.id === id
          ? {
              ...p,
              name: trimmed,
              subCategoryId: payload.subCategoryId,
              packagingUom: packagingUomStr,
              packagingUoms: uoms,
              weightUom: payload.weightUom,
              minStock: payload.minStock !== undefined ? Number(payload.minStock) : (p.minStock ?? 0),
              updatedAt: now,
            }
          : p,
      ),
    );
    return { ok: true, message: `Product "${trimmed}" updated successfully.` };
  }

  toggleInvProductStatus(id: string): ActionResult {
    const existing = this.invProductsSubject.value.find((p) => p.id === id);
    if (!existing) return { ok: false, message: 'Product not found.' };
    const nextActive = !existing.isActive;
    const now = this.formatTimestamp();
    this.invProductsSubject.next(
      this.invProductsSubject.value.map((p) =>
        p.id === id ? { ...p, isActive: nextActive, updatedAt: now } : p,
      ),
    );
    return {
      ok: true,
      message: `${existing.name} marked as ${nextActive ? 'Active' : 'Inactive'}.`,
    };
  }

  // ── Party Ledger Operations ──

  recordLedgerSettlement(payload: {
    date: string;
    partyName: string;
    partyRole: 'Seller' | 'Buyer';
    clientFirm: string;
    entryKind: 'Payment Paid' | 'Payment Received' | 'Rebate / Adjustment';
    ledgerSide: 'Payable' | 'Receivable';
    amountInr: number;
    paymentMode: PaymentMode;
    referenceNo: string;
    saudaNo?: string;
    remarks: string;
  }): ActionResult {
    if (!payload.partyName || !payload.clientFirm || !payload.date) {
      return {
        ok: false,
        message: 'Date, Party Name, and Client Firm are required.',
      };
    }
    if (Number(payload.amountInr) <= 0) {
      return {
        ok: false,
        message: 'Amount must be greater than zero.',
      };
    }
    const nextNum = this.ledgerSettlementsSubject.value.length + 1;
    const now = this.formatTimestamp();
    const record: LedgerSettlementRecord = {
      id: `TXN-2026-${String(nextNum).padStart(4, '0')}`,
      date: payload.date,
      partyName: payload.partyName,
      partyRole: payload.partyRole,
      clientFirm: payload.clientFirm,
      entryKind: payload.entryKind,
      ledgerSide: payload.ledgerSide,
      amountInr: Number(payload.amountInr),
      paymentMode: payload.paymentMode,
      referenceNo: (payload.referenceNo || '').trim() || `REF-${String(nextNum).padStart(4, '0')}`,
      saudaNo: payload.saudaNo || '',
      remarks:
        (payload.remarks || '').trim() ||
        `${payload.entryKind} recorded for ${payload.partyName}`,
      recordedBy: 'Sauda Admin',
      createdAt: now,
    };

    this.ledgerSettlementsSubject.next([
      record,
      ...this.ledgerSettlementsSubject.value,
    ]);
    return {
      ok: true,
      message: `${payload.entryKind} of ₹${Number(payload.amountInr).toLocaleString('en-IN')} recorded for ${payload.partyName}.`,
    };
  }

  // ── Invoice Management Operations (UC-FIN-01 & UC-FIN-04) ──

  getInvoicesSnapshot(): InvoiceRecord[] {
    return this.invoicesSubject.value;
  }

  getInvoiceById(id: string): InvoiceRecord | undefined {
    return this.invoicesSubject.value.find((inv) => inv.id === id || inv.invoiceNo === id);
  }

  getEligibleSaudasForInvoicing(
    clientFirm: string,
    partyName: string,
    partyRole?: 'Seller' | 'Buyer',
  ): SaudaRecord[] {
    const firm = (clientFirm || '').trim().toLowerCase();
    const party = (partyName || '').trim().toLowerCase();

    return this.saudasSubject.value.filter((s) => {
      // BR-IN-03: Only fully fulfilled Saudas are eligible
      if (s.status !== 'Completed') return false;
      // BR-IN-02: Sauda can belong to only one invoice
      if (s.isInvoiced) return false;
      // BR-IN-01: Must match client firm
      if (s.clientFirm.trim().toLowerCase() !== firm) return false;

      // Must match party
      if (partyRole === 'Seller') {
        if (s.saudaType === 'Sales') return false;
        const sParty = (s.sellerName || s.partyName).trim().toLowerCase();
        if (sParty !== party) return false;
      } else if (partyRole === 'Buyer') {
        if (s.saudaType === 'Purchase') return false;
        const bParty = (s.buyerName || s.partyName).trim().toLowerCase();
        if (bParty !== party) return false;
      } else {
        const matches =
          s.partyName.trim().toLowerCase() === party ||
          s.sellerName.trim().toLowerCase() === party ||
          s.buyerName.trim().toLowerCase() === party;
        if (!matches) return false;
      }
      return true;
    });
  }

  createInvoice(payload: {
    clientFirm: string;
    partyName: string;
    partyRole?: 'Seller' | 'Buyer';
    saudaIds: string[];
    finalAmount?: number;
    adjustmentReason?: string;
    issuedBy?: string;
  }): { ok: boolean; message: string; invoice?: InvoiceRecord } {
    if (!payload.clientFirm || !payload.partyName) {
      return { ok: false, message: 'Client Firm and Party Name are mandatory.' };
    }
    if (!payload.saudaIds || payload.saudaIds.length === 0) {
      return {
        ok: false,
        message: 'Please select at least one eligible Sauda to include in the invoice (BR-IN-04).',
      };
    }

    const allSaudas = this.saudasSubject.value;
    const selectedSaudas = allSaudas.filter((s) => payload.saudaIds.includes(s.id));

    if (selectedSaudas.length !== payload.saudaIds.length) {
      return { ok: false, message: 'One or more selected Saudas could not be found.' };
    }

    // BR-IN-01: All Saudas must belong to the selected firm
    for (const s of selectedSaudas) {
      if (s.clientFirm.trim().toLowerCase() !== payload.clientFirm.trim().toLowerCase()) {
        return {
          ok: false,
          message: `Sauda ${s.saudaNo} belongs to a different client firm (${s.clientFirm}). All Saudas must belong to ${payload.clientFirm}.`,
        };
      }
      // BR-IN-03: Must be fully fulfilled
      if (s.status !== 'Completed') {
        return {
          ok: false,
          message: `Sauda ${s.saudaNo} is not fully fulfilled (Current status: ${s.status}). Only fully fulfilled Saudas can be invoiced.`,
        };
      }
      // BR-IN-02: Cannot be invoiced twice
      if (s.isInvoiced) {
        return {
          ok: false,
          message: `Sauda ${s.saudaNo} is already linked to invoice ${s.invoiceNo}.`,
        };
      }
    }

    const originalSum = selectedSaudas.reduce(
      (acc, s) => acc + Number(s.totalAmountInr || 0),
      0,
    );
    const finalAmount =
      payload.finalAmount !== undefined ? Number(payload.finalAmount) : originalSum;

    if (finalAmount <= 0) {
      return { ok: false, message: 'Final invoice amount must be greater than zero.' };
    }

    // BR-IN-05: Mandatory adjustment reason if amount changed
    if (
      finalAmount !== originalSum &&
      (!payload.adjustmentReason || !payload.adjustmentReason.trim())
    ) {
      return {
        ok: false,
        message:
          'Adjustment Reason is strictly mandatory when invoice amount differs from calculated total (BR-IN-05).',
      };
    }

    const nextInvoiceCount = this.invoicesSubject.value.length + 1;
    const invoiceNo = `INV-2026-${String(nextInvoiceCount).padStart(4, '0')}`;
    const invoiceId = invoiceNo;
    const now = this.formatTimestamp();
    const today = new Date().toISOString().slice(0, 10);

    const linkedSaudas: InvoiceLinkedSauda[] = selectedSaudas.map((s) => ({
      saudaId: s.id,
      saudaNo: s.saudaNo,
      saudaDate: s.saudaDate,
      saudaType: s.saudaType,
      commodity: s.commodity,
      quantityMt: s.quantityMt,
      totalAmountInr: Number(s.totalAmountInr || 0),
    }));

    const newInvoice: InvoiceRecord = {
      id: invoiceId,
      invoiceNo,
      invoiceDate: today,
      clientFirm: payload.clientFirm,
      partyName: payload.partyName,
      partyRole:
        payload.partyRole ||
        (selectedSaudas.every((s) => s.saudaType === 'Sales')
          ? 'Buyer'
          : 'Seller'),
      linkedSaudas,
      originalCalculatedAmount: originalSum,
      finalAmount,
      adjustmentAmount: finalAmount - originalSum,
      adjustmentReason: payload.adjustmentReason?.trim() || undefined,
      status: 'Issued',
      issuedBy: payload.issuedBy || 'Operations Executive',
      issuedAt: now,
      createdAt: now,
    };

    // Mark linked saudas as isInvoiced
    const updatedSaudas = allSaudas.map((s) => {
      if (payload.saudaIds.includes(s.id)) {
        return {
          ...s,
          isInvoiced: true,
          invoiceId,
          invoiceNo,
        };
      }
      return s;
    });

    this.saudasSubject.next(updatedSaudas);
    this.invoicesSubject.next([newInvoice, ...this.invoicesSubject.value]);

    return {
      ok: true,
      message: `Invoice ${invoiceNo} successfully created and issued for ${payload.partyName} (₹${finalAmount.toLocaleString('en-IN')}).`,
      invoice: newInvoice,
    };
  }

  recordPaymentAgainstInvoice(payload: {
    invoiceId: string;
    paymentDate: string;
    paymentAmount: number;
    paymentMode: PaymentMode;
    paymentReferenceNo: string;
    bankDetails: string;
    receiptAttachmentName?: string;
    remarks?: string;
    recordedBy?: string;
  }): ActionResult {
    const invoices = this.invoicesSubject.value;
    const invoiceIndex = invoices.findIndex(
      (inv) => inv.id === payload.invoiceId || inv.invoiceNo === payload.invoiceId,
    );

    if (invoiceIndex === -1) {
      return { ok: false, message: 'Invoice not found in the system.' };
    }

    const invoice = invoices[invoiceIndex];

    // BR-PAY-01 & BR-PAY-06: Status validation
    if (invoice.status === 'Paid') {
      return {
        ok: false,
        message: `Invoice ${invoice.invoiceNo} has already been paid and settled.`,
      };
    }
    if (invoice.status !== 'Issued') {
      return {
        ok: false,
        message: `Only invoices in Issued status are eligible for payment recording.`,
      };
    }

    // BR-PAY-02, BR-PAY-03, BR-PAY-04: Strict exact match; no partial payments
    if (Number(payload.paymentAmount) !== Number(invoice.finalAmount)) {
      return {
        ok: false,
        message: `Payment amount (₹${Number(payload.paymentAmount).toLocaleString('en-IN')}) must exactly match the final invoice amount (₹${invoice.finalAmount.toLocaleString('en-IN')}). Partial payments and instalments are not permitted (BR-PAY-02, BR-PAY-04).`,
      };
    }

    if (!payload.paymentDate) {
      return { ok: false, message: 'Payment Date is mandatory.' };
    }
    if (!payload.paymentReferenceNo || !payload.paymentReferenceNo.trim()) {
      return {
        ok: false,
        message: 'Payment Reference Number (UTR / Bank Transaction No / Cheque) is mandatory.',
      };
    }
    if (!payload.bankDetails || !payload.bankDetails.trim()) {
      return {
        ok: false,
        message: 'Bank Details (Bank Name, Branch, Account details) are strictly mandatory (BR-PAY-07).',
      };
    }

    const payCount = (invoice.paymentDetails ? 1 : 0) + 1;
    const payId = `PAY-2026-${String(payCount).padStart(4, '0')}-${Date.now().toString().slice(-4)}`;
    const now = this.formatTimestamp();

    const paymentRecord: InvoicePaymentRecord = {
      id: payId,
      invoiceId: invoice.id,
      invoiceNo: invoice.invoiceNo,
      paymentDate: payload.paymentDate,
      paymentAmount: Number(invoice.finalAmount),
      paymentMode: payload.paymentMode,
      paymentReferenceNo: payload.paymentReferenceNo.trim(),
      bankDetails: payload.bankDetails.trim(),
      receiptAttachmentName: payload.receiptAttachmentName?.trim() || undefined,
      recordedBy: payload.recordedBy || 'Admin / Operations Executive',
      recordedAt: now,
      remarks: payload.remarks?.trim() || `Full payment settlement against invoice ${invoice.invoiceNo}`,
    };

    const updatedInvoice: InvoiceRecord = {
      ...invoice,
      status: 'Paid',
      paymentDetails: paymentRecord,
    };

    const updatedInvoices = [...invoices];
    updatedInvoices[invoiceIndex] = updatedInvoice;
    this.invoicesSubject.next(updatedInvoices);

    // BR-PAY-07: Update corresponding party ledger
    const settlementRecord: LedgerSettlementRecord = {
      id: `TXN-2026-${String(this.ledgerSettlementsSubject.value.length + 1).padStart(4, '0')}`,
      date: payload.paymentDate,
      partyName: invoice.partyName,
      partyRole: invoice.partyRole,
      clientFirm: invoice.clientFirm,
      entryKind: invoice.partyRole === 'Seller' ? 'Payment Paid' : 'Payment Received',
      ledgerSide: invoice.partyRole === 'Seller' ? 'Payable' : 'Receivable',
      amountInr: Number(invoice.finalAmount),
      paymentMode: payload.paymentMode,
      referenceNo: payload.paymentReferenceNo.trim(),
      saudaNo: invoice.invoiceNo,
      remarks:
        payload.remarks?.trim() ||
        `Full settlement of Invoice ${invoice.invoiceNo} via ${payload.bankDetails}`,
      recordedBy: payload.recordedBy || 'Sauda Admin',
      createdAt: now,
    };

    this.ledgerSettlementsSubject.next([
      settlementRecord,
      ...this.ledgerSettlementsSubject.value,
    ]);

    return {
      ok: true,
      message: `Payment of ₹${Number(invoice.finalAmount).toLocaleString('en-IN')} recorded against Invoice ${invoice.invoiceNo}. Invoice marked as Paid.`,
    };
  }

  // ── Packaging UOM Operations ──

  createPackagingUom(name: string, bagQuantity?: number, unit?: string): ActionResult {
    const trimmed = (name || '').trim();
    if (trimmed.length < 2) {
      return { ok: false, message: 'Packaging UOM name must be at least 2 characters.' };
    }
    if (
      this.packagingUomsSubject.value.some(
        (u) => u.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      return { ok: false, message: `Packaging UOM "${trimmed}" already exists.` };
    }
    const nextNum = this.packagingUomsSubject.value.length + 1;
    const now = this.formatTimestamp();
    const record: PackagingUomRecord = {
      id: `PUOM-${String(nextNum).padStart(3, '0')}`,
      name: trimmed,
      bagQuantity: bagQuantity !== undefined ? Number(bagQuantity) : undefined,
      unit: unit || undefined,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.packagingUomsSubject.next([record, ...this.packagingUomsSubject.value]);
    return { ok: true, message: `Packaging UOM "${trimmed}" created successfully.` };
  }

  updatePackagingUom(id: string, name: string, bagQuantity?: number, unit?: string): ActionResult {
    const existing = this.packagingUomsSubject.value.find((u) => u.id === id);
    if (!existing) return { ok: false, message: 'Packaging UOM not found.' };
    const trimmed = (name || '').trim();
    if (trimmed.length < 2) {
      return { ok: false, message: 'Packaging UOM name must be at least 2 characters.' };
    }
    if (
      this.packagingUomsSubject.value.some(
        (u) => u.id !== id && u.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      return { ok: false, message: `Packaging UOM "${trimmed}" already exists.` };
    }
    const now = this.formatTimestamp();
    this.packagingUomsSubject.next(
      this.packagingUomsSubject.value.map((u) =>
        u.id === id
          ? {
              ...u,
              name: trimmed,
              bagQuantity: bagQuantity !== undefined ? Number(bagQuantity) : u.bagQuantity,
              unit: unit !== undefined ? unit : u.unit,
              updatedAt: now,
            }
          : u,
      ),
    );
    return { ok: true, message: `Packaging UOM "${trimmed}" updated successfully.` };
  }

  togglePackagingUomStatus(id: string): ActionResult {
    const existing = this.packagingUomsSubject.value.find((u) => u.id === id);
    if (!existing) return { ok: false, message: 'Packaging UOM not found.' };
    const nextActive = !existing.isActive;
    const now = this.formatTimestamp();
    this.packagingUomsSubject.next(
      this.packagingUomsSubject.value.map((u) =>
        u.id === id ? { ...u, isActive: nextActive, updatedAt: now } : u,
      ),
    );
    return {
      ok: true,
      message: `${existing.name} marked as ${nextActive ? 'Active' : 'Inactive'}.`,
    };
  }

  // ── Weight UOM Operations ──

  createWeightUom(name: string): ActionResult {
    const trimmed = (name || '').trim();
    if (trimmed.length < 1) {
      return { ok: false, message: 'Weight UOM name is required.' };
    }
    if (
      this.weightUomsSubject.value.some(
        (u) => u.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      return { ok: false, message: `Weight UOM "${trimmed}" already exists.` };
    }
    const nextNum = this.weightUomsSubject.value.length + 1;
    const now = this.formatTimestamp();
    const record: WeightUomRecord = {
      id: `WUOM-${String(nextNum).padStart(3, '0')}`,
      name: trimmed,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.weightUomsSubject.next([record, ...this.weightUomsSubject.value]);
    return { ok: true, message: `Weight UOM "${trimmed}" created successfully.` };
  }

  updateWeightUom(id: string, name: string): ActionResult {
    const existing = this.weightUomsSubject.value.find((u) => u.id === id);
    if (!existing) return { ok: false, message: 'Weight UOM not found.' };
    const trimmed = (name || '').trim();
    if (trimmed.length < 1) {
      return { ok: false, message: 'Weight UOM name is required.' };
    }
    if (
      this.weightUomsSubject.value.some(
        (u) => u.id !== id && u.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      return { ok: false, message: `Weight UOM "${trimmed}" already exists.` };
    }
    const now = this.formatTimestamp();
    this.weightUomsSubject.next(
      this.weightUomsSubject.value.map((u) =>
        u.id === id ? { ...u, name: trimmed, updatedAt: now } : u,
      ),
    );
    return { ok: true, message: `Weight UOM "${trimmed}" updated successfully.` };
  }

  toggleWeightUomStatus(id: string): ActionResult {
    const existing = this.weightUomsSubject.value.find((u) => u.id === id);
    if (!existing) return { ok: false, message: 'Weight UOM not found.' };
    const nextActive = !existing.isActive;
    const now = this.formatTimestamp();
    this.weightUomsSubject.next(
      this.weightUomsSubject.value.map((u) =>
        u.id === id ? { ...u, isActive: nextActive, updatedAt: now } : u,
      ),
    );
    return {
      ok: true,
      message: `${existing.name} marked as ${nextActive ? 'Active' : 'Inactive'}.`,
    };
  }

  // ── Warehouse Operations ──

  // ── Warehouse Operations (UC-WH-01, UC-WH-02, UC-WH-03) ──

  createWarehouse(
    payloadOrName:
      | string
      | {
          name: string;
          partyName?: string;
          clientFirm?: string;
          address: string;
          city: string;
          contactPerson?: string;
          contactPhone?: string;
          remarks?: string;
        },
    cityArg?: string,
  ): ActionResult {
    const payload =
      typeof payloadOrName === 'string'
        ? {
            name: payloadOrName,
            address: `${cityArg || 'Industrial Area'} Mandi Depot`,
            city: cityArg || '',
            partyName: 'Sharma Grain Traders',
            clientFirm: 'Desert Fresh Traders',
          }
        : payloadOrName;

    const trimmedName = (payload.name || '').trim();
    const trimmedAddress = (payload.address || '').trim();
    const trimmedCity = (payload.city || '').trim();

    if (trimmedName.length < 2) {
      return { ok: false, message: 'Warehouse name must be at least 2 characters.' };
    }
    if (trimmedAddress.length < 3) {
      return { ok: false, message: 'Warehouse address is mandatory (at least 3 characters).' };
    }
    if (trimmedCity.length < 2) {
      return { ok: false, message: 'City is mandatory (at least 2 characters).' };
    }

    if (
      this.warehousesSubject.value.some(
        (w) =>
          w.name.toLowerCase() === trimmedName.toLowerCase() &&
          w.city.toLowerCase() === trimmedCity.toLowerCase(),
      )
    ) {
      return {
        ok: false,
        message: `Warehouse "${trimmedName}" in city "${trimmedCity}" already exists.`,
      };
    }

    const nextNum = this.warehousesSubject.value.length + 1;
    const now = this.formatTimestamp();
    const effectiveParty = (payload.partyName || payload.clientFirm || '').trim() || 'Sharma Grain Traders';
    const record: WarehouseRecord = {
      id: `WH-${String(nextNum).padStart(3, '0')}`,
      name: trimmedName,
      partyName: effectiveParty,
      clientFirm: effectiveParty,
      address: trimmedAddress,
      city: trimmedCity,
      contactPerson: (payload.contactPerson || '').trim() || undefined,
      contactPhone: (payload.contactPhone || '').trim() || undefined,
      remarks: (payload.remarks || '').trim() || undefined,
      isActive: true,
      createdAt: now,
      createdBy: 'Business Owner / Admin',
      updatedAt: now,
      updatedBy: 'Business Owner / Admin',
    };

    this.warehousesSubject.next([record, ...this.warehousesSubject.value]);
    return { ok: true, message: `Warehouse "${trimmedName}" (${record.id}) created successfully.` };
  }

  updateWarehouse(
    id: string,
    payloadOrName:
      | string
      | {
          name: string;
          partyName?: string;
          clientFirm?: string;
          address: string;
          city: string;
          contactPerson?: string;
          contactPhone?: string;
          remarks?: string;
        },
    cityArg?: string,
  ): ActionResult {
    const existing = this.warehousesSubject.value.find((w) => w.id === id);
    if (!existing) return { ok: false, message: 'Warehouse not found.' };

    const payload =
      typeof payloadOrName === 'string'
        ? {
            name: payloadOrName,
            address: existing.address,
            city: cityArg || existing.city,
            partyName: existing.partyName || existing.clientFirm,
            clientFirm: existing.clientFirm,
          }
        : payloadOrName;

    const trimmedName = (payload.name || '').trim();
    const trimmedAddress = (payload.address || '').trim();
    const trimmedCity = (payload.city || '').trim();

    if (trimmedName.length < 2) {
      return { ok: false, message: 'Warehouse name must be at least 2 characters.' };
    }
    if (trimmedAddress.length < 3) {
      return { ok: false, message: 'Warehouse address is mandatory (at least 3 characters).' };
    }
    if (trimmedCity.length < 2) {
      return { ok: false, message: 'City is mandatory (at least 2 characters).' };
    }

    if (
      this.warehousesSubject.value.some(
        (w) =>
          w.id !== id &&
          w.name.toLowerCase() === trimmedName.toLowerCase() &&
          w.city.toLowerCase() === trimmedCity.toLowerCase(),
      )
    ) {
      return {
        ok: false,
        message: `Warehouse "${trimmedName}" in city "${trimmedCity}" already exists.`,
      };
    }

    const now = this.formatTimestamp();
    const effectiveParty = (payload.partyName || payload.clientFirm || existing.partyName || existing.clientFirm || '').trim();
    this.warehousesSubject.next(
      this.warehousesSubject.value.map((w) =>
        w.id === id
          ? {
              ...w,
              name: trimmedName,
              partyName: effectiveParty,
              clientFirm: effectiveParty,
              address: trimmedAddress,
              city: trimmedCity,
              contactPerson: (payload.contactPerson || '').trim() || undefined,
              contactPhone: (payload.contactPhone || '').trim() || undefined,
              remarks: (payload.remarks || '').trim() || undefined,
              updatedAt: now,
              updatedBy: 'Business Owner / Admin',
            }
          : w,
      ),
    );
    return { ok: true, message: `Warehouse "${trimmedName}" updated successfully.` };
  }

  canDeactivateWarehouse(warehouseId: string): {
    canDeactivate: boolean;
    reasons: string[];
    stockDetails?: string;
    pendingTrucks?: string[];
  } {
    const warehouse = this.warehousesSubject.value.find((w) => w.id === warehouseId);
    if (!warehouse) {
      return { canDeactivate: false, reasons: ['Warehouse record not found.'] };
    }

    const reasons: string[] = [];
    let stockDetails: string | undefined;
    let pendingTrucks: string[] | undefined;

    // 1. Check physical stock balance (BR-WH-03 Extension 8a)
    if (warehouse.id === 'WH-001' || warehouse.name.includes('Desert Mandi')) {
      stockDetails = '45.00 MT (Bags: 900) across Ground Nut and Chana';
      reasons.push(
        `Physical stock balance of ${stockDetails} is currently stored in this warehouse. Physical stock must be cleared through sales dispatches or approved Stock Adjustments before deactivation.`
      );
    } else if (warehouse.id === 'WH-002') {
      stockDetails = '28.50 MT (Bags: 570) across Mustard Seed';
      reasons.push(
        `Physical stock balance of ${stockDetails} is currently stored in this warehouse. Physical stock must be cleared before deactivation.`
      );
    }

    // 2. Check pending truck receipts or dispatches (BR-WH-03 Extension 8b)
    const activeTrucks = this.trucksSubject.value.filter(
      (t) =>
        (t.warehouse === warehouse.name || t.warehouse === warehouse.id) &&
        t.status !== 'Delivered' &&
        t.status !== 'Removed',
    );

    if (activeTrucks.length > 0) {
      pendingTrucks = activeTrucks.map((t) => `${t.entryNo} (${t.status})`);
      reasons.push(
        `Pending truck fulfilment(s) [${pendingTrucks.join(', ')}] are currently associated with this warehouse. Pending fulfilments must be completed or resolved before deactivation.`
      );
    }

    return {
      canDeactivate: reasons.length === 0,
      reasons,
      stockDetails,
      pendingTrucks,
    };
  }

  toggleWarehouseStatus(id: string): ActionResult {
    const existing = this.warehousesSubject.value.find((w) => w.id === id);
    if (!existing) return { ok: false, message: 'Warehouse not found.' };

    if (existing.isActive) {
      const check = this.canDeactivateWarehouse(id);
      if (!check.canDeactivate) {
        return {
          ok: false,
          message: check.reasons.join(' | '),
        };
      }
    }

    const nextActive = !existing.isActive;
    const now = this.formatTimestamp();
    this.warehousesSubject.next(
      this.warehousesSubject.value.map((w) =>
        w.id === id
          ? {
              ...w,
              isActive: nextActive,
              updatedAt: now,
              updatedBy: 'Business Owner / Admin',
            }
          : w,
      ),
    );
    return {
      ok: true,
      message: `Warehouse "${existing.name}" (${id}) successfully marked as ${nextActive ? 'Active' : 'Inactive'}.`,
    };
  }

  // ── Godown Operations (4-Level Storage Hierarchy: Warehouse -> Godown -> Chamber -> Stack) ──

  createGodown(payload: {
    warehouseId: string;
    name: string;
    supervisor?: string;
    supervisorPhone?: string;
    capacityMt?: number;
    remarks?: string;
    chambers: ChamberConfig[];
  }): ActionResult {
    const trimmedName = (payload.name || '').trim();
    if (trimmedName.length < 2) {
      return { ok: false, message: 'Godown name must be at least 2 characters.' };
    }
    const wh = this.warehousesSubject.value.find((w) => w.id === payload.warehouseId);
    if (!wh) {
      return { ok: false, message: 'Please select a valid Warehouse.' };
    }

    if (
      this.godownsSubject.value.some(
        (g) =>
          g.warehouseId === payload.warehouseId &&
          g.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      return {
        ok: false,
        message: `Godown "${trimmedName}" already exists under warehouse "${wh.name}".`,
      };
    }

    const nextNum = this.godownsSubject.value.length + 1;
    const now = this.formatTimestamp();

    const formattedChambers: ChamberConfig[] = (payload.chambers || []).map(
      (c, idx) => ({
        id: c.id || `CH-${String(idx + 1).padStart(2, '0')}`,
        name: (c.name || '').trim() || `Chamber ${idx + 1}`,
        capacityMt: c.capacityMt ? Number(c.capacityMt) : undefined,
        stackNumbers: (c.stackNumbers || []).map((s) => s.trim()).filter((s) => !!s),
      }),
    );

    const record: GodownRecord = {
      id: `GD-${String(nextNum).padStart(3, '0')}`,
      warehouseId: wh.id,
      warehouseName: wh.name,
      name: trimmedName,
      supervisor: (payload.supervisor || '').trim() || undefined,
      supervisorPhone: (payload.supervisorPhone || '').trim() || undefined,
      capacityMt: payload.capacityMt ? Number(payload.capacityMt) : undefined,
      remarks: (payload.remarks || '').trim() || undefined,
      chambers: formattedChambers,
      isActive: true,
      createdAt: now,
      createdBy: 'Business Owner / Admin',
      updatedAt: now,
      updatedBy: 'Business Owner / Admin',
    };

    this.godownsSubject.next([record, ...this.godownsSubject.value]);
    return { ok: true, message: `Godown "${trimmedName}" created successfully under ${wh.name}.` };
  }

  updateGodown(
    id: string,
    payload: {
      warehouseId: string;
      name: string;
      supervisor?: string;
      supervisorPhone?: string;
      capacityMt?: number;
      remarks?: string;
      chambers: ChamberConfig[];
    },
  ): ActionResult {
    const existing = this.godownsSubject.value.find((g) => g.id === id);
    if (!existing) return { ok: false, message: 'Godown not found.' };

    const trimmedName = (payload.name || '').trim();
    if (trimmedName.length < 2) {
      return { ok: false, message: 'Godown name must be at least 2 characters.' };
    }
    const wh = this.warehousesSubject.value.find((w) => w.id === payload.warehouseId);
    if (!wh) {
      return { ok: false, message: 'Please select a valid Warehouse.' };
    }

    if (
      this.godownsSubject.value.some(
        (g) =>
          g.id !== id &&
          g.warehouseId === payload.warehouseId &&
          g.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      return {
        ok: false,
        message: `Godown "${trimmedName}" already exists under warehouse "${wh.name}".`,
      };
    }

    const now = this.formatTimestamp();
    const formattedChambers: ChamberConfig[] = (payload.chambers || []).map(
      (c, idx) => ({
        id: c.id || `CH-${String(idx + 1).padStart(2, '0')}`,
        name: (c.name || '').trim() || `Chamber ${idx + 1}`,
        capacityMt: c.capacityMt ? Number(c.capacityMt) : undefined,
        stackNumbers: (c.stackNumbers || []).map((s) => s.trim()).filter((s) => !!s),
      }),
    );

    this.godownsSubject.next(
      this.godownsSubject.value.map((g) =>
        g.id === id
          ? {
              ...g,
              warehouseId: wh.id,
              warehouseName: wh.name,
              name: trimmedName,
              supervisor: (payload.supervisor || '').trim() || undefined,
              supervisorPhone: (payload.supervisorPhone || '').trim() || undefined,
              capacityMt: payload.capacityMt ? Number(payload.capacityMt) : undefined,
              remarks: (payload.remarks || '').trim() || undefined,
              chambers: formattedChambers,
              updatedAt: now,
              updatedBy: 'Business Owner / Admin',
            }
          : g,
      ),
    );
    return { ok: true, message: `Godown "${trimmedName}" updated successfully.` };
  }

  toggleGodownStatus(id: string): ActionResult {
    const existing = this.godownsSubject.value.find((g) => g.id === id);
    if (!existing) return { ok: false, message: 'Godown not found.' };

    const nextActive = !existing.isActive;
    const now = this.formatTimestamp();
    this.godownsSubject.next(
      this.godownsSubject.value.map((g) =>
        g.id === id
          ? {
              ...g,
              isActive: nextActive,
              updatedAt: now,
              updatedBy: 'Business Owner / Admin',
            }
          : g,
      ),
    );
    return {
      ok: true,
      message: `Godown "${existing.name}" marked as ${nextActive ? 'Active' : 'Inactive'}.`,
    };
  }

  deleteGodown(id: string): ActionResult {
    const existing = this.godownsSubject.value.find((g) => g.id === id);
    if (!existing) return { ok: false, message: 'Godown not found.' };

    this.godownsSubject.next(this.godownsSubject.value.filter((g) => g.id !== id));
    return { ok: true, message: `Godown "${existing.name}" deleted successfully.` };
  }

  getHeldPurchaseSaudas(): SaudaRecord[] {
    return this.saudasSubject.value.filter(
      (s) =>
        s.saudaType === 'Purchase' &&
        s.status !== 'Voided' &&
        (s.heldQuantityMt === undefined || s.heldQuantityMt > 0),
    );
  }

  // ── Internal Helpers ──

  private recomputeAllSaudaStatuses(): void {
    const trucks = this.trucksSubject.value;
    const updated = this.saudasSubject.value.map((sauda) => {
      if (sauda.status === 'Voided') {
        return sauda;
      }
      if (sauda.saudaType === 'Forward') {
        // Forward deals remain 'On Hold' until executed into 'Open'
        return sauda;
      }
      if (sauda.saudaType === 'Brokerage' || sauda.saudaType === 'Direct Sale') {
        return { ...sauda, status: (sauda.status === 'Completed' ? 'Completed' : 'Open') as SaudaStatus };
      }
      const dispatched = trucks
        .filter((t) => t.saudaId === sauda.id && t.status !== 'Removed')
        .reduce((sum, t) => sum + Number(t.loadedQtyMt || 0), 0);

      let status: SaudaStatus = 'Open';
      if (sauda.quantityMt > 0 && dispatched >= sauda.quantityMt) {
        status = 'Completed';
      } else if (dispatched > 0) {
        status = 'Partial';
      }
      return { ...sauda, status };
    });
    this.saudasSubject.next(updated);
  }

  // ==========================================
  // USER MANAGEMENT (UC-USR-01, 02, 03)
  // ==========================================
  getUsersSnapshot(): UserRecord[] {
    return this.usersSubject.value;
  }

  createUser(
    payload: {
      name: string;
      email: string;
      mobile: string;
      userType: UserType;
      primaryFirm: string;
    },
    createdBy = 'Admin',
  ): ActionResult {
    const name = (payload.name || '').trim();
    const email = (payload.email || '').trim().toLowerCase();
    const mobile = (payload.mobile || '').trim();
    const userType = payload.userType;
    const primaryFirm = (payload.primaryFirm || '').trim();

    if (name.length < 2) {
      return { ok: false, message: 'User name must be at least 2 characters.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { ok: false, message: 'Please enter a valid email address.' };
    }
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      return { ok: false, message: 'Please enter a valid 10-digit mobile number.' };
    }
    if (!userType) {
      return { ok: false, message: 'Please select a User Type (Role).' };
    }
    if (!primaryFirm) {
      return { ok: false, message: 'Please select at least one Primary Firm.' };
    }

    const currentUsers = this.usersSubject.value;
    if (currentUsers.some((u) => u.email.toLowerCase() === email)) {
      return {
        ok: false,
        message: 'The proposed email address is already associated with another user account.',
      };
    }
    if (
      currentUsers.some(
        (u) => u.mobile.replace(/\D/g, '') === cleanMobile,
      )
    ) {
      return {
        ok: false,
        message: 'The proposed mobile number is already associated with another user account.',
      };
    }

    // Generate unique User ID
    const maxNum = currentUsers.reduce((max, u) => {
      const match = u.id.match(/USR-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        return num > max ? num : max;
      }
      return max;
    }, 0);
    const newId = `USR-${String(maxNum + 1).padStart(3, '0')}`;
    const timestamp = this.formatTimestamp();

    const newUser: UserRecord = {
      id: newId,
      name,
      email,
      mobile,
      userType,
      primaryFirm,
      accountStatus: 'Active',
      passwordSetupStatus: 'Pending',
      createdBy,
      createdAt: timestamp,
      updatedBy: createdBy,
      updatedAt: timestamp,
    };

    this.usersSubject.next([...currentUsers, newUser]);
    return {
      ok: true,
      message: `User account created successfully (${newId}). Invitation email with setup link sent to ${email}.`,
    };
  }

  updateUser(
    id: string,
    payload: {
      name: string;
      email: string;
      mobile: string;
      userType: UserType;
      primaryFirm: string;
    },
    updatedBy = 'Admin',
  ): ActionResult {
    const currentUsers = this.usersSubject.value;
    const target = currentUsers.find((u) => u.id === id);
    if (!target) {
      return { ok: false, message: 'User account not found.' };
    }

    const name = (payload.name || '').trim();
    const email = (payload.email || '').trim().toLowerCase();
    const mobile = (payload.mobile || '').trim();
    const userType = payload.userType;
    const primaryFirm = (payload.primaryFirm || '').trim();

    if (name.length < 2) {
      return { ok: false, message: 'User name must be at least 2 characters.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { ok: false, message: 'Please enter a valid email address.' };
    }
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      return { ok: false, message: 'Please enter a valid 10-digit mobile number.' };
    }
    if (!userType) {
      return { ok: false, message: 'Please select a User Type (Role).' };
    }
    if (!primaryFirm) {
      return { ok: false, message: 'Please select at least one Primary Firm.' };
    }

    // Uniqueness checks excluding current user
    if (
      currentUsers.some(
        (u) => u.id !== id && u.email.toLowerCase() === email,
      )
    ) {
      return {
        ok: false,
        message: 'The email address is already in use by another user account.',
      };
    }
    if (
      currentUsers.some(
        (u) => u.id !== id && u.mobile.replace(/\D/g, '') === cleanMobile,
      )
    ) {
      return {
        ok: false,
        message: 'The mobile number is already in use by another user account.',
      };
    }

    // Last Active Admin safeguard (UC-USR-03 Rule 6b)
    if (
      target.userType === 'Business Owner / Admin' &&
      target.accountStatus === 'Active' &&
      userType !== 'Business Owner / Admin'
    ) {
      const activeAdmins = currentUsers.filter(
        (u) =>
          u.userType === 'Business Owner / Admin' &&
          u.accountStatus === 'Active',
      );
      if (activeAdmins.length <= 1) {
        return {
          ok: false,
          message:
            'Cannot demote the last Active Admin account. At least one Active Admin must always exist.',
        };
      }
    }

    const timestamp = this.formatTimestamp();
    const updated = currentUsers.map((u) => {
      if (u.id === id) {
        return {
          ...u,
          name,
          email,
          mobile,
          userType,
          primaryFirm,
          updatedBy,
          updatedAt: timestamp,
        };
      }
      return u;
    });

    this.usersSubject.next(updated);
    return { ok: true, message: `User ${name} (${id}) updated successfully.` };
  }

  toggleUserStatus(id: string, updatedBy = 'Admin'): ActionResult {
    const currentUsers = this.usersSubject.value;
    const target = currentUsers.find((u) => u.id === id);
    if (!target) {
      return { ok: false, message: 'User account not found.' };
    }

    // Last Active Admin safeguard (UC-USR-03 Rule 6b)
    if (
      target.accountStatus === 'Active' &&
      target.userType === 'Business Owner / Admin'
    ) {
      const activeAdmins = currentUsers.filter(
        (u) =>
          u.userType === 'Business Owner / Admin' &&
          u.accountStatus === 'Active',
      );
      if (activeAdmins.length <= 1) {
        return {
          ok: false,
          message:
            'Cannot deactivate the last Active Admin account. At least one Active Admin must always exist.',
        };
      }
    }

    const newStatus: AccountStatus =
      target.accountStatus === 'Active' ? 'Inactive' : 'Active';
    const timestamp = this.formatTimestamp();

    const updated = currentUsers.map((u) => {
      if (u.id === id) {
        return {
          ...u,
          accountStatus: newStatus,
          updatedBy,
          updatedAt: timestamp,
        };
      }
      return u;
    });

    this.usersSubject.next(updated);
    return {
      ok: true,
      message: `User ${target.name} (${id}) account status set to ${newStatus}.`,
    };
  }

  resendUserInvite(id: string): ActionResult {
    const currentUsers = this.usersSubject.value;
    const target = currentUsers.find((u) => u.id === id);
    if (!target) {
      return { ok: false, message: 'User account not found.' };
    }
    return {
      ok: true,
      message: `Invitation email resent to ${target.email} with an expiring password-setup link.`,
    };
  }

  // ==========================================
  // JOURNAL ENTRIES (JUNRAL ENTRY)
  // ==========================================
  getJournalEntriesSnapshot(): JournalEntryRecord[] {
    return this.journalEntriesSubject.value;
  }

  createJournalEntry(payload: Omit<JournalEntryRecord, 'id' | 'voucherNo' | 'createdAt'>): {
    ok: boolean;
    message: string;
    record?: JournalEntryRecord;
  } {
    const nextNum = this.journalEntriesSubject.value.length + 1;
    const voucherNo = `JRN-2026-${String(nextNum).padStart(4, '0')}`;
    const newEntry: JournalEntryRecord = {
      ...payload,
      id: voucherNo,
      voucherNo,
      createdAt: this.formatTimestamp(),
    };

    // If linked to an invoice, deduct adjustments from invoice final amount or mark settled
    if (payload.invoiceNo) {
      const invs = this.invoicesSubject.value;
      const targetInv = invs.find((inv) => inv.invoiceNo === payload.invoiceNo);
      if (targetInv) {
        const remaining = Math.max(0, targetInv.finalAmount - (payload.totalAdjustments || 0));
        const updatedInvs = invs.map((inv) =>
          inv.id === targetInv.id
            ? {
                ...inv,
                finalAmount: remaining,
                adjustmentAmount: (inv.adjustmentAmount || 0) - (payload.totalAdjustments || 0),
                status: remaining === 0 ? ('Paid' as InvoiceStatus) : inv.status,
              }
            : inv,
        );
        this.invoicesSubject.next(updatedInvs);
      }
    }

    this.journalEntriesSubject.next([newEntry, ...this.journalEntriesSubject.value]);
    return {
      ok: true,
      message: `Journal voucher ${voucherNo} successfully created and posted against Invoice ${payload.invoiceNo}.`,
      record: newEntry,
    };
  }

  getPendingInvoices(): InvoiceRecord[] {
    return this.invoicesSubject.value.filter((inv) => inv.status !== 'Paid');
  }

  // ==========================================
  // PAYMENT ENTRIES (PAYMENT ENTERY)
  // ==========================================
  getPaymentEntriesSnapshot(): PaymentEntryRecord[] {
    return this.paymentEntriesSubject.value;
  }

  createPaymentEntry(payload: Omit<PaymentEntryRecord, 'id' | 'balanceAfter' | 'createdAt'>): {
    ok: boolean;
    message: string;
    record?: PaymentEntryRecord;
  } {
    const currentList = this.paymentEntriesSubject.value;
    const prevBalance = currentList.length > 0 ? currentList[currentList.length - 1].balanceAfter : 0;
    const newBalance = Number(
      (prevBalance + Number(payload.receivedAmount || 0) - Number(payload.paymentAmount || 0)).toFixed(2),
    );
    const nextNum = currentList.length + 1;
    const id = `PAY-2026-${String(nextNum).padStart(4, '0')}`;
    const newEntry: PaymentEntryRecord = {
      ...payload,
      id,
      balanceAfter: newBalance,
      createdAt: this.formatTimestamp(),
    };

    this.paymentEntriesSubject.next([...currentList, newEntry]);
    return {
      ok: true,
      message: `Payment entry recorded successfully. Current Balance: ₹${newBalance.toLocaleString('en-IN')}.`,
      record: newEntry,
    };
  }

  importPaymentEntries(
    records: Omit<PaymentEntryRecord, 'id' | 'balanceAfter' | 'createdAt'>[],
  ): { ok: boolean; message: string; count: number } {
    let currentBalance =
      this.paymentEntriesSubject.value.length > 0
        ? this.paymentEntriesSubject.value[this.paymentEntriesSubject.value.length - 1].balanceAfter
        : 0;

    let nextNum = this.paymentEntriesSubject.value.length + 1;
    const newRecords: PaymentEntryRecord[] = [];

    for (const r of records) {
      currentBalance = Number(
        (currentBalance + Number(r.receivedAmount || 0) - Number(r.paymentAmount || 0)).toFixed(2),
      );
      newRecords.push({
        ...r,
        id: `PAY-2026-${String(nextNum++).padStart(4, '0')}`,
        balanceAfter: currentBalance,
        createdAt: this.formatTimestamp(),
      });
    }

    this.paymentEntriesSubject.next([...this.paymentEntriesSubject.value, ...newRecords]);
    return {
      ok: true,
      message: `Successfully imported ${newRecords.length} payment entries from Excel file.`,
      count: newRecords.length,
    };
  }

  private pushDiff(
    changes: RevisionDiff[],
    field: string,
    oldVal?: string | null,
    newVal?: string | null,
  ): void {
    if ((oldVal || '') !== (newVal || '')) {
      changes.push({
        field,
        oldValue: oldVal || '—',
        newValue: newVal || '—',
      });
    }
  }

  private formatTimestamp(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}

