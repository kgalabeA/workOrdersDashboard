import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegionChip } from './region-chip';

describe('RegionChip', () => {
  let component: RegionChip;
  let fixture: ComponentFixture<RegionChip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionChip],
    }).compileComponents();

    fixture = TestBed.createComponent(RegionChip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
