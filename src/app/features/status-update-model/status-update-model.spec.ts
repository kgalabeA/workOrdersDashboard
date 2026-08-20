import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusUpdateModel } from './status-update-model';

describe('StatusUpdateModel', () => {
  let component: StatusUpdateModel;
  let fixture: ComponentFixture<StatusUpdateModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusUpdateModel],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusUpdateModel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
