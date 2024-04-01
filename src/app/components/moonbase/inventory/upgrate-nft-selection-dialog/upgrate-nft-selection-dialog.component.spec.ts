import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgrateNftSelectionDialogComponent } from './upgrate-nft-selection-dialog.component';

describe('UpgrateNftSelectionDialogComponent', () => {
  let component: UpgrateNftSelectionDialogComponent;
  let fixture: ComponentFixture<UpgrateNftSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpgrateNftSelectionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgrateNftSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
