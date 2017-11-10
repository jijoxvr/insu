import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPolicesComponent } from './user-polices.component';

describe('UserPolicesComponent', () => {
  let component: UserPolicesComponent;
  let fixture: ComponentFixture<UserPolicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPolicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPolicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
