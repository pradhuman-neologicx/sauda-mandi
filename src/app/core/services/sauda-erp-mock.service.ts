import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SaudaType = 'Purchase' | 'Sales' | 'Brokerage';
export type SaudaStatus = 'Open' | 'Partial' | 'Completed' | 'Voided';
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
  packagingUom: PackagingUom;
  packagingQty: number;
  weightUom: WeightUom;
  actualWeight: number;
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
  totalAmountInr: number;
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
  voidInfo?: {
    voidedBy: string;
    voidedAt: string;
    reason: string;
  };
  revisions: RevisionEntry[];
}

export interface TruckEntryRecord {
  id: string;
  entryNo: string;
  saudaId: string;
  saudaNo: string;
  saudaType: SaudaType;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  transporterName: string;
  lrNo: string;
  commodityItems: CommodityLineItem[];
  commodities: string;
  loadedQtyMt: number;
  freightRatePerMt: number;
  advancePaid: number;
  dispatchDate: string;
  expectedArrivalDate: string;
  status: TruckStatus;
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  productId: string;
  productName: string;
  categoryId: string;
  categoryName: string;
  subCategoryName: string;
  commodity: string;
  clientFirm: string;
  packagingUom: PackagingUom;
  availableUnits: number;
  availableWeightMt: number;
  minThresholdMt: number;
  lastUpdated: string;
  logs: InventoryLogEntry[];
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
  packagingUom: PackagingUom;
  weightUom: WeightUom;
  minStock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PackagingUomRecord {
  id: string;
  name: string;
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
  city: string;
  isActive: boolean;
  createdAt: string;
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
      commodityItems: [
        {
          commodity: 'Bajra',
          packagingUom: 'Bag',
          packagingQty: 150,
          weightUom: 'Quintal',
          actualWeight: 30,
        },
        {
          commodity: 'Jowar',
          packagingUom: 'Bag',
          packagingQty: 100,
          weightUom: 'Quintal',
          actualWeight: 20,
        },
      ],
      commodity: 'Bajra, Jowar',
      quantityMt: 5,
      totalAmountInr: 150000,
      sellerCreditPeriodDays: 15,
      sellerCreditStartDate: '2026-11-04',
      sellerDueDate: '2026-11-19',
      buyerCreditPeriodDays: null,
      buyerCreditStartDate: '',
      buyerDueDate: '',
      remarks: 'Cleaned Shree Anna millet lots, standard 50kg bags',
      status: 'Partial',
      currentVersion: 2,
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
    },
    {
      id: 'SAU-2026-0002',
      saudaNo: 'SAU-2026-0002',
      saudaDate: '2026-11-05',
      saudaType: 'Sales',
      clientFirm: 'Desert Fresh Traders',
      sellerName: '',
      buyerName: 'City Wholesale Market',
      partyName: 'City Wholesale Market',
      commodityItems: [
        {
          commodity: 'Wheat',
          packagingUom: 'Bag',
          packagingQty: 100,
          weightUom: 'Quintal',
          actualWeight: 50,
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
      commodityItems: [
        {
          commodity: 'Bajra',
          packagingUom: 'Bag',
          packagingQty: 200,
          weightUom: 'Quintal',
          actualWeight: 100,
        },
      ],
      commodity: 'Bajra',
      quantityMt: 10,
      totalAmountInr: 250000,
      sellerCreditPeriodDays: 10,
      sellerCreditStartDate: '2026-11-06',
      sellerDueDate: '2026-11-16',
      buyerCreditPeriodDays: 15,
      buyerCreditStartDate: '2026-11-06',
      buyerDueDate: '2026-11-21',
      remarks: 'Brokerage agreement settled for Desi Hybrid Bajra lot',
      status: 'Partial',
      currentVersion: 1,
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-06 09:50',
      updatedAt: '2026-11-06 09:50',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-06 09:50',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: 'Brokerage agreement finalized',
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
        },
      ],
      commodity: 'Maize',
      quantityMt: 5,
      totalAmountInr: 95000,
      sellerCreditPeriodDays: 30,
      sellerCreditStartDate: '2026-11-07',
      sellerDueDate: '2026-12-07',
      buyerCreditPeriodDays: null,
      buyerCreditStartDate: '',
      buyerDueDate: '',
      remarks: 'Yellow Field Maize purchase, awaiting truck placement',
      status: 'Open',
      currentVersion: 1,
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
        },
      ],
      commodity: 'Ragi',
      quantityMt: 6,
      totalAmountInr: 210000,
      sellerCreditPeriodDays: 7,
      sellerCreditStartDate: '2026-11-03',
      sellerDueDate: '2026-11-10',
      buyerCreditPeriodDays: null,
      buyerCreditStartDate: '',
      buyerDueDate: '',
      remarks: 'Duplicate contract entry from morning floor',
      status: 'Voided',
      currentVersion: 2,
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
  ];

  private readonly initialTrucks: TruckEntryRecord[] = [
    {
      id: 'TRK-2026-0001',
      entryNo: 'TRK-2026-0001',
      saudaId: 'SAU-2026-0001',
      saudaNo: 'SAU-2026-0001',
      saudaType: 'Purchase',
      vehicleNo: 'RJ07-GA-1234',
      driverName: 'Ramesh Choudhary',
      driverPhone: '9829011223',
      transporterName: 'Marwar Roadways',
      lrNo: 'LR-88412',
      commodityItems: [
        {
          commodity: 'Bajra',
          packagingUom: 'Bag',
          packagingQty: 40,
          weightUom: 'Quintal',
          actualWeight: 8,
        },
      ],
      commodities: 'Bajra',
      loadedQtyMt: 0.8,
      freightRatePerMt: 1150,
      advancePaid: 0,
      dispatchDate: '2026-11-05',
      expectedArrivalDate: '2026-11-07',
      status: 'In Transit',
      remarks: '',
      currentVersion: 1,
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-05 15:10',
      updatedAt: '2026-11-05 15:10',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-05 15:10',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: 'Initial truck entry linked to SAU-2026-0001',
          changes: [
            { field: 'Truck Number', oldValue: '-', newValue: 'RJ07-GA-1234' },
            { field: 'Commodities', oldValue: '-', newValue: 'Bajra (8 Quintal)' },
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
      vehicleNo: 'RJ07-GA-1234',
      driverName: 'Suresh Gurjar',
      driverPhone: '9828144556',
      transporterName: 'Kota Freight Carriers',
      lrNo: 'LR-88445',
      commodityItems: [
        {
          commodity: 'Bajra',
          packagingUom: 'Bag',
          packagingQty: 50,
          weightUom: 'Quintal',
          actualWeight: 10,
        },
        {
          commodity: 'Jowar',
          packagingUom: 'Bag',
          packagingQty: 50,
          weightUom: 'Quintal',
          actualWeight: 10,
        },
      ],
      commodities: 'Bajra, Jowar',
      loadedQtyMt: 2,
      freightRatePerMt: 1200,
      advancePaid: 1000,
      dispatchDate: '2026-11-06',
      expectedArrivalDate: '2026-11-08',
      status: 'Loaded',
      remarks: 'Second dispatch lot',
      currentVersion: 2,
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-06 09:20',
      updatedAt: '2026-11-06 17:45',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-06 09:20',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: 'Scheduled second truck for SAU-2026-0001',
          changes: [
            { field: 'Commodities', oldValue: '-', newValue: 'Bajra' },
            { field: 'Weight (MT)', oldValue: '-', newValue: '1 MT' },
          ],
        },
        {
          version: 2,
          changedAt: '2026-11-06 17:45',
          changedBy: 'Sauda Admin',
          action: 'Updated',
          reason: 'Added Jowar bags and updated weighment',
          changes: [
            {
              field: 'Commodities',
              oldValue: 'Bajra',
              newValue: 'Bajra, Jowar',
            },
            { field: 'Weight (MT)', oldValue: '1 MT', newValue: '2 MT' },
          ],
        },
      ],
    },
    {
      id: 'TRK-2026-0003',
      entryNo: 'TRK-2026-0003',
      saudaId: 'SAU-2026-0002',
      saudaNo: 'SAU-2026-0002',
      saudaType: 'Sales',
      vehicleNo: 'RJ14-AB-5678',
      driverName: 'Vikram Singh',
      driverPhone: '9755099881',
      transporterName: 'Malwa Logistics',
      lrNo: 'LR-88491',
      commodityItems: [
        {
          commodity: 'Wheat',
          packagingUom: 'Bag',
          packagingQty: 100,
          weightUom: 'Quintal',
          actualWeight: 50,
        },
      ],
      commodities: 'Wheat',
      loadedQtyMt: 5,
      freightRatePerMt: 1350,
      advancePaid: 3000,
      dispatchDate: '2026-11-07',
      expectedArrivalDate: '2026-11-09',
      status: 'Delivered',
      remarks: 'Full contract delivered',
      currentVersion: 1,
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-07 12:30',
      updatedAt: '2026-11-09 16:00',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-07 12:30',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: 'Full lot dispatch for City Wholesale Market',
          changes: [
            { field: 'Commodities', oldValue: '-', newValue: 'Wheat (50 Quintal)' },
            { field: 'Status', oldValue: '-', newValue: 'Delivered' },
          ],
        },
      ],
    },
    {
      id: 'TRK-2026-0004',
      entryNo: 'TRK-2026-0004',
      saudaId: 'SAU-2026-0003',
      saudaNo: 'SAU-2026-0003',
      saudaType: 'Brokerage',
      vehicleNo: 'RJ20-GB-9104',
      driverName: 'Dinesh Jat',
      driverPhone: '9928377611',
      transporterName: 'Bundi Agro Transport',
      lrNo: 'LR-88510',
      commodityItems: [
        {
          commodity: 'Bajra',
          packagingUom: 'Bag',
          packagingQty: 80,
          weightUom: 'Quintal',
          actualWeight: 40,
        },
      ],
      commodities: 'Bajra',
      loadedQtyMt: 4,
      freightRatePerMt: 980,
      advancePaid: 1500,
      dispatchDate: '2026-11-08',
      expectedArrivalDate: '2026-11-10',
      status: 'In Transit',
      remarks: 'Tarpaulin sealed, ready for gate pass',
      currentVersion: 1,
      createdBy: 'Sauda Admin',
      createdAt: '2026-11-08 18:10',
      updatedAt: '2026-11-08 18:10',
      revisions: [
        {
          version: 1,
          changedAt: '2026-11-08 18:10',
          changedBy: 'Sauda Admin',
          action: 'Created',
          reason: 'Brokerage Bajra loading completed',
          changes: [
            { field: 'Commodities', oldValue: '-', newValue: 'Bajra (40 Quintal)' },
            { field: 'Status', oldValue: '-', newValue: 'In Transit' },
          ],
        },
      ],
    },
  ];

  private readonly initialFirms: FirmRecord[] = [
    {
      id: 'FRM-001',
      name: 'Desert Fresh Traders',
      isActive: true,
      createdAt: '2026-11-01 09:30',
      updatedAt: '2026-11-01 09:30',
    },
    {
      id: 'FRM-002',
      name: 'Rajasthan Agro',
      isActive: true,
      createdAt: '2026-11-02 11:15',
      updatedAt: '2026-11-02 11:15',
    },
    {
      id: 'FRM-003',
      name: 'Shree Ganesh Agro Mills',
      isActive: true,
      createdAt: '2026-11-04 14:20',
      updatedAt: '2026-11-04 14:20',
    },
    {
      id: 'FRM-004',
      name: 'Kisan Krishi Mandi Samiti',
      isActive: true,
      createdAt: '2026-11-05 16:40',
      updatedAt: '2026-11-05 16:40',
    },
    {
      id: 'FRM-005',
      name: 'Om Sai Traders Kota',
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
          remarks: 'Brokerage transit stock against SAU-2026-0003',
          doneBy: 'Sauda Admin',
        },
      ],
    },
    {
      id: 'INV-005',
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

  private readonly initialPackagingUoms: PackagingUomRecord[] = [
    { id: 'PUOM-001', name: 'Bag', isActive: true, createdAt: '2026-11-01 09:00', updatedAt: '2026-11-01 09:00' },
    { id: 'PUOM-002', name: 'Crate', isActive: true, createdAt: '2026-11-01 09:05', updatedAt: '2026-11-01 09:05' },
    { id: 'PUOM-003', name: 'Box', isActive: true, createdAt: '2026-11-01 09:10', updatedAt: '2026-11-01 09:10' },
    { id: 'PUOM-004', name: 'Carton', isActive: true, createdAt: '2026-11-01 09:15', updatedAt: '2026-11-01 09:15' },
    { id: 'PUOM-005', name: 'Sack', isActive: true, createdAt: '2026-11-01 09:20', updatedAt: '2026-11-01 09:20' },
    { id: 'PUOM-006', name: 'Loose', isActive: true, createdAt: '2026-11-01 09:25', updatedAt: '2026-11-01 09:25' },
  ];

  private readonly initialWeightUoms: WeightUomRecord[] = [
    { id: 'WUOM-001', name: 'KG', isActive: true, createdAt: '2026-11-01 09:00', updatedAt: '2026-11-01 09:00' },
    { id: 'WUOM-002', name: 'Quintal', isActive: true, createdAt: '2026-11-01 09:05', updatedAt: '2026-11-01 09:05' },
    { id: 'WUOM-003', name: 'MT', isActive: true, createdAt: '2026-11-01 09:10', updatedAt: '2026-11-01 09:10' },
  ];

  private readonly initialWarehouses: WarehouseRecord[] = [
    { id: 'WH-001', name: 'Desert Mandi Yard A', city: 'Jodhpur', isActive: true, createdAt: '2026-11-01 10:00', updatedAt: '2026-11-01 10:00' },
    { id: 'WH-002', name: 'Fresh Terminal Cold Hub', city: 'Jaipur', isActive: true, createdAt: '2026-11-01 10:15', updatedAt: '2026-11-01 10:15' },
    { id: 'WH-003', name: 'Rajasthan Agro Godown 4', city: 'Bikaner', isActive: true, createdAt: '2026-11-01 10:30', updatedAt: '2026-11-01 10:30' },
    { id: 'WH-004', name: 'Kota Grain Silo', city: 'Kota', isActive: true, createdAt: '2026-11-01 10:45', updatedAt: '2026-11-01 10:45' },
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
  private warehousesSubject = new BehaviorSubject<WarehouseRecord[]>(
    this.initialWarehouses,
  );

  readonly saudas$ = this.saudasSubject.asObservable();
  readonly trucks$ = this.trucksSubject.asObservable();
  readonly firms$ = this.firmsSubject.asObservable();
  readonly sellers$ = this.sellersSubject.asObservable();
  readonly buyers$ = this.buyersSubject.asObservable();
  readonly commodities$ = this.commoditiesSubject.asObservable();
  readonly inventory$ = this.inventorySubject.asObservable();
  readonly invCategories$ = this.invCategoriesSubject.asObservable();
  readonly invSubCategories$ = this.invSubCategoriesSubject.asObservable();
  readonly invProducts$ = this.invProductsSubject.asObservable();
  readonly ledgerSettlements$ = this.ledgerSettlementsSubject.asObservable();
  readonly packagingUoms$ = this.packagingUomsSubject.asObservable();
  readonly weightUoms$ = this.weightUomsSubject.asObservable();
  readonly warehouses$ = this.warehousesSubject.asObservable();

  constructor() {
    this.recomputeAllSaudaStatuses();
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
      if (Number(item.packagingQty) <= 0 || Number(item.actualWeight) <= 0) {
        return {
          ok: false,
          message: 'Packaging quantity and actual weight must be greater than zero.',
        };
      }
    }

    if (Number(payload.totalAmountInr) <= 0) {
      return {
        ok: false,
        message: 'Total Sauda Amount must be greater than zero.',
      };
    }

    const quantityMt = this.computeTotalWeightMt(payload.commodityItems);
    const commodity = payload.commodityItems.map((i) => i.commodity).join(', ');
    const partyName = this.derivePartyName(
      payload.saudaType,
      payload.sellerName,
      payload.buyerName,
    );

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
      status: 'Open',
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
    return { ok: true, message: `Sauda ${code} created successfully.` };
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
      if (Number(item.packagingQty) <= 0 || Number(item.actualWeight) <= 0) {
        return {
          ok: false,
          message: 'Packaging quantity and actual weight must be greater than zero.',
        };
      }
    }

    if (Number(payload.totalAmountInr) <= 0) {
      return {
        ok: false,
        message: 'Total Sauda Amount must be greater than zero.',
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

  private derivePartyName(
    type: SaudaType,
    sellerName: string,
    buyerName: string,
  ): string {
    const s = (sellerName || '').trim();
    const b = (buyerName || '').trim();
    if (type === 'Purchase') return s || '—';
    if (type === 'Sales') return b || '—';
    if (s && b) return `${s} / ${b}`;
    return s || b || '—';
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
      if (Number(item.packagingQty) <= 0 || Number(item.actualWeight) <= 0) {
        return {
          ok: false,
          message: 'Packaging quantity and actual weight must be greater than zero.',
        };
      }
    }

    const loadedQtyMt = this.computeTotalWeightMt(payload.commodityItems);
    const remaining = this.getRemainingQtyMt(payload.saudaId);
    if (loadedQtyMt > remaining) {
      return {
        ok: false,
        message: `Total truck weight (${loadedQtyMt} MT) exceeds remaining Sauda balance (${remaining} MT).`,
      };
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
          reason: `Truck entry created against ${sauda.saudaNo}`,
          changes: [
            {
              field: 'Truck Number',
              oldValue: '-',
              newValue: payload.vehicleNo.trim().toUpperCase(),
            },
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

    this.trucksSubject.next([newTruck, ...this.trucksSubject.value]);
    this.syncInventoryForTruck(null, newTruck);
    this.recomputeAllSaudaStatuses();

    return { ok: true, message: `Truck entry ${entryNo} created successfully.` };
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
      if (Number(item.packagingQty) <= 0 || Number(item.actualWeight) <= 0) {
        return {
          ok: false,
          message: 'Packaging quantity and actual weight must be greater than zero.',
        };
      }
    }

    const loadedQtyMt = this.computeTotalWeightMt(payload.commodityItems);
    const remaining = this.getRemainingQtyMt(payload.saudaId, id);
    if (loadedQtyMt > remaining) {
      return {
        ok: false,
        message: `Total truck weight (${loadedQtyMt} MT) exceeds available Sauda balance (${remaining} MT).`,
      };
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
    this.pushDiff(changes, 'Truck Number', existing.vehicleNo, normalizedVehicle);
    this.pushDiff(changes, 'Truck Entry Date', existing.dispatchDate, payload.dispatchDate);
    this.pushDiff(changes, 'Commodities', existing.commodities, commodities);
    this.pushDiff(
      changes,
      'Loaded Weight (MT)',
      `${existing.loadedQtyMt} MT`,
      `${loadedQtyMt} MT`,
    );
    this.pushDiff(changes, 'Driver Name', existing.driverName, payload.driverName);
    this.pushDiff(changes, 'Transporter', existing.transporterName, payload.transporterName);
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

    this.trucksSubject.next(
      this.trucksSubject.value.map((t) => (t.id === id ? updatedTruck : t)),
    );
    this.syncInventoryForTruck(existing, updatedTruck);
    this.recomputeAllSaudaStatuses();

    return {
      ok: true,
      message: `Truck entry ${existing.entryNo} updated (Revision v${nextVersion}).`,
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

  createFirm(name: string): ActionResult {
    const trimmed = (name || '').trim();
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
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    this.firmsSubject.next([newFirm, ...this.firmsSubject.value]);
    return { ok: true, message: `Firm "${trimmed}" added successfully.` };
  }

  updateFirm(id: string, name: string): ActionResult {
    const existing = this.firmsSubject.value.find((f) => f.id === id);
    if (!existing) {
      return { ok: false, message: 'Firm not found.' };
    }

    const trimmed = (name || '').trim();
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
        f.id === id ? { ...f, name: trimmed, updatedAt: now } : f,
      ),
    );
    return { ok: true, message: `Firm updated to "${trimmed}".` };
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
    const packagingUom = payload.packagingUom || product.packagingUom;
    const now = this.formatTimestamp();
    const existing = this.inventorySubject.value.find(
      (i) =>
        (i.productId === product.id ||
          (!i.productId && i.commodity.toLowerCase() === commodity.toLowerCase())) &&
        i.clientFirm.toLowerCase() === payload.clientFirm.toLowerCase(),
    );

    const sign = payload.action === 'Stock In' ? 1 : -1;
    const unitsDelta = sign * Number(payload.units);
    const weightDelta = Number((sign * Number(payload.weightMt)).toFixed(3));

    if (payload.action === 'Stock Out') {
      if (!existing) {
        return {
          ok: false,
          message: `No stock record exists for ${product.name} under ${payload.clientFirm}.`,
        };
      }
      if (Number(payload.weightMt) > existing.availableWeightMt) {
        return {
          ok: false,
          message: `Cannot dispatch ${payload.weightMt} MT. Only ${existing.availableWeightMt} MT available.`,
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
      const updated: InventoryRecord = {
        ...existing,
        productId: product.id,
        productName: product.name,
        categoryId,
        categoryName,
        subCategoryName,
        commodity,
        packagingUom,
        availableUnits: Math.max(0, existing.availableUnits + unitsDelta),
        availableWeightMt: Math.max(
          0,
          Number((existing.availableWeightMt + weightDelta).toFixed(3)),
        ),
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
        message: `${payload.action} updated for ${product.name} (${existing.clientFirm}).`,
      };
    }

    const nextNum = this.inventorySubject.value.length + 1;
    const newItem: InventoryRecord = {
      id: `INV-${String(nextNum).padStart(3, '0')}`,
      productId: product.id,
      productName: product.name,
      categoryId,
      categoryName,
      subCategoryName,
      commodity,
      clientFirm: payload.clientFirm,
      packagingUom,
      availableUnits: Number(payload.units),
      availableWeightMt: Number(payload.weightMt),
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
      message: `Inventory stock added for ${product.name} (${payload.clientFirm}).`,
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
    if (!sauda || sauda.saudaType === 'Brokerage') {
      return;
    }

    const baseSign = sauda.saudaType === 'Purchase' ? 1 : -1;
    const effectiveSign = baseSign * operationSign;
    const now = this.formatTimestamp();
    let list = [...this.inventorySubject.value];

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
        : `Auto ${sauda.saudaType === 'Purchase' ? 'inward' : 'dispatch'} from ${truck.entryNo} (${truck.status}) — ${sauda.saudaNo}`;

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
          i.clientFirm.toLowerCase() === sauda.clientFirm.toLowerCase(),
      );

      if (existingIdx >= 0) {
        const existing = list[existingIdx];
        list[existingIdx] = {
          ...existing,
          productId: productId || existing.productId,
          productName: productName || existing.productName,
          categoryId: hierarchy.categoryId || existing.categoryId,
          categoryName: hierarchy.categoryName || existing.categoryName,
          subCategoryName: hierarchy.subCategoryName || existing.subCategoryName,
          availableUnits: Math.max(0, existing.availableUnits + unitsDelta),
          availableWeightMt: Math.max(
            0,
            Number((existing.availableWeightMt + weightDelta).toFixed(3)),
          ),
          lastUpdated: now,
          logs: [logEntry, ...existing.logs],
        };
      } else {
        const nextNum = list.length + 1;
        list = [
          {
            id: `INV-${String(nextNum).padStart(3, '0')}`,
            productId,
            productName,
            categoryId: hierarchy.categoryId,
            categoryName: hierarchy.categoryName,
            subCategoryName: hierarchy.subCategoryName,
            commodity: item.commodity,
            clientFirm: sauda.clientFirm,
            packagingUom: item.packagingUom || matchedProduct?.packagingUom || 'Bag',
            availableUnits: Math.max(0, unitsDelta),
            availableWeightMt: Math.max(0, weightDelta),
            minThresholdMt: 2,
            lastUpdated: now,
            logs: [logEntry],
          },
          ...list,
        ];
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
    packagingUom: PackagingUom;
    weightUom: WeightUom;
    minStock: number;
  }): ActionResult {
    const trimmed = (payload.name || '').trim();
    if (trimmed.length < 2 || !payload.subCategoryId) {
      return {
        ok: false,
        message: 'Product name and Sub Category are required.',
      };
    }
    if (Number(payload.minStock) < 0) {
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
    const record: InvProductRecord = {
      id: `PRD-${String(nextNum).padStart(3, '0')}`,
      name: trimmed,
      subCategoryId: payload.subCategoryId,
      packagingUom: payload.packagingUom,
      weightUom: payload.weightUom,
      minStock: Number(payload.minStock),
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
      packagingUom: PackagingUom;
      weightUom: WeightUom;
      minStock: number;
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
    if (Number(payload.minStock) < 0) {
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
    this.invProductsSubject.next(
      this.invProductsSubject.value.map((p) =>
        p.id === id
          ? {
              ...p,
              name: trimmed,
              subCategoryId: payload.subCategoryId,
              packagingUom: payload.packagingUom,
              weightUom: payload.weightUom,
              minStock: Number(payload.minStock),
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

  // ── Packaging UOM Operations ──

  createPackagingUom(name: string): ActionResult {
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
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.packagingUomsSubject.next([record, ...this.packagingUomsSubject.value]);
    return { ok: true, message: `Packaging UOM "${trimmed}" created successfully.` };
  }

  updatePackagingUom(id: string, name: string): ActionResult {
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
        u.id === id ? { ...u, name: trimmed, updatedAt: now } : u,
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

  createWarehouse(name: string, city: string): ActionResult {
    const trimmedName = (name || '').trim();
    const trimmedCity = (city || '').trim();
    if (trimmedName.length < 2) {
      return { ok: false, message: 'Warehouse name must be at least 2 characters.' };
    }
    if (trimmedCity.length < 2) {
      return { ok: false, message: 'City must be at least 2 characters.' };
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
    const record: WarehouseRecord = {
      id: `WH-${String(nextNum).padStart(3, '0')}`,
      name: trimmedName,
      city: trimmedCity,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.warehousesSubject.next([record, ...this.warehousesSubject.value]);
    return { ok: true, message: `Warehouse "${trimmedName}" created successfully.` };
  }

  updateWarehouse(id: string, name: string, city: string): ActionResult {
    const existing = this.warehousesSubject.value.find((w) => w.id === id);
    if (!existing) return { ok: false, message: 'Warehouse not found.' };
    const trimmedName = (name || '').trim();
    const trimmedCity = (city || '').trim();
    if (trimmedName.length < 2) {
      return { ok: false, message: 'Warehouse name must be at least 2 characters.' };
    }
    if (trimmedCity.length < 2) {
      return { ok: false, message: 'City must be at least 2 characters.' };
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
    this.warehousesSubject.next(
      this.warehousesSubject.value.map((w) =>
        w.id === id
          ? { ...w, name: trimmedName, city: trimmedCity, updatedAt: now }
          : w,
      ),
    );
    return { ok: true, message: `Warehouse "${trimmedName}" updated successfully.` };
  }

  toggleWarehouseStatus(id: string): ActionResult {
    const existing = this.warehousesSubject.value.find((w) => w.id === id);
    if (!existing) return { ok: false, message: 'Warehouse not found.' };
    const nextActive = !existing.isActive;
    const now = this.formatTimestamp();
    this.warehousesSubject.next(
      this.warehousesSubject.value.map((w) =>
        w.id === id ? { ...w, isActive: nextActive, updatedAt: now } : w,
      ),
    );
    return {
      ok: true,
      message: `${existing.name} marked as ${nextActive ? 'Active' : 'Inactive'}.`,
    };
  }

  // ── Internal Helpers ──

  private recomputeAllSaudaStatuses(): void {
    const trucks = this.trucksSubject.value;
    const updated = this.saudasSubject.value.map((sauda) => {
      if (sauda.status === 'Voided') {
        return sauda;
      }
      const dispatched = trucks
        .filter((t) => t.saudaId === sauda.id && t.status !== 'Removed')
        .reduce((sum, t) => sum + Number(t.loadedQtyMt || 0), 0);

      let status: SaudaStatus = 'Open';
      if (dispatched >= sauda.quantityMt) {
        status = 'Completed';
      } else if (dispatched > 0) {
        status = 'Partial';
      }
      return { ...sauda, status };
    });
    this.saudasSubject.next(updated);
  }

  private pushDiff(
    changes: RevisionDiff[],
    field: string,
    oldVal: string,
    newVal: string,
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

