import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NFTCollectionsComponent } from './nftcollections.component';

describe('NFTCollectionsComponent', () => {
  let component: NFTCollectionsComponent;
  let fixture: ComponentFixture<NFTCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NFTCollectionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NFTCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
