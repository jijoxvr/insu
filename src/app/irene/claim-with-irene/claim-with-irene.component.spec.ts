import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimWithIreneComponent } from './claim-with-irene.component';

describe('ClaimWithIreneComponent', () => {
  let component: ClaimWithIreneComponent;
  let fixture: ComponentFixture<ClaimWithIreneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimWithIreneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimWithIreneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
