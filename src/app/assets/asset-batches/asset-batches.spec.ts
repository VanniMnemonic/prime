import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetBatches } from './asset-batches';

describe('AssetBatches', () => {
  let component: AssetBatches;
  let fixture: ComponentFixture<AssetBatches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetBatches],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetBatches);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
