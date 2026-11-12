import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirmManagementComponent } from './firm-management.component';

describe('FirmManagementComponent', () => {
  let component: FirmManagementComponent;
  let fixture: ComponentFixture<FirmManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirmManagementComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FirmManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
