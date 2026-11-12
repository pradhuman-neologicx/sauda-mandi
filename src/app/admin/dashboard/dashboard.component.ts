import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  SaudaErpMockService,
  SaudaRecord,
  TruckEntryRecord,
} from 'src/app/core/services/sauda-erp-mock.service';

interface CommoditySummary {
  commodity: string;
  totalMt: number;
  dispatchedMt: number;
  pendingMt: number;
  contracts: number;
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DecimalPipe],
  selector: 'app-dashboard',
  styleUrl: './dashboard.component.scss',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  saudas: SaudaRecord[] = [];
  trucks: TruckEntryRecord[] = [];

  // KPI metrics
  activeSaudaCount = 0;
  openOrPartialCount = 0;
  totalContractedMt = 0;
  totalDispatchedMt = 0;
  totalPendingMt = 0;
  totalContractValueInr = 0;
  activeTruckCount = 0;
  inTransitTruckCount = 0;
  voidOrRemovedCount = 0;

  commoditySummaries: CommoditySummary[] = [];

  constructor(public erpService: SaudaErpMockService) {}

  ngOnInit(): void {
    combineLatest([this.erpService.saudas$, this.erpService.trucks$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([saudas, trucks]) => {
        this.saudas = saudas;
        this.trucks = trucks;
        this.computeMetrics();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private computeMetrics(): void {
    const activeSaudas = this.saudas.filter((s) => s.status !== 'Voided');
    const activeTrucks = this.trucks.filter((t) => t.status !== 'Removed');

    this.activeSaudaCount = activeSaudas.length;
    this.openOrPartialCount = activeSaudas.filter(
      (s) => s.status === 'Open' || s.status === 'Partial',
    ).length;

    this.totalContractedMt = activeSaudas.reduce(
      (sum, s) => sum + s.quantityMt,
      0,
    );
    this.totalDispatchedMt = activeTrucks.reduce(
      (sum, t) => sum + t.loadedQtyMt,
      0,
    );
    this.totalPendingMt = Math.max(
      0,
      Number((this.totalContractedMt - this.totalDispatchedMt).toFixed(2)),
    );
    this.totalContractValueInr = activeSaudas.reduce(
      (sum, s) => sum + this.erpService.getSaudaValueInr(s),
      0,
    );

    this.activeTruckCount = activeTrucks.length;
    this.inTransitTruckCount = activeTrucks.filter(
      (t) => t.status === 'In Transit' || t.status === 'Loaded',
    ).length;
    this.voidOrRemovedCount =
      this.saudas.filter((s) => s.status === 'Voided').length +
      this.trucks.filter((t) => t.status === 'Removed').length;

    const map = new Map<string, CommoditySummary>();
    for (const s of activeSaudas) {
      const dispatched = this.erpService.getDispatchedQtyMt(s.id);
      const pending = this.erpService.getRemainingQtyMt(s.id);
      const curr = map.get(s.commodity) || {
        commodity: s.commodity,
        totalMt: 0,
        dispatchedMt: 0,
        pendingMt: 0,
        contracts: 0,
      };
      curr.totalMt += s.quantityMt;
      curr.dispatchedMt += dispatched;
      curr.pendingMt += pending;
      curr.contracts += 1;
      map.set(s.commodity, curr);
    }
    this.commoditySummaries = Array.from(map.values()).sort(
      (a, b) => b.totalMt - a.totalMt,
    );
  }

  getFulfillmentPercent(sauda: SaudaRecord): number {
    if (!sauda.quantityMt) return 0;
    const dispatched = this.erpService.getDispatchedQtyMt(sauda.id);
    return Math.min(100, Math.round((dispatched / sauda.quantityMt) * 100));
  }

  getSaudaBadgeClass(status: string): string {
    switch (status) {
      case 'Open':
        return 'badge-blue';
      case 'Partial':
        return 'badge-amber';
      case 'Completed':
        return 'badge-green';
      case 'Voided':
        return 'badge-red';
      default:
        return 'badge-slate';
    }
  }

  getTruckBadgeClass(status: string): string {
    switch (status) {
      case 'Scheduled':
        return 'badge-slate';
      case 'Loaded':
        return 'badge-indigo';
      case 'In Transit':
        return 'badge-amber';
      case 'Delivered':
        return 'badge-green';
      case 'Removed':
        return 'badge-red';
      default:
        return 'badge-slate';
    }
  }
}
