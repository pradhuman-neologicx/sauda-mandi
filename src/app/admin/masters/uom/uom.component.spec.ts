import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UomComponent } from './uom.component';

describe('UomComponent', () => {
  let component: UomComponent;
  let fixture: ComponentFixture<UomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UomComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UomComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
