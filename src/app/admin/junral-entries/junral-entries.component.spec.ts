import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JunralEntriesComponent } from './junral-entries.component';

describe('JunralEntriesComponent', () => {
  let component: JunralEntriesComponent;
  let fixture: ComponentFixture<JunralEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JunralEntriesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(JunralEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
