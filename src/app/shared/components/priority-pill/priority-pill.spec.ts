import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriorityPill } from './priority-pill';

describe('PriorityPill', () => {
  let component: PriorityPill;
  let fixture: ComponentFixture<PriorityPill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorityPill],
    }).compileComponents();

    fixture = TestBed.createComponent(PriorityPill);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
