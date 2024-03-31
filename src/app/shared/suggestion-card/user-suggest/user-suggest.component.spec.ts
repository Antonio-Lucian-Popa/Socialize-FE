import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSuggestComponent } from './user-suggest.component';

describe('UserSuggestComponent', () => {
  let component: UserSuggestComponent;
  let fixture: ComponentFixture<UserSuggestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSuggestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSuggestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
