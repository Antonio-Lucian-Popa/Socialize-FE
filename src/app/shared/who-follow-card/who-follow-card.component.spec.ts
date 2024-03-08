import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoFollowCardComponent } from './who-follow-card.component';

describe('WhoFollowCardComponent', () => {
  let component: WhoFollowCardComponent;
  let fixture: ComponentFixture<WhoFollowCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoFollowCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhoFollowCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
