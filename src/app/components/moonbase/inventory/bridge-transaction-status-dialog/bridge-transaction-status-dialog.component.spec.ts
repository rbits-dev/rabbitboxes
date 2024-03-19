import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BridgeTransactionStatusDialogComponent } from './bridge-transaction-status-dialog.component';

describe('BridgeTransactionStatusDialogComponent', () => {
  let component: BridgeTransactionStatusDialogComponent;
  let fixture: ComponentFixture<BridgeTransactionStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BridgeTransactionStatusDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BridgeTransactionStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
