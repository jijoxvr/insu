import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupClaimStatusComponent } from './group-claim-status.component';

describe('GroupClaimStatusComponent', () => {
  let component: GroupClaimStatusComponent;
  let fixture: ComponentFixture<GroupClaimStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupClaimStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupClaimStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
