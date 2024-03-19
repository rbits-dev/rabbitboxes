import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeNftDialogComponent } from './upgrade-nft-dialog.component';

describe('UpgradeNftDialogComponent', () => {
  let component: UpgradeNftDialogComponent;
  let fixture: ComponentFixture<UpgradeNftDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpgradeNftDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeNftDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});