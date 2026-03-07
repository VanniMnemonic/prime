import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetBatchForm } from './asset-batch-form';

describe('AssetBatchForm', () => {
  let component: AssetBatchForm;
  let fixture: ComponentFixture<AssetBatchForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetBatchForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetBatchForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
