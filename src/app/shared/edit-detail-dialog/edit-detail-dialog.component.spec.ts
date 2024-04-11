import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDetailDialogComponent } from './edit-detail-dialog.component';

describe('EditDetailDialogComponent', () => {
  let component: EditDetailDialogComponent;
  let fixture: ComponentFixture<EditDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDetailDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
