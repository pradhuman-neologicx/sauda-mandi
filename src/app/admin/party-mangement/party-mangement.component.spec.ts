import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartyMangementComponent } from './party-mangement.component';

describe('PartyMangementComponent', () => {
  let component: PartyMangementComponent;
  let fixture: ComponentFixture<PartyMangementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartyMangementComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PartyMangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
