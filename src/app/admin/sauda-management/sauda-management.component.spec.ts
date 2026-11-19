import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaudaManagementComponent } from './sauda-management.component';

describe('SaudaManagementComponent', () => {
  let component: SaudaManagementComponent;
  let fixture: ComponentFixture<SaudaManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaudaManagementComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SaudaManagementComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
