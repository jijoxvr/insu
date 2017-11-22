import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistToClaimComponent } from './assist-to-claim.component';

describe('AssistToClaimComponent', () => {
  let component: AssistToClaimComponent;
  let fixture: ComponentFixture<AssistToClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistToClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistToClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
